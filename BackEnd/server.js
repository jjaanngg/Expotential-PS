// ※ 서버를 띄우기 위한 기본 셋팅 (서버 오픈 문법)
const express = require('express');  //  express 라이브러리 불러오기
const cors = require('cors');        // Cross Origin Resource Sharing : 보통 서로 다른 도메인 간에 요청이 보안상의 이유로 막혀 있는데, 이를 해체하기 위해서 가져옴
const app = express();               //  express 앱 객체 생성
const PORT = 4000;                   //  포트 번호 설정
app.use(cors());

// ※ 서버 실행
// - listen(서버띄울 포트번호, 띄운 후 실행할 코드)
// - 4000 port로 웹서버를 열고
// - 잘 열리면 "서버 실행 중"을 출력함
app.listen(PORT, function(){
    console.log('서버 실행 중');
});

// ※ 특정 경로로 들어오면 응답하기
// - get(경로, 실행할 코드)
app.get('/', function(req, res){
    res.send('지금은 오전 12시 50분... 자고싶다');
});