import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import DashboardLayout from './layouts/DashboardLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-bg text-text font-sans transition-colors duration-300">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><Landing /></>} />
            <Route path="/login" element={<><Navbar /><Login /></>} />
            <Route path="/signup" element={<><Navbar /><Signup /></>} />

            {/* Protected Routes (Dashboard Layout) */}
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/chat" element={<DashboardLayout><Chat /></DashboardLayout>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer position="bottom-right" theme="colored" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
