const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 1, max: 45 },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Enforce max 5 scores per user (application logic will also handle deleting oldest)
// and unique date per user
scoreSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Score', scoreSchema);
