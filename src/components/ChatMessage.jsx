import React from 'react';
import { Avatar, Box, Typography, Paper } from '@mui/material';
import chatbot from '../assets/images/chatbot.png';
import user from '../assets/images/user.png';

const ChatMessage = ({ chatLog, parseMessageContent }) => {
  return (
    <Box sx={{ width: '100%', padding: '10px 0' }}>
      {chatLog.map((chat, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: chat.role === 'assistant' ? 'flex-start' : 'flex-end',
            marginBottom: '10px',
          }}
        >
          <Paper
            elevation={2}
            sx={{
              backgroundColor: chat.role === 'assistant' ? '#fff' : '#e0f7fa',
              boxShadow: '0px 0px 7px #898080',
              padding: '10px 15px',
              color: '#1a3673',
              maxWidth: '70%', // Make message container dynamic based on content size
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {chat.role === 'assistant' ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={chatbot}
                  alt="Chatbot"
                  sx={{ mr: 2, borderRadius: '50%', width: 32, height: 32 }}
                />
                <Typography variant="body2" sx={{ fontSize: 14 }}>
                  {parseMessageContent(chat.content)}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontSize: 14, mr: 2 }}>
                  {chat.content}
                </Typography>
                <Avatar
                  src={user}
                  alt="User"
                  sx={{ borderRadius: '50%', width: 32, height: 32 }}
                />
              </Box>
            )}
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default ChatMessage;
