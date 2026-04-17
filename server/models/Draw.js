const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: { type: String, required: true, unique: true }, // 'YYYY-MM'
  status: { type: String, enum: ['simulation', 'published'], default: 'simulation' },
  logic: { type: String, enum: ['random', 'algorithmic'], required: true },
  
  totalPool: { type: Number, default: 0 },
  subscriberCount: { type: Number, default: 0 },
  
  winningNumbers: [{ type: Number }], // Array of 5 numbers
  
  payoutTiers: {
    match5: {
      sharePercentage: { type: Number, default: 40 },
      amount: { type: Number, default: 0 },
      winners: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
        proofUrl: { type: String }
      }]
    },
    match4: {
      sharePercentage: { type: Number, default: 35 },
      amount: { type: Number, default: 0 },
      winners: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
        proofUrl: { type: String }
      }]
    },
    match3: {
      sharePercentage: { type: Number, default: 25 },
      amount: { type: Number, default: 0 },
      winners: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
        proofUrl: { type: String }
      }]
    }
  },
  
  jackpotRollover: { type: Number, default: 0 }, // Unclaimed match5 carries over
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Draw', drawSchema);
