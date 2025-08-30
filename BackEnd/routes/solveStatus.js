// routes/solveStatus.js
import express from 'express';
import axios from 'axios';
import auth from '../middlewares/auth.js';
import User from '../models/User.js';

const router = express.Router();

// [POST] /api/solve-status : 세트 내 문제들의 해결 여부 확인
router.post('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { problems: problemIdsToCheck } = req.body;

  if (!Array.isArray(problemIdsToCheck) || problemIdsToCheck.length === 0) {
    return res.status(400).json({ message: '확인할 문제 ID 배열이 필요합니다.' });
  }

  try {
    const user = await User.findById(userId, 'solved_id');
    if (!user || !user.solved_id) {
      return res.status(404).json({ message: '사용자를 찾을 수 없거나 solved.ac 아이디가 등록되지 않았습니다.' });
    }

    // 필요 문제 집합 (숫자 통일)
    const targetSet = new Set(problemIdsToCheck.map(v => Number(v)));
    const foundSet = new Set(); // 이미 찾은 문제
    const solvedSet = new Set(); // 최종 solved 판정

    // 페이지네이션으로 필요한 것만 찾기
    let page = 1;
    const size = 100; // 최대치로 당겨서 요청 수 줄이기
    const maxPages = 50; // 안전한 상한 (과도한 루프 방지)

    while (page <= maxPages && foundSet.size < targetSet.size) {
      const url = `https://solved.ac/api/v3/search/problem?query=solved_by:${encodeURIComponent(
        user.solved_id
      )}&page=${page}&size=${size}`;

      const { data } = await axios.get(url, {
        headers: { "User-Agent": "ExpotentialPS/1.0 (+server)" },
        timeout: 8000,
      });

      const items = Array.isArray(data?.items) ? data.items : [];
      if (items.length === 0) break; // 더 이상 없음

      for (const p of items) {
        const pid = Number(p.problemId);
        if (targetSet.has(pid)) {
          solvedSet.add(pid);
          foundSet.add(pid);
          if (foundSet.size === targetSet.size) break;
        }
      }

      page += 1;
    }

    const results = Array.from(targetSet).map((pid) => ({
      problemId: pid,
      solved: solvedSet.has(pid),
    }));

    return res.json({ results });

  } catch (err) {
    console.error('풀이 상태 확인 중 오류:', err);
    res.status(500).json({ message: '외부 API 조회 중 서버 오류가 발생했습니다.' });
  }
});

export default router;