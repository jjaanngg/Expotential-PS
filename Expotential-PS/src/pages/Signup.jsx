import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!nickname || !email || !password) {
      setMessage('모든 항목을 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/signup', {
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
    } catch (err) {
      console.error(err);
      setMessage('Server Error');
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

      <button onClick={handleSignup}>가입하기</button>
      <p>{message}</p>
    </div>
  );
};

export default Signup;