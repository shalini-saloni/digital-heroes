const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/score');
const drawRoutes = require('./routes/draw');
const charityRoutes = require('./routes/charity');
const adminRoutes = require('./routes/admin');
const User = require('./models/User');
const Charity = require('./models/Charity');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', stack: 'Mongoose' }));

// MongoDB Connection
(async function startServer() {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected');
    } else {
      throw new Error('MONGO_URI not defined');
    }
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);
    console.log('Starting in-memory MongoDB fallback...');

    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: path.resolve(__dirname, 'db'),
        // storageEngine: 'wiredTiger' - Removed to fix JSON log parsing crash
      }
    });
    await mongoose.connect(mongoServer.getUri());
    console.log('MongoDB Memory Server connected with persistent storage!');
  }

  // Seed admin if not exist
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    const admin = new User({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user seeded');
  }
  
  // Seed charities if none exist
  const charityCount = await Charity.countDocuments();
  if (charityCount === 0) {
    await Charity.insertMany([
      { name: 'Golf for Good', category: 'Health', description: 'Supporting healthcare initiatives through golf tournaments and active lifestyle programs.', featured: true },
      { name: 'Green Greens', category: 'Environment', description: 'Promoting sustainable, water-conscious, and eco-friendly golf course management.', featured: true },
      { name: 'Fairway Foundation', category: 'Education', description: 'Providing transformative scholarships to young golfers worldwide.', featured: true },
      { name: 'Tee Off for Tech', category: 'Education', description: 'Bridging the digital divide for underserved communities through sports funding.', featured: false },
      { name: 'Birdie for Books', category: 'Youth', description: 'Equipping underfunded schools with modern libraries and learning materials.', featured: false },
      { name: 'Veterans on the Green', category: 'Veterans', description: 'Rehabilitative golf programs for wounded or disabled military veterans.', featured: true },
      { name: 'Community Caddies', category: 'Community', description: 'Providing job training and mentorship for local teens in urban areas.', featured: false },
      { name: 'Swing for Sight', category: 'Health', description: 'Funding vision-correction surgeries and visual impairment research.', featured: false }
    ]);
    console.log('Default charities seeded');
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
