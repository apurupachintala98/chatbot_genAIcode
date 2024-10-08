import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { Avatar, Alert, CircularProgress, Box, Grid, Typography, TextField, Button, IconButton } from '@mui/material';
import { HiUpload } from "react-icons/hi";
import { FaTelegramPlane } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import chatbot from '../assets/images/chatbot.png';
import user from '../assets/images/user.png';
import Feedback from "../components/Feedback";
import SuggestedPrompts from '../components/SuggestedPrompts';
import parseMessageContent from '../components/parseMessageContent';
import faq from '../assets/images/FAQ.jpg';
import query from '../assets/images/Query.png';
import scheduler from '../assets/images/scheduler.jpg';
import "./Dashboard.css";

function UserX({
  chatLog, setChatLog,
  isVisible, setIsVisible,
  responseReceived, setResponseReceived,
  error, setError,
  routeCdUpdated, setRouteCdUpdated,
  uploadStatus, setUploadStatus,
  showPrompts, setShowPrompts,
  routeCd, setRouteCd,
  isLoading, setIsLoading,
  successMessage, setSuccessMessage,
  fileUploadCondition, setFileUploadCondition
}) {
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [appCd, setAppCd] = useState('ARB_Bot');
  const [requestId, setRequestId] = useState('8000');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "I want to schedule an ARB meeting",
    "What is the status of my ARB review?",
    "Guide me on the TGOV process?",
    "Guide me on Snowflake Onboarding process",
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const createDummyFile = () => {
    const blob = new Blob(["This is a dummy file for Architecture Deck"], { type: 'application/pdf' });
    const file = new File([blob], "dummy.pdf", { type: 'application/pdf' });
    return file;
  };

  const handlePromptClick = async (prompt) => {
    const newMessage = {
      role: 'user',
      content: prompt,
    };
    const newChatLog = [...chatLog, newMessage];
    setChatLog(newChatLog);
    setInput('');
    setIsLoading(true);
    setError('');
    setShowPrompts(false);
    setIsVisible(false);
    try {
      const response = await fetch(
        `http://10.126.192.122:8000/get_llm_response/?app_cd=${appCd}&request_id=${requestId}&route_cd=${routeCd}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newChatLog)
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.route_cd && data.route_cd !== routeCd) {
        setRouteCd(data.route_cd);
        setRouteCdUpdated(true);
        const silentMessage = { role: 'user', content: 'Hey' };
        const silentResponse = await fetch(
          `http://10.126.192.122:8000/get_llm_response/?app_cd=${appCd}&request_id=${requestId}&route_cd=${data.route_cd}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([...newChatLog, silentMessage])
          }
        );
        if (!silentResponse.ok) {
          throw new Error('Network response was not ok while sending silent message');
        }
        const silentData = await silentResponse.json();
        const finalBotMessage = { role: 'assistant', content: silentData.modelreply };
        setChatLog(prevChatLog => [...prevChatLog, finalBotMessage]);
      } else {
        const botMessage = { role: 'assistant', content: data.modelreply };
        setChatLog(prevChatLog => [...prevChatLog, botMessage]);
      }
    } catch (err) {
      setError('Error communicating with backend');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
      setSelectedFile(file);
      setUploadStatus('');
    } else {
      setSelectedFile(null);
      setUploadStatus('Please select a valid PDF or PPTX file.');
    }
  };

  const handleCategoryClick = async (categoryRouteCd) => {
    setCategoryLoading(true);
    setRouteCd(categoryRouteCd);
    setIsVisible(false);
    setRouteCdUpdated(true);
    setShowPrompts(false);
    try {
      const silentMessage = { role: 'user', content: 'Hey' };
      const response = await fetch(
        `http://10.126.192.122:8000/get_llm_response/?app_cd=${appCd}&request_id=${requestId}&route_cd=${categoryRouteCd}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([silentMessage])
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.modelreply };
      setChatLog(prevChatLog => [...prevChatLog, botMessage]);
    } catch (err) {
      setError('Error communicating with backend');
      console.error(err);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!appCd.trim() || !requestId.trim()) {
      setError('Please provide valid app_cd and request_id.');
      return;
    }
    const newMessage = { role: 'user', content: input };
    const newChatLog = [...chatLog, newMessage];
    setChatLog(newChatLog);
    setInput('');
    setIsLoading(true);
    setError('');
    setShowPrompts(false);
    setIsVisible(false);
    try {
      const response = await fetch(
        `http://10.126.192.122:8000/get_llm_response/?app_cd=${appCd}&request_id=${requestId}&route_cd=${routeCd}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newChatLog)
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setApiResponse(data);
      const modelReply = data.modelreply;
      if (modelReply.includes(' "Architecture Deck": "Yes"')) {
        setFileUploadCondition(true);
      }
    } catch (err) {
      setError('Error communicating with backend');
      console.error(err);
    } finally {
      setIsLoading(false);
      setShowPrompts(false);
    }
  };

  useLayoutEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  return (
    <Box className="chat-container" p={isMobile ? 2 : isTablet ? 3 : 4}>
      {isVisible && (
        <Box textAlign="center">
          <Avatar alt="Chatbot" src={chatbot} sx={{ width: 56, height: 56 }} />
          <Typography variant="h6" mt={2}>
            Hello there, I am your ARB Scheduler Assistant. How can I help you today?
          </Typography>
        </Box>
      )}

      <Grid container spacing={2} className="user-chat-container">
        {categoryLoading && (
          <Grid item xs={12} textAlign="center">
            <CircularProgress />
            <Typography mt={2}>Generating the response</Typography>
          </Grid>
        )}
        
        {chatLog.map((chat, index) => (
          <Grid key={index} item xs={12} sm={8} md={6}>
            <Box className={`chat_message ${chat.role === 'assistant' ? 'ai' : ''}`} p={2}>
              {chat.role === 'user' ? (
                <Box display="flex" justifyContent="flex-end">
                  <Avatar alt="User" src={user} />
                  <Typography variant="body2">{chat.content}</Typography>
                </Box>
              ) : (
                <Box display="flex" justifyContent="flex-start">
                  <Avatar alt="Chatbot" src={chatbot} />
                  <Typography variant="body2">{parseMessageContent(chat.content)}</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        ))}
        
        {successMessage && (
          <Grid item xs={12}>
            <Alert severity="success">{successMessage}</Alert>
          </Grid>
        )}
        
        {isLoading && (
          <Grid item xs={12} textAlign="center">
            <CircularProgress />
          </Grid>
        )}
        
        {fileUploadCondition && (
          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <TextField
                type="file"
                onChange={handleFileChange}
                inputProps={{ accept: '.pdf,.pptx' }}
                fullWidth
              />
              <Button
                variant="contained"
                startIcon={<HiUpload />}
                type="submit"
                fullWidth
                sx={{ mt: 2 }}
              >
                Upload
              </Button>
            </form>
          </Grid>
        )}
        
        <Grid item xs={12}>
          <form onSubmit={handleSubmit} className="flex">
            <TextField
              fullWidth
              placeholder="What can I help you with..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              variant="outlined"
              sx={{ mr: 2 }}
            />
            <IconButton type="submit">
              <FaTelegramPlane color="#1a3673" />
            </IconButton>
          </form>
        </Grid>
        
        <div ref={endOfMessagesRef} />
        
        {showPrompts && (
          <Grid item xs={12}>
            <SuggestedPrompts prompts={suggestedPrompts} onPromptClick={handlePromptClick} />
          </Grid>
        )}
        
        {uploadStatus && (
          <Grid item xs={12} textAlign="center">
            <Typography>{uploadStatus}</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default UserX;
