import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Register from './Register';
import DocumentList from './DocumentList';
import Librarian from './Librarian';

function App() {
  return (
    <BrowserRouter>
      <div className="container mt-4">
        <h2 className="text-center text-primary mb-4 fw-bold">THƯ VIỆN SỐ THÔNG MINH</h2>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/documents" element={<DocumentList />} />
          <Route path="/librarian" element={<Librarian />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;