import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { Login, ForgotPassword, ResetPassword } from './pages';
import Layout from './Layout/Layout';
import Dashboard from './pages/Dashboard';
import LayoutDashboard from './pages/LayoutDashboard';
import { ProtectedRoute } from './components';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});


const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Root redirect to login */}
          <Route path="/" element={<Navigate to="/app/login" replace />} />
          
          {/* Public routes - no layout */}
          <Route path="/app/login" element={<Login />} />
          <Route path="/app/forgot-password" element={<ForgotPassword />} />
          <Route path="/app/reset-password" element={<ResetPassword />} />
          
          {/* Protected routes with layout */}
          <Route path="/app" element={<Layout />}>
            <Route path="dashboard" element={
              <ProtectedRoute allowedGroups={['attorney', 'client']}>
                <LayoutDashboard />
              </ProtectedRoute>
            } />
            <Route path="homepage" element={
              <ProtectedRoute allowedGroups={['attorney', 'client']}>
                <LayoutDashboard />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Catch-all route - redirect to login */}
          <Route path="*" element={<Navigate to="/app/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
