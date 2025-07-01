import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, CircularProgress, Paper, Button } from '@mui/material';
import { Notifications as NotificationsIcon, Markunread as MarkunreadIcon } from '@mui/icons-material';
import { getNotifications } from '../utils/api';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications();
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications. Please try again later.');
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Assuming there is an API endpoint to mark as read (not implemented in provided utils/api.js)
      // For now, simulate the action on the frontend
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Failed to mark notification as read.');
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', py: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NotificationsIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Notifications
            </Typography>
          </Box>
          {notifications.some(n => !n.isRead) && (
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<MarkunreadIcon />}
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </Button>
          )}
        </Box>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {notifications.length === 0 ? (
            <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', p: 4 }}>
              No notifications yet.
            </Typography>
          ) : (
            <List>
              {notifications.map(notification => (
                <React.Fragment key={notification._id}>
                  <ListItem 
                    sx={{ 
                      backgroundColor: notification.isRead ? 'inherit' : '#e3f2fd', 
                      '&:hover': { backgroundColor: notification.isRead ? '#f5f5f5' : '#d1e5fc' } 
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={notification.sender?.avatar || ''} alt={notification.sender?.username || 'User'} />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={<Typography sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}>{notification.content}</Typography>} 
                      secondary={`${notification.sender?.username || 'Unknown'} - ${new Date(notification.createdAt).toLocaleString()}`} 
                    />
                    {!notification.isRead && (
                      <Button 
                        variant="text" 
                        size="small" 
                        onClick={() => handleMarkAsRead(notification._id)}
                        sx={{ ml: 2 }}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default NotificationsPage;
