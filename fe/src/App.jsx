import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ExamManagement from './pages/ExamManagement';
import ExamDetailAdmin from './pages/ExamDetailAdmin';
import ExamList from './pages/ExamList';
import TakeExam from './pages/TakeExam';
import UserHistory from './pages/UserHistory';
import HistoryManagement from './pages/HistoryManagement';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exams" element={<ExamList />} />
          <Route path="/exams/:id/take" element={<TakeExam />} />
          <Route path="/history" element={<UserHistory />} />
          <Route path="/admin/exams" element={<ExamManagement />} />
          <Route path="/admin/histories" element={<HistoryManagement />} />
          <Route path="/admin/exams/:id" element={<ExamDetailAdmin />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
