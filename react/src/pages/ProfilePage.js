import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, Button, TextField, CircularProgress, Paper, Divider } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { getUserProfile, updateUserProfile, uploadAvatar } from '../utils/api';

function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const currentUserId = localStorage.getItem('userId');
  const isOwnProfile = id === currentUserId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        setNotFound(false);
        const data = await getUserProfile(id);
        if (!data || Object.keys(data).length === 0) {
          setNotFound(true);
          setUser(null);
        } else {
          setUser(data);
          setUsername(data.username || '');
          setBio(data.bio || '');
          setAvatarPreview(data.profilePicture || '');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response && err.response.status === 404) {
          setNotFound(true);
          setUser(null);
        } else {
          setError('Failed to load profile. Please try again later.');
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await updateUserProfile(id, { username, bio });
      setUser(updatedUser);
      setEditMode(false);
      setError('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      setError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const updatedUser = await uploadAvatar(id, formData);
      setUser(updatedUser);
      setAvatarFile(null);
      setError('');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notFound || !user) {
    return (
      <Box sx={{ maxWidth: 800, margin: 'auto', textAlign: 'center', mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" color="error" gutterBottom>
            User not found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The user you are looking for does not exist or could not be found.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.history.back()}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', py: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar 
            src={avatarPreview || user.profilePicture || ''} 
            alt={user.username || 'User Avatar'}
            sx={{ width: 120, height: 120, margin: 'auto', mb: 2, border: '3px solid #fff', boxShadow: 1 }}
          />
          {editMode && (
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 1, mb: 2 }}
              disabled={uploading}
            >
              {uploading ? <CircularProgress size={24} /> : 'Choose Avatar'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </Button>
          )}
          {avatarFile && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadAvatar}
              disabled={uploading}
              sx={{ ml: 1, mt: 1, mb: 2 }}
            >
              {uploading ? <CircularProgress size={24} /> : 'Upload Avatar'}
            </Button>
          )}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {user.username || 'Unknown User'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {user.bio || 'No bio provided.'}
          </Typography>
          {isOwnProfile && (
            <Button
              variant="contained"
              color={editMode ? 'secondary' : 'primary'}
              startIcon={editMode ? <CancelIcon /> : <EditIcon />}
              onClick={() => setEditMode(!editMode)}
              sx={{ mt: 2 }}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </Button>
          )}
        </Box>

        {error && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center', mb: 2 }}>
            {error}
          </Typography>
        )}

        <Divider sx={{ mb: 4 }} />

        {editMode ? (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500, margin: 'auto' }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleUpdateProfile}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setEditMode(false);
                  setUsername(user.username || '');
                  setBio(user.bio || '');
                  setAvatarPreview(user.profilePicture || '');
                  setAvatarFile(null);
                  setError('');
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', maxWidth: 500, margin: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Followers: {user.followers?.length || 0}
            </Typography>
            <Typography variant="h6">
              Following: {user.following?.length || 0}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ProfilePage;
