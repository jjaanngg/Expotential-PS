//Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // fetch 대신 axios 사용

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      alert(res.data.message || '로그인 성공!');
      navigate('/'); // 로그인 성공 시 홈으로 이동.
    } catch (error) {
      console.error('Login error:', error);
      // 백엔드에서 보낸 구체적인 에러 메시지를 표시
      setMessage(error.response?.data?.message || '로그인 요청 중 오류가 발생했습니다.');
    }
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
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default Login;