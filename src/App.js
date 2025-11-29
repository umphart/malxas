// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import DailyRecord from './components/DailyRecord';
import History from './components/History';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/auth';
import './App.css';
import './styles/App.css';
import './styles/responsive.css';

// Main app content component
const AppContent = () => {
  const [records, setRecords] = useState([]);
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login');

  // Load records from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('scrapRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save records to localStorage whenever records change
  useEffect(() => {
    localStorage.setItem('scrapRecords', JSON.stringify(records));
  }, [records]);

  const addRecord = (newRecord) => {
    const recordWithId = {
      ...newRecord,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setRecords(prev => [...prev, recordWithId]);
  };

  const deleteRecord = (id) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  // Determine if we should show login or register based on whether admin exists
  useEffect(() => {
    const adminExists = authService.hasAdminUser();
    setAuthMode(adminExists ? 'login' : 'register');
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="container">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/" replace /> : 
                authService.hasAdminUser() ? (
                  <Login onSwitchToRegister={() => setAuthMode('register')} />
                ) : (
                  <Navigate to="/register" replace />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? <Navigate to="/" replace /> : 
                !authService.hasAdminUser() ? (
                  <Register onSwitchToLogin={() => setAuthMode('login')} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DailyRecord onAddRecord={addRecord} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <History records={records} onDeleteRecord={deleteRecord} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard records={records} />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;