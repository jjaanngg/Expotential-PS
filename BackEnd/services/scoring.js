// services/scoring.js
import User from "../models/User.js";
import axios from "axios";
import Bottleneck from "bottleneck";
import SyncFailure from "../models/SyncFailure.js";

// ──────────────────────────────────────────────────────────
// 레이트리밋
// - 외부 API 폭주 방지 (동시 2, 호출 간격 ≥ 150ms)
const limiter = new Bottleneck({ maxConcurrent: 2, minTime: 150 });

const http = axios.create({ timeout: 8000, headers: { "User-Agent": "ExpotentialPS/1.0 (+server)" } });

// 지수 백오프 + 지터 (단순 구현)
// - fn(실제 실행할 API함수) / 최대시도횟수 / 첫 대기시간 / 최대 대기시간
async function withRetry(fn, { tries = 4, base = 300, cap = 3000 } = {}) {
  let attempt = 0;  // 시도 횟수
  let lastErr;      // 마지막 에러
  while (attempt < tries) {
    try {
      return await fn();  // 성공 시, 결과 반환
    } catch (err) {
      lastErr = err;      // 실패 시, 기록
      attempt++;
      if (attempt >= tries) break;
      const delay = Math.min(cap, base * 2 ** (attempt - 1));
      const jitter = Math.floor(Math.random() * 150); // ±지터 (랜덤 ms 추가 -> 요청 분산)
      await new Promise(r => setTimeout(r, delay + jitter));
    }
  }
  throw lastErr;
}

// ──────────────────────────────────────────────────────────
// 플랫폼별 점수 가져오기 
async function fetchSolvedRating(handle) {
  if (!handle) return 0;
  return limiter.schedule(() =>
    withRetry(async () => {
      const { data } = await http.get(
        `https://solved.ac/api/v3/user/show?handle=${encodeURIComponent(handle)}`
      );
      return data?.rating ?? 0;
    })
  );
}

async function fetchCodeforcesRating(handle) {
  if (!handle) return 0;
  return limiter.schedule(() =>
    withRetry(async () => {
      const { data } = await http.get(
        `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`
      );
      return data?.result?.[0]?.rating ?? 0;
    })
  );
}

async function fetchAtcoderRating(handle) {
  if (!handle) return 0;
  return limiter.schedule(() =>
    withRetry(async () => {
      const { data } = await http.get(
        `https://atcoder.jp/users/${encodeURIComponent(handle)}/history/json`
      );
      const history = Array.isArray(data) ? data : [];
      if (!history.length) return 0;
      return history[history.length - 1]?.NewRating ?? 0;
    })
  );
}

// ──────────────────────────────────────────────────────────
// 점수 환산 함수
function fromZ(z) { // 역 Z-Score
  return 1500 + 350 * z;  
}
function clamp(x, min, max) { // 범위 설정
  return Math.min(Math.max(x, min), max);
}

// ──────────────────────────────────────────────────────────
// 총합 계산 & 저장
export async function updateUserRatings(userId) {
  // 1) 사용자 찾기
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // 2) 플랫폼별 raw rating 수집
  const [solvedRaw, cfRaw, acRaw] = await Promise.all([
    fetchSolvedRating(user.solved_id),
    fetchCodeforcesRating(user.cf_id),
    fetchAtcoderRating(user.atcoder_id),
  ]);

  // 3) 정규화(Z-score)
  const zSolved = (solvedRaw - 1500) / 350;
  const zCf     = (cfRaw    - 1500) / 350;
  const zAc     = (acRaw    - 1500) / 350;

  // 4) 가중 평균
  const zTotal = (0.5 * zSolved) + (0.3 * zCf) + (0.2 * zAc);

  // 5) 다시 0~3000 점수로 바꿔주기
  const solved = clamp(fromZ(zSolved), 0, 3000);
  const cf     = clamp(fromZ(zCf),     0, 3000);
  const atc    = clamp(fromZ(zAc),     0, 3000);
  const total  = clamp(fromZ(zTotal),  0, 3000);

  // 6) 저장 (정수화)
  user.solvedRating     = Math.round(solved);
  user.codeforcesRating = Math.round(cf);
  user.atcoderRating    = Math.round(atc);
  user.totalRating      = Math.round(total);
  await user.save();

  return { solved, cf, atc, total };
}

// ──────────────────────────────────────────────────────────
// 로그인 시, 동기화
export async function syncUserRatingsSafe(userId, where = "login") {
  try {
    await updateUserRatings(userId);      // 네가 만든 핵심 함수
  } catch (e) {
    // 최소 에러 큐 기록
    try {
      await SyncFailure.create({
        userId,
        where,
        reason: e?.message || String(e)
      });
    } catch (_) { /* 기록 실패는 무시 */ }
  }
}