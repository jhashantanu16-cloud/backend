const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({ storage });

const defaultSettings = async () => {
  const settings = await Settings.findOne();
  if (settings) return settings;
  const newSettings = await Settings.create({});
  return newSettings;
};

router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne() || await defaultSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne() || await defaultSettings();
    const settingsPayload = { ...req.body };
    delete settingsPayload._id;
    delete settingsPayload.__v;
    delete settingsPayload.createdAt;
    delete settingsPayload.updatedAt;
    const updated = await Settings.findByIdAndUpdate(
      settings._id,
      { $set: settingsPayload },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/logo/upload', auth, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const settings = await Settings.findOne() || await defaultSettings();
    settings.logo = { url: `/uploads/${req.file.filename}` };
    await settings.save();
    res.json({ message: 'Logo uploaded', url: settings.logo.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/favicon/upload', auth, upload.single('favicon'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const settings = await Settings.findOne() || await defaultSettings();
    settings.favicon = { url: `/uploads/${req.file.filename}` };
    await settings.save();
    res.json({ message: 'Favicon uploaded', url: settings.favicon.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
