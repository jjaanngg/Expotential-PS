// routes/users.js
import express from 'express';
import auth from '../middlewares/auth.js'; // 인증 미들웨어
import User from '../models/User.js';

const router = express.Router();

// JWT 인증을 거쳐 사용자 전체 목록을 반환함
router.get('/', auth, async (req, res) => {
  try {
    // 모든 사용자 정보를 조회 (비밀번호는 제외)
    const users = await User.find({}, 'nickname email'); // 필요한 필드만 선택
    res.status(200).json(users);
  } catch (err) {
    console.error('사용자 목록 조회 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;
