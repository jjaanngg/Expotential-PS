import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 이메일로 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '이메일이 존재하지 않습니다.' });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: user._id,
        nickname: user.nickname,
      },
      'your_jwt_secret', // 🔒 실제 운영 시 환경변수로 설정하세요
      { expiresIn: '2h' } // 유효 시간
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;