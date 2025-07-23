// middlewares/auth.js
import jwt from 'jsonwebtoken';

// 인증 미들웨어 함수 정의
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization 헤더가 없는 경우 처리
  if (!authHeader) {
    return res.status(401).json({ message: '인증 토qkf큰이 없음' });
  }

  // "Bearer <토큰>" 형식이므로 공백으로 나눈 뒤 두 번째 값이 실제 토큰
  const token = authHeader.split(' ')[1];

  try {
    // 토큰 검증 및 해독
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 실제 운영환경에서는 환경변수로 대체
    req.user = decoded; // 요청 객체에 사용자 정보 추가
    next(); // 다음 미들웨어 또는 라우터로 진행
  } catch (err) {
    return res.status(403).json({ message: '유효하지 않은 토큰' });
  }
};

export default authMiddleware;