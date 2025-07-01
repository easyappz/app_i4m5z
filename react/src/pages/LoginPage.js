import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Alert, Paper, Avatar } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { login } from '../utils/api';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ 
        marginTop: 8, 
        p: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        borderRadius: 3, 
        backgroundColor: '#000000', 
        color: '#ffffff' 
      }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56, color: '#ffffff' }}>
          <LockOutlined fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: '#ffffff' }}>
          Sign In
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 3, color: '#b0b0b0' }}>
          Welcome back! Please enter your details.
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%', borderRadius: 2, backgroundColor: '#2d1b1b', color: '#ffcccc' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%', maxWidth: 400 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{ 
              borderRadius: 2, 
              '& .MuiInputBase-input': { color: '#ffffff' },
              '& .MuiInputLabel-root': { color: '#b0b0b0' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444444' },
                '&:hover fieldset': { borderColor: '#666666' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ 
              borderRadius: 2, 
              '& .MuiInputBase-input': { color: '#ffffff' },
              '& .MuiInputLabel-root': { color: '#b0b0b0' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444444' },
                '&:hover fieldset': { borderColor: '#666666' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem', backgroundColor: 'primary.main', color: '#ffffff' }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="text"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem', color: '#b0b0b0', '&:hover': { color: '#ffffff' } }}
          >
            Don't have an account? Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
