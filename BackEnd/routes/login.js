// routes/login.js

import express from 'express';
import bcrypt from 'bcrypt'; // bcryptjs 대신 bcrypt를 사용하도록 변경
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { syncUserRatingsSafe } from '../services/scoring.js';

const router = express.Router();
const inflight = new Set(); // 중복 실행 방지

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일 또는 비밀번호가 비어 있습니다.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '이메일이 존재하지 않습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign(
      { id: user._id, nickname: user.nickname },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    
    res.status(200).json({
      message: `환영합니다, ${user.nickname}님!`,
      token
    });

    const key = String(user._id);
    if (inflight.has(key)) return;

    inflight.add(key);
    setImmediate(async () => {
      try {
        await syncUserRatingsSafe(user._id, "login");
      } finally {
        inflight.delete(key);
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;