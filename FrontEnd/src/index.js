import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const response = await fetch('http://localhost:4000/');
const text = await response.text();
console.log(text);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);