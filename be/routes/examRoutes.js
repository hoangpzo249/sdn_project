const express = require('express');
const router = express.Router();
const { getExams, getExamById, createExam, updateExam, deleteExam, submitExam } = require('../controllers/examController');
const { createQuestionForExam, deleteQuestionFromExam } = require('../controllers/examController'); // Thêm controller mới
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getExams) // ai login cũng xem được đề
  .post(protect, admin, createExam); // chỉ admin mới được tạo đề

router.route('/:id')
  .get(protect, getExamById) // BỎ ADMIN ở đây để User được phép xem đề
  .put(protect, admin, updateExam)
  .delete(protect, admin, deleteExam);

// Các route cho câu hỏi trong 1 đề thi
router.route('/:examId/questions')
  .post(protect, admin, createQuestionForExam);

router.route('/:examId/questions/:questionId')
  .delete(protect, admin, deleteQuestionFromExam);

router.post('/:id/submit', protect, submitExam); // user nộp bài thi

module.exports = router;