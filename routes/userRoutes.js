import express from 'express';
import UserModel from '../models/userModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const user = await UserModel.findOne().populate('bookings');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;
