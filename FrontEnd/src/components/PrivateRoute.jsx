// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // localStorage에서 토큰을 가져옵니다.
  const token = localStorage.getItem('token');

  // 토큰이 있으면 요청한 페이지를 보여주고, 없으면 로그인 페이지로 보냅니다.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;