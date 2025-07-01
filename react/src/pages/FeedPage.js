import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CardHeader, Avatar, CardActions, IconButton } from '@mui/material';
import { Favorite, Comment } from '@mui/icons-material';
import { getFeed, createPost, likePost, addComment } from '../utils/api';

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getFeed();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feed:', error);
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost) return;
    try {
      const post = await createPost(newPost, '');
      setPosts([post, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: [...post.likes, localStorage.getItem('userId')] } : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const comment = await addComment(postId, content);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, comments: [...post.comments, comment] } : post
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        News Feed
      </Typography>
      <Box component="form" onSubmit={handlePostSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          variant="outlined"
          sx={{ mb: 1 }}
        />
        <Button type="submit" variant="contained">Post</Button>
      </Box>
      {posts.map(post => (
        <Card key={post._id} sx={{ mb: 2 }}>
          <CardHeader
            avatar={<Avatar src={post.author?.avatar || ''} />}
            title={post.author?.username || 'Unknown'}
            subheader={new Date(post.createdAt).toLocaleString()}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton 
              aria-label="like" 
              onClick={() => handleLike(post._id)}
              color={post.likes.includes(localStorage.getItem('userId')) ? 'secondary' : 'default'}
            >
              <Favorite />
            </IconButton>
            <Typography>{post.likes.length}</Typography>
            <IconButton aria-label="comment" onClick={() => handleComment(post._id, 'Nice post!')}>
              <Comment />
            </IconButton>
            <Typography>{post.comments.length}</Typography>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}

export default FeedPage;
