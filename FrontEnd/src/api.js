// src/api.js
import axios from 'axios';

// 1. 새로운 axios 인스턴스(통신원) 생성
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// 2. 통신원이 요청을 보내기 직전에 항상 가방(헤더)을 확인하도록 설정
api.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰을 꺼낸다.
    const token = localStorage.getItem('token');
    // 토큰이 있으면, Authorization 헤더에 담아서 보낸다.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;