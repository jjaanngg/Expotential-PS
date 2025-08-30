// App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SetList from './pages/SetList';
import SetDetail from './pages/SetDetail';
import Profile from './pages/Profile';
import RankingPage from './pages/RankingPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인이 필요 없는 페이지들 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 👇 2. 로그인이 필요한 페이지들을 PrivateRoute로 감싸줍니다. */}
        <Route element={<PrivateRoute />}>
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/sets" element={<SetList />} />
          <Route path="/sets/:id" element={<SetDetail />} />
          <Route path="/profile" element={<Profile />} />
          {/* UserList도 로그인이 필요하다면 이 안으로 이동 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;