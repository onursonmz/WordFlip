import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WordProvider } from './context/WordContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import AddWord from './pages/AddWord';
import EditWord from './pages/EditWord';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Game from './pages/Game';
import './index.css';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    return (
        <WordProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/add" element={<ProtectedRoute><AddWord /></ProtectedRoute>} />
                <Route path="/edit/:id" element={<ProtectedRoute><EditWord /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>} />
            </Routes>
        </WordProvider>
    );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
