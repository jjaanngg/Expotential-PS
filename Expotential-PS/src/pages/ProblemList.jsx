import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);

  // ※ 서버에서 데이터 가져오기
  useEffect(() => {
    axios.get('/api/problems') // API 엔드포인트는 실제 서버 주소에 맞게 수정
      .then((res) => setProblems(res.data))   // 성공 시, 데이터를 state에 저장
      .catch((err) => console.error(err));    // 에러처리
  }, []);

  // ※ 티어를 int->String으로 변환하기
  const tierText = (tier) => {
    // - 기준 정의
    const groups = [
      { name: "Bronze", range: [1, 5] },
      { name: "Silver", range: [6, 10] },
      { name: "Gold", range: [11, 15] },
      { name: "Platinum", range: [16, 20] },
    ];
    // - 티어 계산
    for (const { name, range } of groups) {
      const [start, end] = range;
      if (tier >= start && tier <= end) {
        const level = end - tier + 1;
        return `${name} ${level}`;
      }
    }
    // - 범위 밖의 경우, 예외처리
    return "Unrated";
  };

  return (
    <div>
      <h2>문제 리스트</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>티어</th>
            <th>푼 사람 수</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => (
            <tr key={p.problemId}>
              <td>{p.problemId}</td>
              <td>{p.titleKo}</td>
              <td>{tierText(p.tier)}</td>
              <td>{p.solvedCount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemList;