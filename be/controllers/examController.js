const Exam = require('../models/examModel');
const History = require('../models/historyModel');
const Question = require('../models/questionModel');

const getExams = async (req, res) => {
    try {
        const exams = await Exam.find().select('-__v')
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/exams/:id - Xem chi tiết 1 đề thi và các câu hỏi bên trong
const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy đề thi' });

        const questions = await Question.find({ _id: { $in: exam.question_ids } });
        res.status(200).json({ ...exam._doc, questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createExam = async (req, res) => {
    try {
        const { title, description, time_limit_minutes, total_score, pass_score } = req.body; // Bỏ question_ids

        if (!title || !time_limit_minutes) {
            return res.status(400).json({ message: 'Vui lòng điền đủ tiêu đề và thời gian' });
        }

        const exam = await Exam.create({
            title,
            description,
            question_ids: [], // Khởi tạo rỗng, thêm sau
            time_limit_minutes,
            total_score: total_score || 10,
            pass_score: pass_score || 5, // theo db schema (1-10)
            created_by: req.user.id,
            isPublic: false
        });

        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/exams/:id/submit - User nộp bài thi
const submitExam = async (req, res) => {
    try {
        const examId = req.params.id;
        const { answers } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy đề thi' });

        const questions = await Question.find({ _id: { $in: exam.question_ids } });
        
        let score = 0;
        const pointsPerQuestion = exam.question_ids.length > 0 ? (exam.total_score / exam.question_ids.length) : 0;

        if (answers && answers.length > 0) {
            answers.forEach(ans => {
                const question = questions.find(q => q._id.toString() === ans.question_id);
                if (question && question.correct_answer === ans.selected_option_id) {
                    score += pointsPerQuestion;
                }
            });
        }

        score = Math.round(score * 10) / 10;
        const passed = score >= exam.pass_score;

        const history = await History.create({
            user_id: req.user.id,
            exam_id: examId,
            answers: answers || [],
            passed: passed,
            completed_at: new Date()
        });

        res.status(201).json({
            message: 'Nộp bài thi thành công',
            score: score,
            passed,
            history_id: history._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật đề thi (Admin)
const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy đề thi' });

        const updatedExam = await Exam.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true }
        );
        res.status(200).json(updatedExam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa đề thi (Admin)
const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy đề thi' });

        // Phải xóa luôn các câu hỏi tham chiếu bên trong Đề
        await Question.deleteMany({ _id: { $in: exam.question_ids } });
        await exam.deleteOne();
        res.status(200).json({ message: 'Xóa đề thi và các câu hỏi thành công', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== QUẢN LÝ CÂU HỎI TRONG ĐỀ ==================

// Tạo mới câu hỏi TRONG một Đề thi
const createQuestionForExam = async (req, res) => {
    try {
        const examId = req.params.examId;
        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy đề thi' });

        const { content, options, correct_answer, difficulty } = req.body;
        if (!content || !options || options.length !== 4 || !correct_answer) {
            return res.status(400).json({ message: 'Dữ liệu câu hỏi không hợp lệ' });
        }

        // Tạo câu hỏi
        const question = await Question.create({
            content,
            options,
            correct_answer,
            difficulty: difficulty || 'easy',
            created_by: req.user.id,
        });

        // Đẩy id của Question vào mảng question_ids của Exam
        exam.question_ids.push(question._id);
        await exam.save();

        res.status(201).json({ message: 'Thêm câu hỏi vào đề hoàn tất', question });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xoá câu hỏi KHỎI một Đề thi
const deleteQuestionFromExam = async (req, res) => {
    try {
        const { examId, questionId } = req.params;
        
        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy đề thi' });

        // Xóa câu hỏi khỏi collection Questions
        await Question.findByIdAndDelete(questionId);

        // Kéo (Pull) questionId ra khỏi mảng đề thi r lưu lại
        exam.question_ids.pull(questionId);
        await exam.save();

        res.status(200).json({ message: 'Đã xóa câu hỏi khỏi đề thi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getExams, getExamById, createExam, updateExam, deleteExam, submitExam, createQuestionForExam, deleteQuestionFromExam };