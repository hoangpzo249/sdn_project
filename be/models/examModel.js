const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    question_ids: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Question'
    },
    time_limit_minutes: {
        type: Number,
        required: true,
        min: [1, 'Thời gian tối thiểu là 1 phút']
    },
    total_score: {
        type: Number,
        required: true,
        default: 10
    },
    pass_score: {
        type: Number,
        required: true,
        default: 50,
        min: 0,
        max: 10
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const Exam = mongoose.model('Exam', examSchema, 'exams')
module.exports = Exam