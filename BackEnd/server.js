// ※ 기본 셋팅
import express from 'express';                  // express 라이브러리 불러오기
import cors from 'cors';                        // Cross Origin Resource Sharing : 보통 서로 다른 도메인 간에 요청이 보안상의 이유로 막혀 있는데, 이를 해체하기 위해서 가져옴
import mongoose from 'mongoose';                // Node.js 앱에서 MongoDB와 쉽게 통신할 수 있게 도와주는 라이브러리
import dotenv from 'dotenv';

import signupRoute from './routes/signup.js';   // 회원가입 라우터 가져옴
import loginRoute from './routes/login.js';
import problemRoute from './routes/problem.js';
import setList from './routes/setList.js';
import setDetail from './routes/setDetail.js';
import setCreate from './routes/setCreate.js';
import solveCheckRouter from "./routes/solveCheck.js";
import solveStatusRouter from "./routes/solveStatus.js";

import { syncUserRatingsSafe } from './services/scoring.js';
import cron from 'node-cron';
import User from './models/User.js';

dotenv.config();                    
const app = express();               //  express 앱 객체 생성
const PORT = 4000;                   //  포트 번호 설정

app.use(cors());                     // 다른 출처의 요청을 허가하기 위해 설정
app.use(express.json());             // JSON body 파싱하기 위해서 설정

// ※ 라우터 연결
app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/api/problems', problemRoute);
app.use('/api/sets', setList); 
app.use('/api/sets', setDetail); 
app.use('/api/sets', setCreate); 
app.use("/api/solve-check", solveCheckRouter);
app.use('/api/solve-status', solveStatusRouter);

// ※ MongoDB 연결
// - mongodb://127.0.0.1:27017/DB이름 -> .env에서 가져옴
mongoose.connect(process.env.MONGO_URI);

// ※ 서버 실행
app.listen(PORT, function(){ console.log('서버 실행 중'); });

// ※ GET
app.get('/', function(req, res){ res.send('서버 정상 작동 중'); });

// ※ 3:00(KST) 동기화 진행 (import cron)
cron.schedule('0 3 * * *', async () => {
  console.log('[CRON] 03:00 전체 사용자 점수 동기화 시작');
  try {
    // - 전체 사용자 가져옴
    const cursor = User.find({}).select('_id').lean().cursor();
 
    // - 한 명씩 안전 호출 (내부에서 레이트리밋/백오프 적용)
    for await (const u of cursor) {
      await syncUserRatingsSafe(u._id, "daily");
    }
    console.log('[CRON] 전체 동기화 완료');
  } catch (e) {
    console.error('[CRON] 전체 동기화 실패:', e);
  }
}, {
  timezone: 'Asia/Seoul'  // 서버 타임존이 UTC여도 KST 03:00에 실행
});