import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SetList = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/sets')
      .then(res => setSets(res.data))
      .catch(err => console.error('세트 불러오기 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (id) => {
    navigate(`/sets/${id}`);
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>문제 세트 목록</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sets.map(set => (
            <li key={set._id} onClick={() => handleClick(set._id)} style={{
              border: '1px solid #ccc',
              padding: '10px',
              margin: '10px auto',
              width: '300px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              <strong>{set.title}</strong>
              <p>세트 번호: {set.setNumber}</p>
              <p>난이도: {set.tiers.join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SetList;
