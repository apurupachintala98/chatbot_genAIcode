import React from 'react';
import { Avatar } from '@mui/material';
import chatbot from '../assets/images/chatbot.png';
import user from '../assets/images/user.png';

const ChatMessage = ({ chatLog, parseMessageContent }) => {
  return (
    <div style={{ width: '100%', padding: '10px 0' }}>
      {chatLog.map((chat, index) => (
        <div
          key={index}
          style={{
            backgroundColor: chat.role === 'assistant' ? '#fff' : '#e0f7fa',
            padding: '12px',
            transition: 'width 0.3s ease',
            borderRadius: '15px',
            margin: '10px auto',
            maxWidth: '80%', // Limits width to 80% of container
            width: 'fit-content',
            alignSelf: chat.role === 'assistant' ? 'flex-start' : 'flex-end', // Align messages based on role
            boxShadow: '0px 0px 7px #898080',
            color: '#1a3673',
          }}
          className={`chat_message ${chat.role === 'assistant' ? 'ai' : ''}`}
        >
          <div className="chat_message_center" style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`flex ${chat.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
              {chat.role !== 'assistant' ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="info">
                    <div className="message" style={{ fontSize: '14px' }}>{chat.content}</div>
                  </div>
                  <div className="image">
                    <Avatar src={user} alt="User" sx={{ mb: 0, borderRadius: '50%' }} />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="image">
                    <Avatar src={chatbot} alt="Chatbot" sx={{ borderRadius: '50%' }} />
                  </div>
                  <div className="info">
                    <div className="message" style={{ fontSize: '14px' }}>
                      {parseMessageContent(chat.content)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessage;
