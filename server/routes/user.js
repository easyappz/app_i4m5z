const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get User Profile
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Update User Profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { username, bio, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, bio, profilePicture },
      { new: true, select: '-password' }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
});

// Follow User
router.post('/:id/follow', authMiddleware, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(req.params.id);
    userToFollow.followers.push(req.user.userId);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Failed to follow user' });
  }
});

module.exports = router;
