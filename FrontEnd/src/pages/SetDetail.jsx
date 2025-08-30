// src/pages/SetDetail.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api'; // ✅ axios 대신 api를 import 합니다.

const SetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [solvedMap, setSolvedMap] = useState({});

  // 세트 상세 정보 로드
  useEffect(() => {
    setErrorMsg('');
    setLoading(true);
    api.get(`/api/sets/${id}`) // ✅ axios.get을 api.get으로 변경
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

  // 세트 전체 새로고침 (모든 문제 풀이 여부 확인)
  const handleRefreshAll = async () => {
    setErrorMsg('');
    if (!allProblemIds.length) return;

    try {
      setRefreshing(true);
      // ✅ axios.post를 api.post로 변경 (api가 토큰을 자동으로 포함해줍니다)
      const res = await api.post('/api/solve-status', { problems: allProblemIds });

      const resultArray = res?.data?.results ?? [];
      const next = {};
      for (const r of resultArray) {
        if (r && typeof r.problemId === 'number') {
          next[r.problemId] = !!r.solved;
        }
      }
      setSolvedMap(next);
    } catch (err) {
      console.error('세트 새로고침 실패:', err);
      setErrorMsg('풀이 여부 확인 중 오류가 발생했습니다.');
    } finally {
      setRefreshing(false);
    }
  };

  // -------------------------------------------------------------------
  // 아래의 나머지 코드들은 수정할 필요가 없습니다. (useMemo, tierText, return 부분)
  // -------------------------------------------------------------------
  
  const allProblemIds = useMemo(
    () => problems.map(p => p.problemId).filter(Boolean),
    [problems]
  );
  
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
      {errorMsg && <p style={{ color: 'crimson' }}>{errorMsg}</p>}

      {!loading && (
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={handleRefreshAll}
            disabled={refreshing || allProblemIds.length === 0}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #bbb',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              background: refreshing ? '#f0f0f0' : '#e8f4ff',
              fontWeight: 600
            }}
          >
            {refreshing ? '확인 중...' : '세트 전체 새로고침'}
          </button>
        </div>
      )}

      {loading ? (
        <p>문제 불러오는 중...</p>
      ) : (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr>
              <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>제목</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>티어</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>푼 사람 수</th>
              <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>상태</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(p => {
              const solved = solvedMap[p.problemId];
              return (
                <tr key={p.problemId || p._id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{p.problemId}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{p.titleKo}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{tierText(p.tier)}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{p.solvedCount?.toLocaleString?.() ?? p.solvedCount}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    {solved === true ? (
                      <span style={{ color: '#14804a', fontWeight: 700 }}>해결됨</span>
                    ) : solved === false ? (
                      <span style={{ color: '#8a0000', fontWeight: 700 }}>미해결</span>
                    ) : (
                      <span style={{ color: '#666' }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {!loading && problems.length > 0 && (
        <p style={{ marginTop: 16 }}>
          확인된 문제 수: <b>{Object.keys(solvedMap).length}</b> / {problems.length}
        </p>
      )}
    </div>
  );
};

export default SetDetail;