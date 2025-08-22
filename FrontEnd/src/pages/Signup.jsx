// Signup.jsx
import React, { useState } from 'react'; // 상태 저장 기능 이용 useState
import { useNavigate } from 'react-router-dom'; // URL에 따라서 화면 이동시켜야 하기 때문에 useNavigate 사용

// const는 변수 선언의 역할로 함수도 넣을 수 있음
// => 는 앞으로 이러한 함수들을 선언된 변수에 추가할 것이다를 암시
const Signup = () => {
	// 변수 선언하고 변수 값 바꾸는 함수 선언하고 반복
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  //Signup 안에서 useNavigate 사용되기 때문에 무조건 변수 선언 부분에 넣어줘야 함

	// 얘도 변수 선언이지만 async를 쓰면 서버 응답 기다릴 수 있는 await 사용 가능해서 씀(비동기 함수)
  const handleSignup = async () => {
	  // 하나라도 입력 안된 상황 처리
    if (!nickname || !email || !password) {
      setMessage('모든 항목을 입력해주세요.');
      return;
    }
		// 일단 시도해보는 녀석
		// 여기서 fetch는 브라우저에서 해당 서버에 요청을 보내는 함수, GEt이나 POSt. 여기서는 POST임
    try {
      const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Signup Completed!');
        navigate('/login'); // 가입 완료 후 로그인 페이지로 이동
      } else {
        setMessage(` ${data.message || 'Signup Failed'}`);
      }
    } catch (err) { // 오류 났을 때 예외 처리
      console.error(err);
      setMessage('Server Error');
    }
  };
	
	// return은 코드 전체 함수가 화면에 무엇을 보여줄지 반환하는 것, HTML과 매우 유사함
	// input은 입력받는 박스 만드는 역할
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh'
    }}>
      <h1>회원가입</h1>
      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ marginBottom: '20px', width: '200px' }}
      />

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: '20px', width: '200px' }}
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '30px', width: '200px' }}
      />

      <input
        type="solved_id"
        placeholder="Solved.ac 아이디"
        value={solved_id}
        onChange={(e) => setSolved_id(e.target.value)}
        style={{marginBottom: '10px', width: '200px'}}
      />

      <input
        type="atcoder_id"
        placeholder="Atcoder 아이디"
        value={atcoder_id}
        onChange={(e) => setAtcoder_id(e.target.value)}
        style={{marginBottom: '10px', width: '200px'}}
      />

      <input
        type="cf_id"
        placeholder="Codeforces 아이디"
        value={cf_id}
        onChange={(e) => setCF_id(e.target.value)}
        style={{marginBottom: '40px', width: '200px'}}
      />

      <button onClick={handleSignup}>가입하기</button>
      <p>{message}</p>
    </div>
  );
};

// App 컴포넌트를 외부에서도 사용할 수 있게 export (기본 export)
export default Signup;