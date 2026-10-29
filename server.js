const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const User = require('./models/User');
const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const marketingRoutes = require('./routes/marketing');
const mediaRoutes = require('./routes/media');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_RETRY_DELAY_MS = 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/media', mediaRoutes);

const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'Admin';

  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD is missing, so no admin user was created');
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('Existing user promoted to admin');
    } else {
      console.log('Admin user already exists');
    }
    return;
  }

  await User.create({ name, email, password, role: 'admin' });
  console.log('Admin user created');
};

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
    await ensureAdminUser();
    await mediaRoutes.storePreparedHeroVideos();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log(`Retrying MongoDB connection in ${MONGODB_RETRY_DELAY_MS / 1000} seconds...`);
    setTimeout(startServer, MONGODB_RETRY_DELAY_MS);
  }
};

startServer();
