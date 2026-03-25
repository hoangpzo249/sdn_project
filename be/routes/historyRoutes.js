const express = require('express');
const router = express.Router();
const History = require('../models/historyModel');
const { protect } = require('../middlewares/authMiddleware');

// Get history of logged-in user
router.get('/myhistory', protect, async (req, res) => {
    try {
        const histories = await History.find({ user_id: req.user.id })
            .populate('exam_id', 'title description duration')
            .sort({ started_at: -1 });
        res.json(histories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;