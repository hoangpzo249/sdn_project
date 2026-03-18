const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    selected_option_id: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
    }
}, { _id: false })

const historySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exam_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    answers: {
        type: [answerSchema],
        default: []
    },
    score: {
        type: Number,
        min: 0,
        max: 10,
        default: null
    },
    passed: {
        type: Boolean,
        default: null
    },
    started_at: {
        type: Date,
        default: Date.now
    },
    completed_at: {
        type: Date,
        default: null
    }
}, { timestamps: true })

historySchema.index({ user_id: 1 })
historySchema.index({ user_id: 1, exam_id: 1 })

const History = mongoose.model('History', historySchema)
module.exports = History