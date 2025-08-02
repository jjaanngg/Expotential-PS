// src/pages/SetDetail.jsx
import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);   

  useEffect(() => {
    axios.get(`/api/sets/${id}`)
      .then(res => {
        setProblems(res.data.problems);
        setTitle(res.data.title);
      })
      .catch(err => console.error('세트 상세 불러오기 실패:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const tierText = (tier) => {
    const groups = [
      { name: "Bronze", range: [1, 5] },
      { name: "Silver", range: [6, 10] },
      { name: "Gold", range: [11, 15] },
      { name: "Platinum", range: [16, 20] },
    ];
    for (const { name, range } of groups) {
      const [start, end] = range;

      if (tier >= start && tier <= end) {
        const level = end - tier + 1;
        return `${name} ${level}`;
      }
    }
    return "Unrated";
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
        <button onClick={() => navigate('/sets')} style={{
          marginBottom: '20px',
          padding: '8px 16px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          cursor: 'pointer',
          background: '#f5f5f5'
      }}> 
        ← 세트 목록으로 돌아가기
      </button>

      <h2>{title}</h2>
      {loading ? <p>문제 불러오는 중...</p> : (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>제목</th>
              <th>티어</th>
              <th>푼 사람 수</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(p => (
              <tr key={p.problemId || p._id}>
                <td>{p.problemId}</td>
                <td>{p.titleKo}</td>
                <td>{tierText(p.tier)}</td>
                <td>{p.solvedCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SetDetail;