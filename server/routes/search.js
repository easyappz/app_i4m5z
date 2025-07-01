const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Search Users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      username: { $regex: query, $options: 'i' }
    }).select('-password').limit(10);

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

// Search Posts
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const posts = await Post.find({
      content: { $regex: query, $options: 'i' }
    }).populate('author', 'username profilePicture').limit(10);

    res.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ message: 'Failed to search posts' });
  }
});

module.exports = router;
