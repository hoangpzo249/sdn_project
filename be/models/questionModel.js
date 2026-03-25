const mongoose = require('mongoose')

const optionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D']
    },
    text: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false })

const questionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    options: [optionSchema],
    correct_answer: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D']
    },
    difficulty: {
        type: String,
        required: true,
        default: 'easy',
        enum: ['easy', 'medium', 'hard']
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const Question = mongoose.model('Question', questionSchema, 'questions')

module.exports = Question