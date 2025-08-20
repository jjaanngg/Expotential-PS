// ※ 기본 셋팅
import express from 'express';                  // express 라이브러리 불러오기
import cors from 'cors';                        // Cross Origin Resource Sharing : 보통 서로 다른 도메인 간에 요청이 보안상의 이유로 막혀 있는데, 이를 해체하기 위해서 가져옴
import mongoose from 'mongoose';                // Node.js 앱에서 MongoDB와 쉽게 통신할 수 있게 도와주는 라이브러리
import signupRoute from './routes/signup.js';   // 회원가입 라우터 가져옴
import loginRoute from './routes/login.js';
import auth from './middlewares/auth.js';
import usersRoute from './routes/users.js';
import setList from './routes/setList.js';
import setDetail from './routes/setDetail.js';
import setCreate from './routes/setCreate.js';
import solveCheckRouter from "./routes/solveCheck.js";

dotenv.config();                    
const app = express();               //  express 앱 객체 생성
const PORT = 4000;                   //  포트 번호 설정

app.use(cors());                     // 다른 출처의 요청을 허가하기 위해 설정
app.use(express.json());             // JSON body 파싱하기 위해서 설정
app.use('/signup', signupRoute);     // signup으로 들어왔을 때, 규칙정의 (회원가입 라우터로 인계)
app.use('/login', loginRoute);
app.use('/api/problems', problemRoute);
app.use('/api/sets', setList); 
app.use('/api/sets', setDetailRoutes); 
app.use('/api/sets', setCreate); 
app.use("/api/solve-check", solveCheckRouter);

// ※ MongoDB 연결 (단순화)
// - mongodb://127.0.0.1:27017/DB이름 -> .env에서 가져옴
mongoose.connect(process.env.MONGO_URI);

// ※ 서버 실행
// - listen(서버띄울 포트번호, 띄운 후 실행할 코드)
// - 4000 port로 웹서버를 열고
// - 잘 열리면 "서버 실행 중"을 출력함
app.listen(PORT, function(){
    console.log('서버 실행 중');
});

// ※ GET을 통해 특정 경로로 들어오면 응답하기
// - get(경로, 실행할 코드)
app.get('/', function(req, res){
    res.send('서버 정상 작동 중');
});