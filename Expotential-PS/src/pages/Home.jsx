import React, { useState } from 'react';

const Home = () => {
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/');
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      console.error('서버 요청 실패:', error);
    }
  };

  return (
    <div align="middle" style={{ paddingTop: '200px' }}>
      <h1>Expotential-PS</h1>
      <button onClick={handleClick}>서버에서 메시지 받아오기!</button>
      <p>{message}</p>
    </div>
  );
};

export default Home;