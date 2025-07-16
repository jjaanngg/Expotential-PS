// App.js
import React from 'react';
// React Router에서 웹사이트 내 페이지 이동을 관리해주는 도구들을 불러옴
// BrowserRouter: 브라우저의 주소창과 연동되는 라우터
// Routes: 여러 개의 Route(길)를 묶는 태그
// Route: 특정 경로에 어떤 컴포넌트를 보여줄지 정의하는 태그
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 각각의 경로(path)에 대응될 컴포넌트들을 불러옴
// 이 컴포넌트들은 다른 파일(src/pages/*.jsx)에서 만들어진 React 화면
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserList from './pages/UserList';

// 전체 웹사이트의 기본 구조를 정의하며, 라우터를 포함
function App() {
  return (
	  // BrowserRouter는 리액트 앱의 라우팅 기능을 활성화시킴
    // 브라우저의 URL을 감지해서 해당 페이지를 보여줌
    <BrowserRouter>
	    {/* Routes는 여러 Route를 묶어주는 상위 컴포넌트 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/users" element={<UserList/>} />
      </Routes>
    </BrowserRouter>
  );
}

// App 컴포넌트를 외부에서도 사용할 수 있게 export (기본 export)
export default App;