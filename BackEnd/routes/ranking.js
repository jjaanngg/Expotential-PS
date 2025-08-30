// routes/ranking.js

import express from 'express';
import User from '../models/User.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

/**
 * [GET] /api/ranking
 * 피그마 디자인에 맞춰 '순위(#)', '아이디(nickname)', '문제 수(problemCount)'를 포함한 랭킹 데이터를 반환합니다.
 */
router.get('/', auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // 피그마에 페이지당 10개씩 보이므로 기본값을 10으로 변경
  const skip = (page - 1) * limit;

  try {
    // 1. DB에서 필요한 데이터를 가져옵니다.
    // 'solvedProblems' 필드를 가져와야 '문제 수'를 계산할 수 있습니다.
    const users = await User.find({})
      .sort({ totalRating: -1 })
      .skip(skip)
      .limit(limit)
      .select('nickname totalRating solvedProblems'); // solvedProblems 필드 추가

    // 2. 프론트엔드가 사용하기 좋은 형태로 데이터를 가공합니다.
    const rankingData = users.map((user, index) => {
      return {
        // 순위 계산: (페이지 번호 - 1) * 페이지당 개수 + 현재 인덱스 + 1
        // 예: 2페이지 첫번째 유저 -> (2-1)*10 + 0 + 1 = 11위
        rank: skip + index + 1,
        nickname: user.nickname,
        // 문제 수: user.solvedProblems 배열의 길이로 계산합니다.
        problemCount: (user.solvedProblems || []).length,
        // 참고용으로 totalRating도 보내줍니다.
        totalRating: user.totalRating,
      };
    });

    const totalUsers = await User.countDocuments();

    // 3. 가공된 데이터를 프론트엔드에 전송합니다.
    res.status(200).json({
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      ranking: rankingData, // 키 이름을 'users'에서 'ranking'으로 변경하여 명확하게 함
    });
  } catch (err) {
    console.error('랭킹 조회 중 오류:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;