import React from 'react';
import { Avatar, Box, Typography, Paper } from '@mui/material';
import chatbot from '../assets/images/chatbot.png';
import user from '../assets/images/user.png';

const ChatMessage = ({ chatLog, parseMessageContent }) => {
  return (
    <Box sx={{ width: '100%', padding: '10px 0' }}>
      {chatLog.map((chat, index) => (
        <Paper
          key={index}
          elevation={2}
          sx={{
            backgroundColor: chat.role === 'assistant' ? '#fff' : '#e0f7fa',
            boxShadow: '0px 0px 7px #898080',
            padding: '15px',
            color: '#1a3673',
            margin: '0 -22px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', 
            backgroundColor: chat.role === 'assistant' ? '#fff' : '#e0f7fa',
            justifyContent: 'center' }}>
            {chat.role !== 'assistant' ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: 14 }}>
                    {chat.content}
                  </Typography>
                </Box>
                <Avatar src={user} alt="User" sx={{ borderRadius: '50%' }} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={chatbot} alt="Chatbot" sx={{ mr: 4, borderRadius: '50%' }} />
                <Typography variant="body2" sx={{ fontSize: 14 }}>
                  {parseMessageContent(chat.content)}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default ChatMessage;

