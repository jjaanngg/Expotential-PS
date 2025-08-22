// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Box = ({ children, style }) => (
  <div style={{
    border: '1px solid #ddd',
    borderRadius: 12,
    padding: 16,
    background: '#fff',
    color: '#111',
    ...style
  }}>
    {children}
  </div>
);

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [nickname, setNickname] = useState('-');
  const [metrics, setMetrics] = useState({
    unifiedScore: null,
    cfRating: null,
    atcoderRating: null,
    bojSolved: null,
    bojTier: null,
  });

  useEffect(() => {
    const run = async () => {
      setErr('');
      const token = localStorage.getItem('token');
      if (!token) {
        setErr('로그인이 필요합니다.');
        setLoading(false);
        return;
      }
      try {
        // 1) 우선 /api/metrics/me 시도 (권장)
        const { data } = await axios.get('/api/metrics/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNickname(data?.nickname ?? '-');
        setMetrics({
          unifiedScore: data?.unifiedScore ?? null,
          cfRating: data?.cfRating ?? null,
          atcoderRating: data?.atcoderRating ?? null,
          bojSolved: data?.bojSolved ?? null,
          bojTier: data?.bojTier ?? null,
        });
      } catch (e) {
        // 2) 폴백: 닉네임만이라도 채워 표시
        try {
          const { data: users } = await axios.get('/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // 토큰 payload에 nickname이 들어간다면 localStorage에 저장해두고 꺼내는 편이 더 정확합니다.
          // 여기서는 서버에서 전체 목록을 내려줄 때 내가 포함되어 있다는 가정 하에 첫 번째 항목 사용(임시)
          setNickname(Array.isArray(users) && users[0]?.nickname ? users[0].nickname : '-');
        } catch {
          setErr('내 정보를 불러올 수 없습니다.');
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      <h2 style={{ color: '#fff', marginBottom: 8 }}>내 정보</h2>
      <p style={{ color: '#ccc', marginTop: 0 }}>닉네임과 합산 점수를 간단히 보여줍니다.</p>

      {loading ? (
        <p style={{ color: '#ddd' }}>불러오는 중...</p>
      ) : err ? (
        <Box style={{ background: '#fff5f5', color: '#8a0000', borderColor: '#ffd6d6' }}>{err}</Box>
      ) : (
        <>
          <Box style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#666' }}>닉네임</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{nickname}</div>
          </Box>

          <Box>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontSize: 12, color: '#666' }}>통합 점수</div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>
                {metrics.unifiedScore ?? '-'}
              </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '14px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
              <div>
                <div style={{ color: '#777', fontSize: 12 }}>Codeforces Rating</div>
                <b>{metrics.cfRating ?? '-'}</b>
              </div>
              <div>
                <div style={{ color: '#777', fontSize: 12 }}>AtCoder Rating</div>
                <b>{metrics.atcoderRating ?? '-'}</b>
              </div>
              <div>
                <div style={{ color: '#777', fontSize: 12 }}>BOJ Solved</div>
                <b>{metrics.bojSolved ?? '-'}</b>
              </div>
              <div>
                <div style={{ color: '#777', fontSize: 12 }}>BOJ Tier</div>
                <b>{metrics.bojTier ?? '-'}</b>
              </div>
            </div>
          </Box>
        </>
      )}
    </div>
  );
}