const mongoose = require('mongoose');

const marketingEventSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['page_view', 'cta_click'], required: true },
    label: { type: String, default: '', trim: true, maxlength: 80 },
    path: { type: String, default: '/', trim: true, maxlength: 120 },
    source: { type: String, default: '', trim: true, maxlength: 80 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketingEvent', marketingEventSchema);
