// Home.jsx
import React, { useState } from 'react'; // 상태 저장 기능 이용 useState

// const는 변수 선언의 역할로 함수도 넣을 수 있음
// => 는 앞으로 이러한 함수들을 선언된 변수에 추가할 것이다를 암시
const Home = () => {
	//setMessage는 message 값을 바꿔주는 함수, message는 현재 상태를 의미함
  const [message, setMessage] = useState('');
	
	// 얘도 변수 선언이지만 async를 쓰면 서버 응답 기다릴 수 있는 await 사용 가능해서 씀(비동기 함수)
  const handleClick = async () => {
	  // 서버 요청처럼 문제 발생할 수 있는 코드 실행할 때 try 사용, 일단 한번 해본다는 느낌
    try {
      const response = await fetch('http://localhost:4000/');
      const data = await response.text();
      setMessage(data);
    } catch (error) { // 문제 발생했을 때 실행할 코드 catch
      console.error('서버 요청 실패:', error);
    }
  };
	
	// align 좀 유용함
	// return은 코드 전체 함수가 화면에 무엇을 보여줄지 반환하는 것, HTML과 매우 유사함
  return (
    <div align="middle" style={{ paddingTop: '200px' }}>
      <h1>Expotential-PS</h1>
      <button onClick={handleClick}>서버 작동 확인</button>
      <p>{message}</p>
    </div>
  );
};

// App 컴포넌트를 외부에서도 사용할 수 있게 export (기본 export)
export default Home;