const express = require('express');
const MarketingEvent = require('../models/MarketingEvent');

const router = express.Router();

router.post('/event', async (req, res) => {
  try {
    const type = req.body.type;
    if (type !== 'page_view' && type !== 'cta_click') {
      return res.status(400).json({ message: 'Unsupported event type' });
    }

    await MarketingEvent.create({
      type,
      label: req.body.label || '',
      path: req.body.path || '/',
      source: req.body.source || '',
    });
    res.status(201).json({ message: 'Event recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
