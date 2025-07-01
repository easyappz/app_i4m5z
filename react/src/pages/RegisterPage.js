import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Alert, Paper, Avatar } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { register } from '../utils/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    try {
      const data = await register(username, email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ marginTop: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          <PersonAdd fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
          Sign Up
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Create an account to start connecting with friends.
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%', borderRadius: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%', maxWidth: 400 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
          >
            Sign Up
          </Button>
          <Button
            fullWidth
            variant="text"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
          >
            Already have an account? Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
