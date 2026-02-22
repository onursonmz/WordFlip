import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WordProvider } from './context/WordContext';
import Home from './pages/Home';
import AddWord from './pages/AddWord';
import EditWord from './pages/EditWord';
import './index.css';

function App() {
  return (
    <WordProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddWord />} />
          <Route path="/edit/:id" element={<EditWord />} />
        </Routes>
      </Router>
    </WordProvider>
  );
}

export default App;
