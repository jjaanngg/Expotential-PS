// server.js

// ※ 기본 셋팅
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // dotenv import 추가
import cron from 'node-cron';

// ※ 라우터 import
import signupRoute from './routes/signup.js';
import loginRoute from './routes/login.js';
import usersRoute from './routes/users.js';
import problemRoute from './routes/problems.js'; // problemRoute import 추가
import setList from './routes/setList.js';
import setDetailRoutes from './routes/setDetail.js'; // setDetailRoutes 이름으로 import
import setCreate from './routes/setCreate.js';
import solveCheckRouter from "./routes/solveCheck.js";
import solveStatusRouter from './routes/solveStatus.js'; // solveStatusRouter import 추가
import rankingRoute from './routes/ranking.js'; // rankingRoute import 추가
import rewardRouter from "./routes/reward.js";


// ※ 서비스 및 모델 import
import { syncUserRatingsSafe } from './services/scoring.js';
import User from './models/User.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

console.log('[Check 1] 서버 파일 시작');

// ※ 미들웨어 설정
app.use(cors());
app.use(express.json());

console.log('[Check 2] 라우터 등록 시작');

// ※ 라우터 등록
app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/api/users', usersRoute);
app.use('/api/problems', problemRoute);
app.use('/api/sets', setList);
app.use('/api/sets', setDetailRoutes);
app.use('/api/sets', setCreate);
app.use("/api/solve-check", solveCheckRouter);
app.use('/api/solve-status', solveStatusRouter);
app.use('/api/ranking', rankingRoute);
app.use("/api/reward", rewardRouter);

console.log('[Check 3] DB 연결 시도 전');

// ※ MongoDB 연결 및 서버 실행
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[Check 4] ✅ MongoDB 연결 성공!');
    app.listen(PORT, () => {
      console.log(`[Check 5] 🎉 서버가 ${PORT}번 포트에서 실행 중입니다.`);
    });
  })
  .catch(err => {
    console.error('[Check 6] ❌ MongoDB 연결 실패:', err.message);
  });

// ※ 기본 경로 응답
app.get('/', (req, res) => {
    res.send('서버 정상 작동 중');
});

// ※ CRON 스케줄러
cron.schedule('0 3 * * *', async () => {
  console.log('[CRON] 03:00 전체 사용자 점수 동기화 시작');
  try {
    const cursor = User.find({}).select('_id').lean().cursor();
    for await (const u of cursor) {
      await syncUserRatingsSafe(u._id, "daily");
    }
    console.log('[CRON] 전체 동기화 완료');
  } catch (e) {
    console.error('[CRON] 전체 동기화 실패:', e);
  }
}, {
  timezone: 'Asia/Seoul'
});