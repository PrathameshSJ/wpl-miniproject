import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, rating } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'Feedback & Suggestions',
      message,
      rating: rating ? Number(rating) : 5,
    });

    res.status(201).json({
      message: 'Thank you! We will get back to you within 24 hours.',
      contact,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
