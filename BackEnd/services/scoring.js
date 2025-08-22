// services/scoring.js
import User from "../models/User.js";
import axios from "axios";

// 플랫폼별 점수 가져오기 
async function fetchSolvedRating(handle) {
  if (!handle) return 0;
  const res = await axios.get(`https://solved.ac/api/v3/user/show?handle=${handle}`);
  return res.data.rating ?? 0;
}

async function fetchCodeforcesRating(handle) {
  if (!handle) return 0;
  const res = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
  return res.data.result[0].rating ?? 0;
}

async function fetchAtcoderRating(handle) {
  if (!handle) return 0;
  const res = await axios.get(`https://atcoder.jp/users/${handle}/history/json`);
  const history = res.data;
  if (!history.length) return 0;
  return history[history.length - 1].NewRating ?? 0;
}

// 점수 환산 도우미 함수
function fromZ(z) { // 역 Z-Score
  return 1500 + 350 * z;
}
function clamp(x, min, max) { // 범위 설정
  return Math.min(Math.max(x, min), max);
}

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
  const zCf     = (cfRaw - 1500) / 350
  const zAc     = (acRaw - 1500) / 350;

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