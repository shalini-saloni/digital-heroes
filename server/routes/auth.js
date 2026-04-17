const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, charityId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    
    const user = new User({ name, email, password, charityId });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { _id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email, role: user.role, subscriptionStatus: user.subscriptionStatus, subscriptionPlan: user.subscriptionPlan } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  res.json(req.user);
});

router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['monthly', 'yearly'].includes(plan)) return res.status(400).json({ message: 'Invalid plan' });
    
    req.user.subscriptionStatus = 'active';
    req.user.subscriptionPlan = plan;
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + (plan === 'yearly' ? 12 : 1));
    req.user.renewalDate = renewalDate;
    
    await req.user.save();
    res.json({ message: `Subscribed to ${plan}`, user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { charityId, charityContributionPercentage } = req.body;
    if (charityId !== undefined) req.user.charityId = charityId;
    if (charityContributionPercentage !== undefined) {
      if (charityContributionPercentage < 10) return res.status(400).json({ message: 'Min 10%' });
      req.user.charityContributionPercentage = charityContributionPercentage;
    }
    await req.user.save();
    res.json({ message: 'Profile updated', user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
