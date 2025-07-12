import React, {useState} from 'react'; // useState는 웹페이지 안에서 바뀌는 값(버튼 누르면 무엇인가 바뀐다거나,,)을 기억하는 기능. 이를 react로부터 가져오는 코드

function App() { // 웹페이지 하나를 모두 담을 함수, 이 안에 버튼, 글자 모든 것들이 들어갈 예정임
  const [message, setMessage] = useState(''); // 초기 메시지는 '' 아무것도 없음
  //message : 화면에 보여줄 글자, setMessage : 이 글자 바꿀 수 있는 리모컨 역할
  
  const handleClick = async () => { // async는 PRD Bot 개발 때도 봤겠지만, 잠시 서버 응답을 기다리라는 것.
    //버튼을 눌렀을 때 실행시킬 함수

    try {
      const response = await fetch('http:localhost:3000/'); // 3000은 프론트 포트, 4000은 백엔드 포트
      const data = await response.text(); // 서버가 응답한 글자를 저장하는 변수, text()는 문자 그대로를 받아올 때 사용
      setMessage(data); // 받은 글자를 data에 저장하는 코드
    } catch (error) { // 만약 오류 났을 때 실행시킬 코드, if의 else 부분이랑 비슷한 느낌
      console.error('서버 요청 실패:', error); // 콘솔에 오류와 함께 오류 메시지를 띄우도록 함
    }
  };

  // React 코드
  //align이나 style은 엄청 많이 쓰이니 알아두면 좋음
  return (
    <div align = "middle" style={{paddingTop: '200px' }}>
      <h1>Expotential-PS</h1>
      <button onClick={handleClick}>서버에서 메시지 받아오기!</button>
      <p>{message}</p>
    </div>
  )
}

export default App; // 이 컴포넌트를 다른 파일에서도 쓸 수 있게 한다는 것. 실제로는 index.js라는 파일이 가져다가 화면에 띄운다.