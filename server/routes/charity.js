const express = require('express');
const Charity = require('../models/Charity');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.category && req.query.category !== 'all') {
      query.category = new RegExp(`^${req.query.category}$`, 'i');
    }
    if (req.query.search) {
      query.name = new RegExp(req.query.search, 'i');
    }
    const charities = await Charity.find(query).sort({ featured: -1, name: 1 });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const charity = new Charity(req.body);
    await charity.save();
    res.status(201).json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Charity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Charity deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
