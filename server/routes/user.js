const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get User Profile
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Failed to fetch user profile due to server error' });
  }
});

// Update User Profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const { username, bio, profilePicture } = req.body;
    if (!username && !bio && !profilePicture) {
      return res.status(400).json({ message: 'No data provided for update' });
    }
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
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Failed to update user profile due to server error' });
  }
});

// Follow User
router.post('/:id/follow', authMiddleware, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
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
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Failed to follow user due to server error' });
  }
});

// Unfollow User
router.post('/:id/unfollow', authMiddleware, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.userId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user.userId);

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Failed to unfollow user due to server error' });
  }
});

module.exports = router;
