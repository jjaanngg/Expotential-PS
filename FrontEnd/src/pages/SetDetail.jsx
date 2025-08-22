// src/pages/SetDetail.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const SetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 세트 정보
  const [title, setTitle] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 변경됨: 보상 처리용 상태 제거 → 세트 전체 새로고침 상태로 변경
  const [refreshing, setRefreshing] = useState(false);   // 새로고침 버튼 로딩 상태
  const [errorMsg, setErrorMsg] = useState('');
  const [solvedMap, setSolvedMap] = useState({});        // { problemId: true/false }

  // 세트 상세 로드
  useEffect(() => {
    setErrorMsg('');
    setLoading(true);
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

  // 티어 텍스트 변환 (변경 없음)
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

  // ✅ 변경됨: problemId 단위 보상 버튼 → 세트 전체 problemId 추출
  const allProblemIds = useMemo(
    () => problems.map(p => p.problemId).filter(Boolean),
    [problems]
  );

  // ✅ 변경됨: handleClaim → handleRefreshAll
  // 세트 전체 새로고침 (모든 문제 풀이 여부 확인)
  const handleRefreshAll = async () => {
    setErrorMsg('');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!allProblemIds.length) return;

    try {
      setRefreshing(true);
      // ✅ 변경됨: /api/solve-check (문제 단일) → /api/solve-status (세트 전체)
      const res = await axios.post(
        '/api/solve-status',
        { problems: allProblemIds },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      // ✅ 변경됨: 응답 파싱 로직 (results 배열 기반)
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

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      {/* 뒤로가기 버튼 (변경 없음) */}
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

      {/* ✅ 변경됨: 개별 버튼 → 세트 전체 새로고침 버튼 */}
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

      {/* ✅ 변경됨: 표의 마지막 컬럼 (보상 버튼 → 풀이 상태 표시) */}
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

      {/* ✅ 변경됨: 완료 카운트 → “확인된 문제 수”로 용도 변경 */}
      {!loading && problems.length > 0 && (
        <p style={{ marginTop: 16 }}>
          확인된 문제 수: <b>{Object.keys(solvedMap).length}</b> / {problems.length}
        </p>
      )}
    </div>
  );
};

export default SetDetail;