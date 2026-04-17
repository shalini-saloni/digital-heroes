const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // Subscription fields
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'lapsed'], default: 'inactive' },
  subscriptionPlan: { type: String, enum: ['monthly', 'yearly', 'none'], default: 'none' },
  renewalDate: { type: Date },
  
  // Charity fields
  charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
  charityContributionPercentage: { type: Number, default: 10, min: 10, max: 100 },
  
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
