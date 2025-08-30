// routes/users.js
import express from 'express';
import auth from '../middlewares/auth.js';
import User from '../models/User.js';

const router = express.Router();

// [GET /api/users/me] : 로그인된 '나'의 정보만 가져오기 (새로 추가!)
router.get('/me', auth, async (req, res) => {
  try {
    // auth 미들웨어가 넣어준 req.user.id로 DB에서 내 정보를 찾는다.
    const user = await User.findById(req.user.id).select('-passwordHash'); // 비밀번호 제외
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('내 정보 조회 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// [GET /api/users] : 전체 사용자 목록 가져오기 (기존 기능)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}, 'nickname email');
    res.status(200).json(users);
  } catch (err) {
    console.error('사용자 목록 조회 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;