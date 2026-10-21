const nodemailer = require('nodemailer');

const recipient = process.env.MAIL_TO || 'shantanujha16@gmail.com';

const isConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const sendContactNotification = async ({ name, email, message, plan, price }) => {
  if (!isConfigured()) {
    console.warn('Email notification skipped: SMTP_USER and SMTP_PASS are not configured');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-prod.mailrcld.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const planLine = plan ? `<p><strong>Plan:</strong> ${escapeHtml(plan)} ${escapeHtml(price || '')}</p>` : '';
  await transporter.sendMail({
    from: `Motion Franzy Website <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: recipient,
    replyTo: email,
    subject: plan ? `New ${plan} plan inquiry from ${name}` : `New website message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}${plan ? `\nPlan: ${plan} ${price || ''}` : ''}\n\n${message}`,
    html: `<h2>New website inquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p>${planLine}<p><strong>Message:</strong></p><p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>`,
  });

  return true;
};

const sendReply = async ({ to, name, subject, message }) => {
  if (!isConfigured()) {
    const error = new Error('SMTP is not configured in backend/.env');
    error.code = 'SMTP_NOT_CONFIGURED';
    throw error;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-prod.mailrcld.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `Motion Franzy <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    replyTo: process.env.MAIL_TO || process.env.SMTP_USER,
    subject: subject || 'Re: Your Motion Franzy inquiry',
    text: `Hi ${name || 'there'},\n\n${message}\n\nMotion Franzy`,
    html: `<p>Hi ${escapeHtml(name || 'there')},</p><p>${escapeHtml(message).replaceAll('\n', '<br>')}</p><p>Motion Franzy</p>`,
  });

  return true;
};

module.exports = { sendContactNotification, sendReply };
