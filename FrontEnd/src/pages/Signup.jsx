// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // fetch 대신 api 클라이언트 사용

const Signup = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [solved_id, setSolved_id] = useState('');
  const [atcoder_id, setAtcoder_id] = useState('');
  const [cf_id, setCF_id] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!nickname || !email || !password) {
      setMessage('닉네임, 이메일, 비밀번호는 필수 항목입니다.');
      return;
    }
    setMessage('');

    try {
      const res = await api.post('/signup', { 
        nickname, email, password, solved_id, atcoder_id, cf_id 
      });

      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
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
      <input
        type="text"
        placeholder="Solved.ac 아이디"
        value={solved_id}
        onChange={(e) => setSolved_id(e.target.value)}
        style={{marginBottom: '10px', width: '200px'}}
      />
      <input
        type="text"
        placeholder="Atcoder 아이디"
        value={atcoder_id}
        onChange={(e) => setAtcoder_id(e.target.value)}
        style={{marginBottom: '10px', width: '200px'}}
      />
      <input
        type="text"
        placeholder="Codeforces 아이디"
        value={cf_id}
        onChange={(e) => setCF_id(e.target.value)}
        style={{marginBottom: '40px', width: '200px'}}
      />
      <button onClick={handleSignup}>가입하기</button>
      {message && <p style={{ color: 'red', marginTop: '20px' }}>{message}</p>}
    </div>
  );
};

export default Signup;