import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// getElementById('root') -> index.html의 root라는 id를 가진 곳에
// <App /> -> App.jsx을 그림
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);