import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  // 필수값 체크 추가
  if (!email || !password) {
    console.log("이메일 또는 비밀번호가 비어 있습니다.");
    return res.status(400).json({ message: '이메일 또는 비밀번호가 비어 있습니다.' });
  }

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
      process.env.JWT_SECRET, // 🔒 실제 운영 시 환경변수로 설정하세요
      { expiresIn: '2h' } // 유효 시간
    );
    // message를 줘야 login.jsx의 alert(data.message);에서 메세지 출력 가능
    res.status(200).json({
      message: `환영합니다, ${user.nickname}님!`,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;