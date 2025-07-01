import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Card, CardContent, CardHeader, Divider, CircularProgress, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { search } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await search(query.trim());
      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching:', error);
      setError('Failed to perform search. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', py: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SearchIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Search
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search for users or posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || !query.trim()}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Users
          </Typography>
          {results.users.length > 0 ? (
            <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <List>
                {results.users.map(user => (
                  <React.Fragment key={user._id}>
                    <ListItem 
                      onClick={() => navigate(`/profile/${user._id}`)}
                      sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.avatar || ''} alt={user.username || 'User'} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 'bold' }}>{user.username}</Typography>} 
                        secondary={user.email || 'No email provided'} 
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              {query ? 'No users found matching your search.' : 'Enter a query to search for users.'}
            </Typography>
          )}

          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, mt: 4 }}>
            Posts
          </Typography>
          {results.posts.length > 0 ? (
            results.posts.map(post => (
              <Card key={post._id} sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
                <CardHeader
                  avatar={<Avatar src={post.author?.avatar || ''} alt={post.author?.username || 'User'} />}
                  title={<Typography sx={{ fontWeight: 'bold' }}>{post.author?.username || 'Unknown'}</Typography>}
                  subheader={<Typography variant="caption" color="text.secondary">{new Date(post.createdAt).toLocaleString()}</Typography>}
                />
                <CardContent>
                  <Typography variant="body1" color="text.primary">
                    {post.content}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {query ? 'No posts found matching your search.' : 'Enter a query to search for posts.'}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default SearchPage;
