import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        const data = await res.json();
        if (res.ok) {
          alert('Login Completed');
          alert(data.message);
          navigate('/'); //로그인 성공 시 홈으로 이동.
        }
        else setMessage('Login Fail: Wrong Password');
    };

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

export default Login;