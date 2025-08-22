import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserList from './pages/UserList';
import SetList from './pages/SetList';
import SetDetail from './pages/SetDetail';
import Profile from './pages/Profile';

function App() {
  return (    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/users" element={<UserList/>} />
        <Route path="/sets" element={<SetList />} />
        <Route path="/sets/:id" element={<SetDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;