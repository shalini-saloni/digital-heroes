const express = require('express');
const Score = require('../models/Score');
const { authMiddleware, subscriberMiddleware } = require('../middleware/auth');

const router = express.Router();

// Retrieve all scores for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a score (enforces max 5 rolling logic)
router.post('/', authMiddleware, subscriberMiddleware, async (req, res) => {
  try {
    const { score, date } = req.body;
    
    // Standardize date to Midnight UTC
    const standardizedDate = new Date(date);
    standardizedDate.setUTCHours(0, 0, 0, 0);
    
    const existing = await Score.findOne({ userId: req.user._id, date: standardizedDate });
    if (existing) return res.status(400).json({ message: 'A score for this date already exists.' });
    
    const newScore = new Score({ userId: req.user._id, score, date: standardizedDate });
    await newScore.save();
    
    // Rolling 5 logic
    const allScores = await Score.find({ userId: req.user._id }).sort({ date: -1 });
    if (allScores.length > 5) {
      const scoresToDelete = allScores.slice(5);
      const idsToDelete = scoresToDelete.map(s => s._id);
      await Score.deleteMany({ _id: { $in: idsToDelete } });
    }
    
    res.status(201).json({ message: 'Score added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a specific score
router.put('/:id', authMiddleware, subscriberMiddleware, async (req, res) => {
  try {
    const { score } = req.body;
    const existing = await Score.findOne({ _id: req.params.id, userId: req.user._id });
    if (!existing) return res.status(404).json({ message: 'Score not found' });
    
    existing.score = score;
    await existing.save();
    res.json({ message: 'Score updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a specific score
router.delete('/:id', authMiddleware, subscriberMiddleware, async (req, res) => {
  try {
    const existing = await Score.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!existing) return res.status(404).json({ message: 'Score not found' });
    
    res.json({ message: 'Score deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
