const express = require('express');
const router = express.Router();
const History = require('../models/historyModel');
const Question = require('../models/questionModel'); // Import thêm Question model
const { protect } = require('../middlewares/authMiddleware');

// Get history of logged-in user
router.get('/myhistory', protect, async (req, res) => {
    try {
        const histories = await History.find({ user_id: req.user.id })
            .populate('exam_id', 'title description time_limit_minutes total_score pass_score question_ids')
            .lean() // Dùng lean() để trả về plain javascript object thay vì mongoose document (dễ thêm thuộc tính)
            .sort({ started_at: -1 });

        const historyWithScores = await Promise.all(histories.map(async (history) => {
            const exam = history.exam_id;

            if (!exam) return { ...history, score: 0, passed: false };

            const questions = await Question.find({ _id: { $in: exam.question_ids } });

            let score = 0;
            const pointsPerQuestion = exam.question_ids.length > 0 ? (exam.total_score / exam.question_ids.length) : 0;

            if (history.answers && history.answers.length > 0) {
                history.answers.forEach(ans => {
                    const question = questions.find(q => q._id.toString() === ans.question_id.toString());
                    if (question && question.correct_answer === ans.selected_option_id) {
                        score += pointsPerQuestion;
                    }
                });
            }

            score = Math.round(score * 10) / 10;
            const passed = score >= exam.pass_score;

            return {
                ...history,
                score,
                passed
            };
        }));

        res.json(historyWithScores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/histories', protect, async (req, res) => {
    try {
        const histories = await History.find()
            .populate('exam_id', 'title description time_limit_minutes total_score pass_score question_ids')
            .populate('user_id', 'name')
            .lean() // Dùng lean() để trả về plain javascript object thay vì mongoose document (dễ thêm thuộc tính)
            .sort({ started_at: -1 });

        const historyWithScores = await Promise.all(histories.map(async (history) => {
            const exam = history.exam_id;

            if (!exam) return { ...history, score: 0, passed: false };

            const questions = await Question.find({ _id: { $in: exam.question_ids } });

            let score = 0;
            const pointsPerQuestion = exam.question_ids.length > 0 ? (exam.total_score / exam.question_ids.length) : 0;

            if (history.answers && history.answers.length > 0) {
                history.answers.forEach(ans => {
                    const question = questions.find(q => q._id.toString() === ans.question_id.toString());
                    if (question && question.correct_answer === ans.selected_option_id) {
                        score += pointsPerQuestion;
                    }
                });
            }

            score = Math.round(score * 10) / 10;
            const passed = score >= exam.pass_score;

            return {
                ...history,
                score,
                passed
            };
        }));

        res.json(historyWithScores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;