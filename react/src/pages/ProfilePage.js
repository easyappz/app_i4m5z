import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, Button, TextField } from '@mui/material';
import { getUserProfile, updateUserProfile, uploadAvatar } from '../utils/api';

function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(id);
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
        setAvatarUrl(data.avatar);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await updateUserProfile(username, email);
      setUser(updatedUser);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleUploadAvatar = async () => {
    try {
      const updatedUser = await uploadAvatar(avatarUrl);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Avatar src={user.avatar || ''} sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }} />
      {editMode ? (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Avatar URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            fullWidth
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleUpdateProfile}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleUploadAvatar}>
              Upload Avatar
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Typography variant="h6">{user.username}</Typography>
          <Typography variant="body1" color="text.secondary">{user.email}</Typography>
          {id === localStorage.getItem('userId') && (
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </>
      )}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Friends: {user.friends.length}
      </Typography>
    </Box>
  );
}

export default ProfilePage;
