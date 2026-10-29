const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Settings = require('../models/Settings');

const router = express.Router();
fs.mkdirSync(path.join(__dirname, '..', 'uploads', 'tmp'), { recursive: true });
const upload = multer({ dest: path.join(__dirname, '..', 'uploads', 'tmp') });
const BUCKET = 'heroVideos';

const heroBucket = () => new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: BUCKET });

const safeName = (name) => String(name || '').replace(/[^\w.-]+/g, '');

const findHeroFile = (filename) => mongoose.connection.db.collection(`${BUCKET}.files`).findOne({ filename });

const saveHeroFile = (filePath, filename, contentType) => new Promise((resolve, reject) => {
  const uploadStream = heroBucket().openUploadStream(filename, {
    contentType: contentType || 'video/mp4',
  });
  fs.createReadStream(filePath)
    .pipe(uploadStream)
    .on('error', reject)
    .on('finish', () => resolve(uploadStream.id));
});

const ensureSlide = async (url) => {
  const settings = await Settings.findOne();
  if (!settings) return;
  const slides = Array.isArray(settings.heroSection?.backgroundSlides)
    ? settings.heroSection.backgroundSlides.map((item) => String(item))
    : [];
  if (!slides.includes(url)) {
    settings.heroSection.backgroundSlides = [...slides, url];
    settings.markModified('heroSection');
    await settings.save();
  }
};

const streamHero = async (req, res) => {
  try {
    const filename = safeName(req.params.filename);
    const file = await findHeroFile(filename);
    if (!file) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    const fileSize = file.length;
    const contentType = file.contentType || 'video/mp4';
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const range = req.headers.range;
    if (!range) {
      res.setHeader('Content-Length', fileSize);
      if (req.method === 'HEAD') {
        res.status(200).end();
        return;
      }
      heroBucket().openDownloadStreamByName(filename).pipe(res);
      return;
    }

    const [startText, endText] = range.replace(/bytes=/, '').split('-');
    const start = Number(startText);
    const end = endText ? Number(endText) : fileSize - 1;
    if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || end >= fileSize) {
      res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).end();
      return;
    }

    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Content-Length', end - start + 1);
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    heroBucket().openDownloadStreamByName(filename, { start, end: end + 1 }).pipe(res);
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: error.message });
  }
};

router.head('/hero/:filename', streamHero);
router.get('/hero/:filename', streamHero);

router.post('/hero', auth, upload.single('video'), async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }
    if (!/^video\/(mp4|webm)$/.test(req.file.mimetype)) {
      fs.rmSync(req.file.path, { force: true });
      return res.status(400).json({ message: 'Upload an MP4 or WebM video' });
    }

    const extension = req.file.mimetype === 'video/webm' ? 'webm' : 'mp4';
    const filename = `${Date.now()}-${safeName(path.parse(req.file.originalname).name)}.${extension}`;
    await saveHeroFile(req.file.path, filename, req.file.mimetype);
    fs.rmSync(req.file.path, { force: true });

    const url = `/api/media/hero/${filename}`;
    await ensureSlide(url);
    res.json({ message: 'Video stored', url });
  } catch (error) {
    if (req.file?.path) fs.rmSync(req.file.path, { force: true });
    res.status(500).json({ message: error.message });
  }
});

const driveIdFrom = (url) => String(url || '').match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=)([^/?&#]+)/i)?.[1]
  || String(url || '').match(/\/hero\/([^/?#]+)/i)?.[1]?.replace(/\.mp4$/i, '');

const storePreparedHeroVideos = async () => {
  const folders = [
    path.join(__dirname, '..', 'uploads', 'hero'),
    path.join(__dirname, '..', '..', 'frontendmotionfranzy', 'public', 'hero'),
  ];
  const stored = [];
  for (const folder of folders) {
    if (!fs.existsSync(folder)) continue;
    for (const name of fs.readdirSync(folder)) {
      if (!name.toLowerCase().endsWith('.mp4')) continue;
      const filename = safeName(name);
      if (!filename || await findHeroFile(filename)) {
        stored.push(`/api/media/hero/${filename}`);
        continue;
      }
      await saveHeroFile(path.join(folder, name), filename, 'video/mp4');
      stored.push(`/api/media/hero/${filename}`);
      console.log(`Stored hero video ${filename} in MongoDB`);
    }
  }

  const settings = await Settings.findOne();
  if (!settings) return stored;

  const available = new Set(stored.map((url) => driveIdFrom(url)).filter(Boolean));
  const current = [
    ...(settings.heroSection?.backgroundSlides || []),
    ...(settings.heroSection?.backgroundVideos || []),
  ].map((url) => String(url || '').trim()).filter(Boolean);

  const slides = [];
  const seen = new Set();
  current.forEach((url) => {
    const driveId = driveIdFrom(url);
    const mediaUrl = driveId && available.has(driveId) ? `/api/media/hero/${driveId}.mp4` : url;
    const key = (driveId || mediaUrl).toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    slides.push(mediaUrl);
  });

  settings.heroSection.backgroundSlides = slides;
  settings.heroSection.backgroundVideos = [];
  settings.markModified('heroSection');
  await settings.save();
  return slides;
};

module.exports = router;
module.exports.storePreparedHeroVideos = storePreparedHeroVideos;
