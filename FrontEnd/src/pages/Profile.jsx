// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import api from '../api'; // axios 대신 api를 import

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      setErr('');
      try {
        // 새로 만든 '내 정보' API를 호출합니다.
        const { data } = await api.get('/api/users/me');
        setUser(data);
      } catch (e) {
        console.error('내 정보를 불러오는데 실패했습니다.', e);
        setErr('내 정보를 불러올 수 없습니다. 다시 로그인해주세요.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyInfo();
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      <h2 style={{ marginBottom: 8 }}>내 정보</h2>
      <p style={{ color: '#ccc', marginTop: 0 }}>닉네임과 합산 점수를 간단히 보여줍니다.</p>

      {loading ? (
        <p>불러오는 중...</p>
      ) : err ? (
        <Box style={{ background: '#fff5f5', color: '#8a0000', borderColor: '#ffd6d6' }}>{err}</Box>
      ) : user ? (
        <>
          <Box style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#666' }}>닉네임</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{user.nickname}</div>
          </Box>
          <Box>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontSize: 12, color: '#666' }}>통합 점수</div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>
                {user.totalRating ?? '-'}
              </div>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '14px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
              <div>
                <div style={{ color: '#777', fontSize: 12 }}>Solved.ac Rating</div>
                <b>{user.solvedRating ?? '-'}</b>
              </div>
              <div>
                <div style={{ color: '#777', fontSize: 12 }}>Codeforces Rating</div>
                <b>{user.codeforcesRating ?? '-'}</b>
              </div>
              <div>
                <div style={{ color: '#777', fontSize: 12 }}>AtCoder Rating</div>
                <b>{user.atcoderRating ?? '-'}</b>
              </div>
              <div>
                <div style={{ color: '#777', fontSize: 12 }}>푼 문제 수</div>
                <b>{(user.solvedProblems || []).length}</b>
              </div>
            </div>
          </Box>
        </>
      ) : null }
    </div>
  );
}