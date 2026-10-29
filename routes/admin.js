const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const ContactMessage = require('../models/ContactMessage');
const MarketingEvent = require('../models/MarketingEvent');
const Subscription = require('../models/Subscription');
const { sendReply } = require('../services/mailer');

const router = express.Router();

router.use(auth);

router.get('/stats', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalUsers = await User.countDocuments();
    const totalMessages = await ContactMessage.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();
    const totalRevenue = 0;
    res.json({ totalUsers, totalMessages, totalSubscriptions, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/subscriptions', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const subscriptions = await Subscription.find().sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/messages/:id/reply', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const contact = await ContactMessage.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    if (!req.body.message?.trim()) return res.status(400).json({ message: 'Reply message is required' });

    await sendReply({ to: contact.email, name: contact.name, subject: req.body.subject, message: req.body.message });
    contact.status = 'replied';
    await contact.save();
    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    res.status(error.code === 'SMTP_NOT_CONFIGURED' ? 503 : 500).json({ message: error.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/marketing', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [pageViews, ctaClicks, leads, sources, clicksByLabel] = await Promise.all([
      MarketingEvent.countDocuments({ type: 'page_view', createdAt: { $gte: since } }),
      MarketingEvent.countDocuments({ type: 'cta_click', createdAt: { $gte: since } }),
      ContactMessage.countDocuments({ createdAt: { $gte: since } }),
      ContactMessage.aggregate([
        { $match: { source: { $nin: ['', null] }, createdAt: { $gte: since } } },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      MarketingEvent.aggregate([
        { $match: { type: 'cta_click', createdAt: { $gte: since } } },
        { $group: { _id: '$label', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
    ]);

    res.json({ pageViews, ctaClicks, leads, sources, clicksByLabel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
