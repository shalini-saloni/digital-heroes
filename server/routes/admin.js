const express = require('express');
const User = require('../models/User');
const Draw = require('../models/Draw');
const Charity = require('../models/Charity');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', async (req, res) => {
  try {
    const users = await User.find();
    const draws = await Draw.find({ status: 'published' });
    const charities = await Charity.find();
    
    const stats = {
      totalUsers: users.filter(u => u.role !== 'admin').length,
      activeSubscribers: users.filter(u => u.subscriptionStatus === 'active').length,
      monthlySubscribers: users.filter(u => u.subscriptionStatus === 'active' && u.subscriptionPlan === 'monthly').length,
      yearlySubscribers: users.filter(u => u.subscriptionStatus === 'active' && u.subscriptionPlan === 'yearly').length,
      
      monthlyRevenue: users.reduce((acc, u) => {
        if (u.subscriptionStatus !== 'active') return acc;
        return acc + (u.subscriptionPlan === 'yearly' ? 7.99 : 9.99);
      }, 0),
      
      totalDraws: draws.length,
      totalCharities: charities.length,
      currentPrizePool: 0,
      totalCharityContributions: 0,
      totalWinners: 0,
      totalPrizesPaid: 0
    };
    
    // Just mock accumulation
    stats.currentPrizePool = stats.activeSubscribers * 4.99;
    stats.totalCharityContributions = users.reduce((acc, u) => {
      if (u.subscriptionStatus !== 'active') return acc;
      const pct = (u.charityContributionPercentage || 10) / 100;
      return acc + ((u.subscriptionPlan === 'yearly' ? 7.99 : 9.99) * pct);
    }, 0);
    
    draws.forEach(d => {
      ['match5', 'match4', 'match3'].forEach(t => {
        stats.totalWinners += d.payoutTiers[t].winners.length;
        d.payoutTiers[t].winners.forEach(w => {
          if (w.status === 'paid') stats.totalPrizesPaid += d.payoutTiers[t].amount;
        });
      });
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json(user);
});

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

router.get('/winners', async (req, res) => {
  const draws = await Draw.find().populate('payoutTiers.match5.winners.userId').populate('payoutTiers.match4.winners.userId').populate('payoutTiers.match3.winners.userId');
  const winnersList = [];
  draws.forEach(d => {
    ['match5', 'match4', 'match3'].forEach(tier => {
      d.payoutTiers[tier].winners.forEach(w => {
        if (w.userId) {
          winnersList.push({
            drawId: d._id,
            month: d.month,
            tier,
            prizeAmount: d.payoutTiers[tier].amount,
            userId: w.userId._id,
            userName: w.userId.name,
            userEmail: w.userId.email,
            status: w.status,
            proofUrl: w.proofUrl
          });
        }
      });
    });
  });
  res.json(winnersList);
});

router.post('/winners/verify', async (req, res) => {
  const { drawId, tier, userId, action } = req.body;
  const draw = await Draw.findById(drawId);
  const win = draw.payoutTiers[tier].winners.find(w => w.userId.toString() === userId.toString());
  if (!win) return res.status(404).json({ message: 'Winner not found' });
  
  if (action === 'approve') win.status = 'paid';
  else if (action === 'reject') win.proofUrl = '';
  
  await draw.save();
  res.json({ message: 'Updated' });
});

module.exports = router;
