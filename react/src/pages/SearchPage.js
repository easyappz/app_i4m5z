import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Card, CardContent, CardHeader } from '@mui/material';
import { search } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const data = await search(query);
      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching:', error);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Search
      </Typography>
      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search users or posts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
        />
        <Button type="submit" variant="contained">Search</Button>
      </Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Typography variant="h6">Users</Typography>
          <List>
            {results.users.map(user => (
              <ListItem 
                key={user._id} 
                onClick={() => navigate(`/profile/${user._id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar || ''} />
                </ListItemAvatar>
                <ListItemText primary={user.username} secondary={user.email} />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" sx={{ mt: 2 }}>Posts</Typography>
          {results.posts.map(post => (
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
            </Card>
          ))}
        </>
      )}
    </Box>
  );
}

export default SearchPage;
