import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CardHeader, CardMedia, CardActions, IconButton, Avatar, Divider, CircularProgress, Paper, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { Favorite as FavoriteIcon, Comment as CommentIcon, Send as SendIcon } from '@mui/icons-material';
import { getFeed, createPost, likePost, addComment } from '../utils/api';

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const data = await getFeed();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feed:', error);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) {
      setError('Post content cannot be empty.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const post = await createPost(newPost.trim(), '');
      setPosts([post, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: post.likes.includes(currentUserId) ? post.likes : [...post.likes, currentUserId] } 
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post.');
    }
  };

  const handleComment = async (postId, e) => {
    e.preventDefault();
    const content = newComment[postId]?.trim();
    if (!content) {
      setError('Comment cannot be empty.');
      return;
    }
    try {
      const comment = await addComment(postId, content);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, comments: [...post.comments, comment] } 
          : post
      ));
      setNewComment(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment.');
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComment(prev => ({ ...prev, [postId]: value }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', margin: 'auto' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        News Feed
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ textAlign: 'center', mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box component="form" onSubmit={handlePostSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            variant="outlined"
            sx={{ mb: 2, backgroundColor: '#fafafa', borderRadius: 1 }}
            disabled={submitting}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={submitting || !newPost.trim()}
              sx={{ minWidth: 100 }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Post'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {posts.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}>
          No posts yet. Be the first to share something!
        </Typography>
      ) : (
        posts.map(post => (
          <Card key={post._id} sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardHeader
              avatar={<Avatar src={post.author?.profilePicture || ''} alt={post.author?.username || 'User'} />}
              title={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>{post.author?.username || 'Unknown'}</Typography>}
              subheader={<Typography variant="caption" color="text.secondary">{new Date(post.createdAt).toLocaleString()}</Typography>}
            />
            <CardContent sx={{ py: 1 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.content}
              </Typography>
              {post.imageUrl && (
                <CardMedia
                  component="img"
                  height="300"
                  image={post.imageUrl}
                  alt="Post image"
                  sx={{ borderRadius: 2, objectFit: 'cover' }}
                />
              )}
            </CardContent>
            <CardActions sx={{ px: 2, py: 1 }}>
              <IconButton 
                aria-label="like" 
                onClick={() => handleLike(post._id)}
                color={post.likes.includes(currentUserId) ? 'secondary' : 'default'}
                size="small"
                sx={{ mr: 1 }}
              >
                <FavoriteIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" sx={{ mr: 2 }}>
                {post.likes.length}
              </Typography>
              <IconButton 
                aria-label="comment" 
                size="small"
                sx={{ mr: 1 }}
              >
                <CommentIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2">
                {post.comments.length}
              </Typography>
            </CardActions>
            <Divider />
            <Box sx={{ p: 2 }}>
              {post.comments.length > 0 && (
                <List sx={{ mb: 2, maxHeight: 200, overflowY: 'auto' }}>
                  {post.comments.map(comment => (
                    <ListItem key={comment._id} disablePadding sx={{ py: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar src={comment.author?.profilePicture || ''} alt={comment.author?.username || 'User'} size="small" />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 'bold' }}>{comment.author?.username || 'Unknown'}</Typography>} 
                        secondary={<Typography variant="body2" color="text.secondary">{comment.content}</Typography>} 
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              <Box component="form" onSubmit={(e) => handleComment(post._id, e)} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  placeholder="Write a comment..."
                  value={newComment[post._id] || ''}
                  onChange={(e) => handleCommentChange(post._id, e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: '#fafafa', borderRadius: 1, mr: 1 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<SendIcon fontSize="small" />}
                  disabled={!newComment[post._id]?.trim()}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
}

export default FeedPage;
