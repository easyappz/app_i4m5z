import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Switch, FormControlLabel, Divider, CircularProgress, Paper, Alert } from '@mui/material';
import { Settings as SettingsIcon, Save as SaveIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../utils/api';

function SettingsPage() {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    bio: '',
    isPrivate: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile(currentUserId);
        setUserData({
          username: data.username || '',
          email: data.email || '',
          bio: data.bio || '',
          isPrivate: data.isPrivate || false
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your settings. Please try again later.');
        setLoading(false);
      }
    };
    if (currentUserId) {
      fetchUserData();
    } else {
      navigate('/login');
    }
  }, [currentUserId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setUserData(prev => ({ ...prev, isPrivate: e.target.checked }));
  };

  const handleSaveChanges = async () => {
    if (!userData.username.trim() || !userData.email.trim()) {
      setError('Username and email cannot be empty.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updatedUser = await updateUserProfile(currentUserId, {
        username: userData.username,
        email: userData.email,
        bio: userData.bio,
        isPrivate: userData.isPrivate
      });
      setUserData({
        username: updatedUser.username || '',
        email: updatedUser.email || '',
        bio: updatedUser.bio || '',
        isPrivate: updatedUser.isPrivate || false
      });
      setSuccess('Settings updated successfully!');
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
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
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Settings
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Account Settings
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <TextField
            label="Username"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            required
            disabled={saving}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            required
            disabled={saving}
          />
          <TextField
            label="Bio"
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            disabled={saving}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Privacy Settings
        </Typography>
        <Box sx={{ mb: 4 }}>
          <FormControlLabel
            control={
              <Switch 
                checked={userData.isPrivate} 
                onChange={handleSwitchChange} 
                disabled={saving} 
              />
            }
            label="Private Account"
            labelPlacement="end"
            sx={{ width: '100%', justifyContent: 'space-between', marginLeft: 0 }}
          />
          <Typography variant="caption" color="text.secondary">
            When your account is private, only people you approve can see your posts and profile.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={handleSaveChanges}
            disabled={saving}
            sx={{ minWidth: 120 }}
          >
            {saving ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ minWidth: 120 }}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default SettingsPage;
