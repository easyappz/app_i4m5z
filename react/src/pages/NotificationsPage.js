import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { getNotifications } from '../utils/api';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map(notification => (
          <ListItem 
            key={notification._id} 
            sx={{ backgroundColor: notification.isRead ? 'inherit' : '#e3f2fd' }}
          >
            <ListItemAvatar>
              <Avatar src={notification.sender?.avatar || ''} />
            </ListItemAvatar>
            <ListItemText 
              primary={notification.content} 
              secondary={`${notification.sender?.username || 'Unknown'} - ${new Date(notification.createdAt).toLocaleString()}`} 
            />
          </ListItem>
        ))}
      </List>
      {notifications.length === 0 && <Typography>No notifications yet.</Typography>}
    </Box>
  );
}

export default NotificationsPage;
