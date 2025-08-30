import React, { useState, useEffect } from 'react';
import api from '../api'; // axios 대신 api를 import
import './RankingPage.css';

const RankingPage = () => {
  // ... (useState, handlePageChange, renderPageNumbers 함수는 이전과 동일)
  const [ranking, setRanking] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRanking = async (page) => {
      setLoading(true);
      try {
        // 이제 api가 자동으로 토큰을 헤더에 실어 보냅니다.
        const response = await api.get(`/api/ranking?page=${page}`);
        setRanking(response.data.ranking);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (error) {
        console.error("랭킹 데이터를 가져오는데 실패했습니다.", error);
        alert("랭킹을 불러올 수 없습니다. 로그인이 필요할 수 있습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchRanking(currentPage);
  }, [currentPage]);
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage - 1 <= 2) {
      endPage = Math.min(5, totalPages);
    }
    if (totalPages - currentPage <= 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading) {
    return <div className="loading-container">데이터를 불러오는 중...</div>;
  }
  
  return (
    <div className="ranking-container">
      <h1>일반 랭킹</h1>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>아이디</th>
            <th>문제 수</th>
            <th>종합 점수</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((user) => (
            <tr key={user.rank}>
              <td>{user.rank}</td>
              <td>{user.nickname}</td>
              <td>{user.problemCount.toLocaleString()}</td>
              <td>{user.totalRating.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>&lt;&lt;</button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
        {renderPageNumbers()}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>&gt;&gt;</button>
      </div>
    </div>
  );
};

export default RankingPage;