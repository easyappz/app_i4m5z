import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { sendMessage, getMessages } from '../utils/api';

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChatId, setSelectedChatId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChatId) {
      const fetchMessages = async () => {
        setLoading(true);
        try {
          const data = await getMessages(selectedChatId);
          setMessages(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [selectedChatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage || !selectedChatId) return;
    try {
      // Assuming recipientId is part of chatId or can be derived
      const recipientId = selectedChatId.split('_').find(id => id !== localStorage.getItem('userId'));
      const message = await sendMessage(recipientId, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Dummy chat list for demonstration
  const chats = [
    { id: `${localStorage.getItem('userId')}_dummyRecipient`, name: 'Dummy User' }
  ];

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', display: 'flex', gap: 2 }}>
      <Box sx={{ width: '30%', borderRight: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Chats
        </Typography>
        <List>
          {chats.map(chat => (
            <ListItem 
              key={chat.id} 
              onClick={() => setSelectedChatId(chat.id)}
              selected={selectedChatId === chat.id}
            >
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText primary={chat.name} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ width: '70%' }}>
        <Typography variant="h6" gutterBottom>
          Messages
        </Typography>
        {selectedChatId ? (
          <>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <List sx={{ height: '60vh', overflowY: 'auto', border: 1, borderColor: 'divider', p: 2 }}>
                {messages.map(msg => (
                  <ListItem key={msg._id} sx={{ flexDirection: msg.sender._id === localStorage.getItem('userId') ? 'row-reverse' : 'row' }}>
                    <ListItemAvatar>
                      <Avatar src={msg.sender.avatar || ''} />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={msg.content} 
                      secondary={new Date(msg.createdAt).toLocaleTimeString()} 
                      sx={{ backgroundColor: msg.sender._id === localStorage.getItem('userId') ? '#e3f2fd' : '#f5f5f5', p: 1, borderRadius: 1 }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            <Box component="form" onSubmit={handleSendMessage} sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                variant="outlined"
              />
              <Button type="submit" variant="contained">Send</Button>
            </Box>
          </>
        ) : (
          <Typography>Select a chat to start messaging</Typography>
        )}
      </Box>
    </Box>
  );
}

export default MessagesPage;
