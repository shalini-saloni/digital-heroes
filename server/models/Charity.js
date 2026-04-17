const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'general' },
  featured: { type: Boolean, default: false },
  upcomingEvents: [{
    title: { type: String },
    date: { type: Date }
  }],
  supporterCount: { type: Number, default: 0 }, // Maintained via triggers or syncs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Charity', charitySchema);
