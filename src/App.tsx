import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './index.css';
import iconImage from './assets/logo/icon.png';
import { Welcome, Login, ForgotPassword, ResetPassword } from './pages';
import Layout from './Layout/Layout';
// import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Welcome page as splash screen - no layout */}
        <Route path="/" element={<Welcome />} />
        
        {/* Layout route with nested routes */}
        <Route path="/app" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="dashboard" element={<HomePage />} />
        </Route>
        
        {/* Catch-all route - redirect to welcome */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
