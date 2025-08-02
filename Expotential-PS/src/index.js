import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

<<<<<<< Updated upstream:Expotential-PS/src/index.js
const response = await fetch('http://localhost:4000/');
=======
// - document.getElementById('root') : HTML에서 <div id="root"></div>를 찾아서 가져오는 함수, React가 실제로 화면에 그릴 위치 설정
// - ReactDOM.createRoot : root라는 객체를 만들어서 React 컴포넌트 트리의 시작점을 생성
// - root.render(<App />) : App 컴포넌트를 브라우저에 그리는 함수
>>>>>>> Stashed changes:FrontEnd/src/index.js
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);