// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ✅ 1. 로딩 상태 변수 추가
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true); // ✅ 2. 로그인 시작 -> 로딩 상태 true
    setMessage(''); // 이전 메시지 초기화

    try {
      const res = await axios.post('/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      alert(res.data.message || '로그인 및 점수 동기화 성공!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.message || '로그인 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // ✅ 3. 요청 완료 (성공/실패 무관) -> 로딩 상태 false
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
        disabled={isLoading} // 로딩 중에는 입력 방지
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '40px', width: '200px' }}
        disabled={isLoading} // 로딩 중에는 입력 방지
      />

      {/* ✅ 4. 로딩 상태에 따라 버튼 내용 변경 및 비활성화 */}
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? '로그인 및 점수 동기화 중...' : '로그인'}
      </button>

      {/* 메시지가 있을 때만 보이도록 수정 */}
      {message && <p style={{ color: 'red', marginTop: '20px' }}>{message}</p>}
    </div>
  );
};

export default Login;