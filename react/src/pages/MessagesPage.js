import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, CircularProgress, Paper } from '@mui/material';
import { Send as SendIcon, Chat as ChatIcon } from '@mui/icons-material';
import { sendMessage, getMessages } from '../utils/api';

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChatId, setSelectedChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [fetchingChats, setFetchingChats] = useState(true);
  const messagesEndRef = useRef(null);

  const currentUserId = localStorage.getItem('userId');

  // Mock chat list (in a real app, this should come from an API endpoint)
  useEffect(() => {
    // Simulating fetching chats from an API
    const mockChats = [
      { id: 'chat_1', userId: 'user_2', name: 'John Doe', avatar: '', lastMessage: 'Hey, how are you?', timestamp: new Date().toISOString() },
      { id: 'chat_2', userId: 'user_3', name: 'Jane Smith', avatar: '', lastMessage: 'See you tomorrow!', timestamp: new Date().toISOString() }
    ];
    setChats(mockChats);
    setFetchingChats(false);
  }, []);

  // Fetch messages for the selected chat
  useEffect(() => {
    if (selectedChatId) {
      const fetchMessages = async () => {
        setLoading(true);
        try {
          const userId = selectedChatId.split('_').find(id => id !== currentUserId && id !== 'chat');
          const data = await getMessages(userId);
          setMessages(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [selectedChatId, currentUserId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId) return;
    try {
      const recipientId = selectedChatId.split('_').find(id => id !== currentUserId && id !== 'chat');
      const message = await sendMessage(recipientId, newMessage.trim());
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', py: 4, px: 2, height: '80vh', display: 'flex' }}>
      <Paper elevation={3} sx={{ width: '30%', borderRadius: 3, overflow: 'hidden', mr: 2 }}>
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center' }}>
          <ChatIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Chats</Typography>
        </Box>
        <Divider />
        {fetchingChats ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List sx={{ height: 'calc(80vh - 64px)', overflowY: 'auto' }}>
            {chats.length > 0 ? (
              chats.map(chat => (
                <ListItem 
                  key={chat.id} 
                  onClick={() => setSelectedChatId(chat.id)}
                  selected={selectedChatId === chat.id}
                  sx={{ 
                    cursor: 'pointer', 
                    '&.Mui-selected': { backgroundColor: '#e3f2fd' }, 
                    '&:hover': { backgroundColor: '#f0f0f0' } 
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={chat.avatar || ''} alt={chat.name} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={chat.name} 
                    secondary={chat.lastMessage} 
                    primaryTypographyProps={{ fontWeight: selectedChatId === chat.id ? 'bold' : 'normal' }}
                    secondaryTypographyProps={{ noWrap: true, textOverflow: 'ellipsis' }}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                No chats available
              </Typography>
            )}
          </List>
        )}
      </Paper>

      <Paper elevation={3} sx={{ width: '70%', borderRadius: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {selectedChatId ? (
          <>
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6">
                {chats.find(chat => chat.id === selectedChatId)?.name || 'Chat'}
              </Typography>
            </Box>
            <Divider />
            {loading ? (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, height: 'calc(80vh - 140px)', overflowY: 'auto', p: 2 }}>
                {messages.length > 0 ? (
                  <List>
                    {messages.map((msg, index) => (
                      <ListItem 
                        key={msg._id || index} 
                        sx={{ 
                          flexDirection: msg.sender?._id === currentUserId ? 'row-reverse' : 'row', 
                          mb: 2 
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={msg.sender?.avatar || ''} alt={msg.sender?.username || 'User'} />
                        </ListItemAvatar>
                        <Box 
                          sx={{ 
                            maxWidth: '70%', 
                            backgroundColor: msg.sender?._id === currentUserId ? '#1976d2' : '#f0f0f0', 
                            color: msg.sender?._id === currentUserId ? 'white' : 'black', 
                            borderRadius: 2, 
                            p: 1.5, 
                            boxShadow: 1 
                          }}
                        >
                          <Typography variant="body1">{msg.content}</Typography>
                          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    No messages yet. Start the conversation!
                  </Typography>
                )}
              </Box>
            )}
            <Divider />
            <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={!newMessage.trim() || loading}
                startIcon={<SendIcon />}
                sx={{ minWidth: 100 }}
              >
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default MessagesPage;
