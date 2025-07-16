// UserList.jsx
import React, { useEffect, useState } from 'react'; // useEffect는 자동 센서처럼 특정 상태가 바뀌면 자동으로 특정 코드 실행

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
      } finally { // 에러가 나든 안 나든 무조건 실행시킬 코드
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // [] 이 배열이 비어있으면 처음 한 번만 실행하고, 변수 들어가 있으면 그 변수가 바뀔 때마다 실행됨


	// return은 코드 전체 함수가 화면에 무엇을 보여줄지 반환하는 것, HTML과 매우 유사함
	// input은 입력받는 박스 만드는 역할
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

// App 컴포넌트를 외부에서도 사용할 수 있게 export (기본 export)
export default UserList;