// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // ✅ 추가

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>      {/* ✅ 라우터로 감싸기 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
