import React, { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);         // 사용자 목록
  const [loading, setLoading] = useState(true);   // 로딩 상태

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:4000/users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('유저 목록 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>사용자 목록</h2>
      {loading ? (
        <p>불러오는 중...</p>
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