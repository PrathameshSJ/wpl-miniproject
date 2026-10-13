import express from 'express';
import Setting from '../models/Setting.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ message: 'Settings saved successfully', settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
