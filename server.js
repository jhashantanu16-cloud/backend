const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const User = require('./models/User');

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

const createAdminUser = async () => {
  try {
    const existing = await User.findOne({ email: 'admin@gmail.com' });
    if (!existing) {
      await User.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('Admin created: admin@gmail.com / Admin@123');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://jhashantanu16_db_user:8K59UiCxQrfX6XbN@cluster0.ia20ith.mongodb.net/', {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
    await createAdminUser();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log(`Retrying MongoDB connection in ${MONGODB_RETRY_DELAY_MS / 1000} seconds...`);
    setTimeout(startServer, MONGODB_RETRY_DELAY_MS);
  }
};

startServer();
