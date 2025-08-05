import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import ConfirmacaoPage from './ConfirmacaoPage';
import AdminPage from './AdminPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/confirmacao" element={<ConfirmacaoPage />} />
    <Route path="/admin" element={<AdminPage />} />
  </Routes>
);

export default AppRoutes;