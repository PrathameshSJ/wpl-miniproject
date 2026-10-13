import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect, generateToken } from '../middleware/auth.js';

const router = express.Router();

// Support both REST standard paths and action query param for backward compatibility
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: {
        _id: user._id,
        user_id: user._id,
        fullName: user.fullName,
        full_name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { fullName, full_name, email, phone, password } = req.body;
    const name = fullName || full_name;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      fullName: name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'customer',
    });

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        user_id: user._id,
        fullName: user.fullName,
        full_name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      user_id: req.user._id,
      fullName: req.user.fullName,
      full_name: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      createdAt: req.user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/update_settings', protect, async (req, res) => {
  try {
    const { current_password, full_name, fullName, phone, new_password } = req.body;
    const name = fullName || full_name;

    if (!current_password) {
      return res.status(400).json({ error: 'Current password is required to save changes' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(current_password);
    if (!isMatch) {
      return res.status(403).json({ error: 'Incorrect current password' });
    }

    if (name) user.fullName = name;
    if (phone) user.phone = phone;
    if (new_password) {
      if (new_password.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }
      user.password = new_password;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        user_id: user._id,
        fullName: user.fullName,
        full_name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
