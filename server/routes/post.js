const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create Post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = new Post({
      content,
      imageUrl,
      author: req.user.userId
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Get News Feed
router.get('/feed', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const posts = await Post.find({
      author: { $in: [...user.following, req.user.userId] }
    })
    .sort({ createdAt: -1 })
    .populate('author', 'username profilePicture');

    res.json(posts);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ message: 'Failed to fetch news feed' });
  }
});

// Like Post
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user.userId);
    await post.save();

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Failed to like post' });
  }
});

module.exports = router;
