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

    // ✅ [수정됨] 사용자가 푼 문제 목록을 직접 가져오는 올바른 API 주소로 변경
    const solvedAcRes = await axios.get(
      `https://solved.ac/api/v3/search/problem?query=solved_by:${user.solved_id}`
    );
    
    // ✅ [수정됨] API 응답 구조에 맞게 실제 문제 목록을 가져옴
    const solvedProblems = solvedAcRes.data.items || [];
    
    const solvedProblemSet = new Set(solvedProblems.map(p => p.problemId));

    const results = problemIdsToCheck.map(pid => ({
      problemId: pid,
      solved: solvedProblemSet.has(pid)
    }));
    
    res.status(200).json({ results });

  } catch (err) {
    console.error('풀이 상태 확인 중 오류:', err);
    res.status(500).json({ message: '외부 API 조회 중 서버 오류가 발생했습니다.' });
  }
});

export default router;