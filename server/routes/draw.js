const express = require('express');
const Draw = require('../models/Draw');
const User = require('../models/User');
const Score = require('../models/Score');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const draws = await Draw.find().sort({ createdAt: -1 });
    res.json(draws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my-results', authMiddleware, async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' }).sort({ createdAt: -1 });
    const results = [];
    
    draws.forEach(draw => {
      ['match5', 'match4', 'match3'].forEach(tier => {
        const win = draw.payoutTiers[tier].winners.find(w => w.userId.toString() === req.user._id.toString());
        if (win) {
          results.push({
            drawId: draw._id,
            month: draw.month,
            tier,
            prizeAmount: draw.payoutTiers[tier].amount,
            status: win.status,
            proofUrl: win.proofUrl
          });
        }
      });
    });
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/simulate', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { month, logic } = req.body;
    let draw = await Draw.findOne({ month });
    if (draw) {
      if (draw.status === 'published') return res.status(400).json({ message: 'Draw already published' });
      await Draw.findByIdAndDelete(draw._id);
    }
    
    const activeUsers = await User.find({ subscriptionStatus: 'active' });
    const subscriberCount = activeUsers.length;
    // 9.99 * users / 2 for pool logic (dummy logic)
    const totalPool = subscriberCount * 4.99;
    
    // generate numbers
    const winningNumbers = [];
    while(winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) winningNumbers.push(num);
    }
    
    draw = new Draw({ month, logic, totalPool, subscriberCount, winningNumbers });
    
    for (const user of activeUsers) {
      const scores = await Score.find({ userId: user._id });
      const userNumbers = scores.map(s => s.score);
      const matchCount = userNumbers.filter(n => winningNumbers.includes(n)).length;
      
      if (matchCount === 5) draw.payoutTiers.match5.winners.push({ userId: user._id });
      else if (matchCount === 4) draw.payoutTiers.match4.winners.push({ userId: user._id });
      else if (matchCount === 3) draw.payoutTiers.match3.winners.push({ userId: user._id });
    }
    
    ['match5', 'match4', 'match3'].forEach(tier => {
      const pool = totalPool * (draw.payoutTiers[tier].sharePercentage / 100);
      const winnersCount = draw.payoutTiers[tier].winners.length;
      if (winnersCount > 0) {
        draw.payoutTiers[tier].amount = pool / winnersCount;
      } else if (tier === 'match5') {
        draw.jackpotRollover = pool;
      }
    });
    
    await draw.save();
    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/publish', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    draw.status = 'published';
    await draw.save();
    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Draw.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/upload-proof', authMiddleware, async (req, res) => {
  try {
    const { drawId, tier, url } = req.body;
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    
    const winner = draw.payoutTiers[tier].winners.find(w => w.userId.toString() === req.user._id.toString());
    if (!winner) return res.status(403).json({ message: 'Not a winner in this tier' });
    
    winner.proofUrl = url;
    await draw.save();
    res.json({ message: 'Proof uploaded' });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
