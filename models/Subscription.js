const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    plan: { type: String, required: true, trim: true },
    price: { type: String, default: '', trim: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, enum: ['Inquiry', 'Active', 'Cancelled'], default: 'Inquiry' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
