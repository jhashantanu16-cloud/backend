const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const Subscription = require('../models/Subscription');
const { sendContactNotification } = require('../services/mailer');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message, plan, price } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const savedMessage = await ContactMessage.create({ name, email, message, plan: plan || '' });
    let subscription = null;

    if (plan) {
      subscription = await Subscription.create({
        plan,
        price: price || '',
        customerName: name,
        email,
        status: 'Inquiry',
      });
    }

    let emailSent = false;
    try {
      emailSent = await sendContactNotification({ name, email, message, plan, price });
    } catch (mailError) {
      console.error('Contact email error:', mailError.message);
    }

    res.status(201).json({ message: 'Message received', id: savedMessage._id, subscriptionId: subscription?._id, emailSent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
