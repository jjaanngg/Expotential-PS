// src/pages/SetDetail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const SetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 세트 정보
  const [title, setTitle] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 보상 버튼 상태
  const [loadingIds, setLoadingIds] = useState([]);     // 제출 중인 problemId 목록
  const [submittedIds, setSubmittedIds] = useState([]); // 완료된 problemId 목록
  const [errorMsg, setErrorMsg] = useState('');         // 상단 에러 메시지

  // 세트 상세 로드
  useEffect(() => {
    setErrorMsg('');
    axios.get(`/api/sets/${id}`)
      .then(res => {
        setTitle(res.data.title || '');
        setProblems(res.data.problems || []);
      })
      .catch(err => {
        console.error('세트 상세 불러오기 실패:', err);
        setErrorMsg('세트 정보를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 티어 텍스트 변환
  const tierText = (tier) => {
    const groups = [
      { name: 'Bronze', range: [1, 5] },
      { name: 'Silver', range: [6, 10] },
      { name: 'Gold', range: [11, 15] },
      { name: 'Platinum', range: [16, 20] },
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
      if (err?.response?.status === 409) {
        // 이미 제출됨 → UX상 완료 처리
        setSubmittedIds(prev => [...prev, problemId]);
      } else {
        console.error('보상 등록 실패:', err);
        setErrorMsg('보상 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== problemId));
    }
  };

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
      {/* 뒤로가기 */}
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

      {/* 제목 & 에러 */}
      <h2>{title}</h2>
      {errorMsg && <p style={{ color: 'crimson' }}>{errorMsg}</p>}

      {/* 로딩/테이블 */}
      {loading ? (
        <p>문제 불러오는 중...</p>
      ) : (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', minWidth: 720 }}>
          <thead>
            <tr>
              <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>제목</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>티어</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>푼 사람 수</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>보상</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(p => (
              <tr key={p.problemId || p._id}>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{p.problemId}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{p.titleKo}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{tierText(p.tier)}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{p.solvedCount?.toLocaleString?.() ?? p.solvedCount}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                  {renderClaimButton(p.problemId)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 완료 요약 */}
      {!loading && problems.length > 0 && (
        <p style={{ marginTop: 16 }}>
          완료: <b>{submittedIds.length}</b> / {problems.length}
        </p>
      )}
    </div>
  );
};

export default SetDetail;