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
    return 'Unrated';
  };

  // 보상 받기 처리
  const handleClaim = async (problemId) => {
    setErrorMsg('');

    // 1) 토큰 확인
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 2) 중복/로딩 가드
    if (loadingIds.includes(problemId) || submittedIds.includes(problemId)) return;

    // 3) 로딩 표시
    setLoadingIds(prev => [...prev, problemId]);

    try {
      const res = await axios.post(
        '/api/solve-check',
        { problemId }, // 유저 식별은 서버에서 JWT로 처리
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (res.status >= 200 && res.status < 300) {
        setSubmittedIds(prev => [...prev, problemId]);
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 401) {
        // 토큰 만료/잘못된 토큰 → 재로그인 유도
        alert(msg || '세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (status === 409) {
        setSubmittedIds(prev => [...prev, problemId]); // 이미 제출됨 → 완료 처리
      } else {
        console.error('보상 등록 실패:', err);
        setErrorMsg('보상 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    };
  }

  // 버튼 렌더링(상태에 따라 텍스트/스타일 제어)
  const renderClaimButton = (problemId) => {
    const isLoading = loadingIds.includes(problemId);
    const isDone = submittedIds.includes(problemId);

    return (
      <button
        onClick={() => handleClaim(problemId)}
        disabled={isLoading || isDone}
        style={{
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          cursor: isLoading || isDone ? 'not-allowed' : 'pointer',
          background: isDone ? '#d1f7d6' : isLoading ? '#f0f0f0' : '#f5f5f5'
        }}
      >
        {isDone ? '완료됨' : isLoading ? '처리 중...' : '보상 받기'}
      </button>
    );
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
                <td>{p.title}</td>
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