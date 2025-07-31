// UserList.jsx
import React, { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);         // 사용자 목록
  const [loading, setLoading] = useState(true);   // 로딩 상태
  const [error, setError] = useState(null);       // 오류 메시지

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token'); // 저장된 JWT 토큰 불러오기

      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/users', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // JWT 토큰을 Authorization 헤더에 포함
          },
          credentials: 'include', // 추가된 줄
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError('인증이 필요합니다.');
          } else if (res.status === 403) {
            setError('접근 권한이 없습니다.');
          } else {
            setError('사용자 정보를 불러오는 데 실패했습니다.');
          }
          return;
        }

        const data = await res.json();
        setUsers(data); // 사용자 목록 상태에 저장

      } catch (err) {
        console.error('사용자 목록 요청 중 오류:', err);
        setError('서버와의 연결 중 오류 발생');
      } finally {
        setLoading(false); // 성공 여부와 관계없이 로딩 종료
      }
    };

    fetchUsers(); // 컴포넌트 마운트 시 1회 실행
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>사용자 목록</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user, idx) => (
            <li key={idx} style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              width: '300px',
              margin: '0 auto 10px auto',
              borderRadius: '8px'
            }}>
              <p><strong>닉네임:</strong> {user.nickname}</p>
              <p><strong>이메일:</strong> {user.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;