// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const linkStyle = {
    display: 'inline-block',
    margin: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    textDecoration: 'none',
    color: '#333',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontWeight: 'bold',
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>Expotential-PS</h1>
      <nav>
        <Link to="/signup" style={linkStyle}>회원가입</Link>
        <Link to="/login" style={linkStyle}>로그인</Link>
        <Link to="/ranking" style={linkStyle}>랭킹 보기</Link>
        <Link to="/sets" style={linkStyle}>문제 세트</Link>
        <Link to="/profile" style={linkStyle}>내 정보</Link>
      </nav>
    </div>
  );
};

export default Home;