//Login.jsx
import React, {useState} from 'react'; // 상태 저장 기능 이용 useState
import { useNavigate } from 'react-router-dom';  // URL에 따라서 화면 이동시켜야 하기 때문에 useNavigate 사용


const Login = () => {<div className=""></div>
		// 변수 선언하고 변수 값 바꾸는 함수 선언하고 반복
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
		
		// 변수 선언하고 변수 값 바꾸는 함수 선언하고 반복
    const handleLogin = async () => { // await 사용할거라 async 조건 추가
		    // 여기서 fetch는 브라우저에서 해당 서버에 요청을 보내는 함수, GEt이나 POSt. 여기서는 POST임
        try {
          const res = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
            credentials: 'include', // 추가된 줄
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          alert('Login Completed');
          alert(data.message);
          navigate('/'); // 로그인 성공 시 홈으로 이동.
        }
        else {
          setMessage('Login Fail: Wrong Password');
        }
      }  catch (error) {
          console.error('Login error:', error);
          setMessage('Login 요청 중 오류 발생');
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

        <h1>로그인</h1>
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
          style={{ marginBottom: '40px', width: '200px' }}
        />

        <button onClick={handleLogin}>로그인</button>
        <p>{message}</p>
      </div>
    );
};

// App 컴포넌트를 외부에서도 사용할 수 있게 export (기본 export)
export default Login;