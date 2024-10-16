import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Avatar, Alert } from 'flowbite-react';
import { FaTelegramPlane } from 'react-icons/fa';
import chatbot from '../assets/images/chatbot.png';
import HashLoader from 'react-spinners/HashLoader';
import SuggestedPrompts from '../components/SuggestedPrompts';
import Feedback from '../components/Feedback';
// import Loader from '../components/Loader';
import parseMessageContent from '../components/parseMessageContent';
import ARBCategories from '../components/ARBCategories';
import FileUploader from '../components/FileUploader';
import ChatMessage from '../components/ChatMessage';
import { Box, Grid, TextField, Button, IconButton, Typography, InputAdornment, Toolbar, useTheme, useMediaQuery } from '@mui/material';

function UserChat(props) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const {
    chatLog, setChatLog,
    themeColor,
    responseReceived, setResponseReceived,
    error, setError,
    routeCdUpdated, setRouteCdUpdated,
    uploadStatus, setUploadStatus,
    routeCd, setRouteCd,
    isLoading, setIsLoading,
    successMessage, setSuccessMessage,
    fileUploadCondition, setFileUploadCondition,
    setCategoryLoading, categoryLoading,
    selectedCategory, setSelectedCategory,
    showInitialView, setShowInitialView,
  } = props;

  const endOfMessagesRef = useRef(null);
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file
  const [apiResponse, setApiResponse] = useState(null); // New state for storing API response
  const [appCd, setAppCd] = useState('ARB_Bot'); // User input for app_cd
  const [requestId, setRequestId] = useState('8000'); // User input for request_id
  const [input, setInput] = useState('');
  const layoutWidth = isSmallScreen ? '100%' : isMediumScreen ? '80%' : '70%';

  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "I want to schedule an ARB meeting",
    "What is the status of my ARB review?",
    "Guide me on the TGOV process?",
    "Guide me on Snowflake Onboarding process",
  ]);

  // Scroll to the bottom when a new message is added
  useLayoutEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  //creating dummy file for the architecture deck condition as "No"
  const createDummyFile = () => {
    const blob = new Blob(["This is a dummy file for Architecture Deck"], { type: 'application/pdf' });
    const file = new File([blob], "dummy.pdf", { type: 'application/pdf' });
    return file;
  };

  // Handle clicking on a suggested prompt
  const handlePromptClick = async (prompt) => {
    const newMessage = {
      role: 'user',
      content: prompt,
    };

    const newChatLog = [...chatLog, newMessage]; // Add new user message to chat log
    setChatLog(newChatLog); // Update the chat log state
    setInput(''); // Clear the input field
    setIsLoading(true); // Set loading state to true
    setError(''); // Clear any previous error
    setShowInitialView(false);

    try {
      // Send the new message to the API
      const response = await fetch(
        `http://10.126.192.122:8000/get_llm_response/?app_cd=${appCd}&request_id=${requestId}&route_cd=${routeCd}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newChatLog) // Send the updated chat log
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Handle route_cd change
      if (data.route_cd && data.route_cd !== routeCd) {
        const previousRouteCd = routeCd; // Store the previous routeCd
        setRouteCd(data.route_cd); // Update the route_cd
        setRouteCdUpdated(true);
        // Prepare the silent message "Hey"
        const silentMessage = {
          role: 'user',
          content: 'Hey',
        };
        // Send the "Hey" message to the API but don't display it in the chatLog
        const silentResponse = await fetch(
          `http://10.126.192.122:8000/get_llm_response/?app_cd=${appCd}&request_id=${requestId}&route_cd=${data.route_cd}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([...newChatLog, silentMessage]) // Include the new chat log and the silent message
          }
        );
        if (!silentResponse.ok) {
          throw new Error('Network response was not ok while sending silent message');
        }
        const silentData = await silentResponse.json();
        // Only store the final assistant's response from the silent call
        const finalBotMessage = {
          role: 'assistant',
          content: silentData.modelreply,
        };
        // Update chat log without the silent message
        setChatLog(prevChatLog => [...prevChatLog, finalBotMessage]); // Only add the final response to the chat log
      } else {
        // Add the assistant's response to the chat log
        const botMessage = {
          role: 'assistant',
          content: data.modelreply, // Assuming modelreply contains the bot's response
        };
        setChatLog(prevChatLog => [...prevChatLog, botMessage]); // Update chat log with bot's response
      }
    } catch (err) {
      setError('Error communicating with backend'); // Handle errors
      console.error(err);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // Handle clicking on a category icon and updating routeCd
  const handleCategoryClick = async (categoryRouteCd) => {
    setCategoryLoading(true); // Show loader when the category is clicked
    setRouteCd(categoryRouteCd); // Update the route_cd based on the clicked category
    setRouteCdUpdated(true);
    setShowInitialView(false);

    try {
      // Prepare the silent message "Hey"
      const silentMessage = {
        role: 'user',
        content: 'Hey',
      };

      // Send the "Hey" message to the API but don't display it in the chatLog
      const response = await fetch(
        `http://10.126.192.122:8000/get_llm_response/?app_cd=${appCd}&request_id=${requestId}&route_cd=${categoryRouteCd}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([silentMessage])
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Add the assistant's response (modelReply) to the chatLog
      const botMessage = {
        role: 'assistant',
        content: data.modelreply, // Assuming modelreply contains the bot's response
      };

      setChatLog(prevChatLog => [...prevChatLog, botMessage]); // Only add the bot's response
    } catch (err) {
      setError('Error communicating with backend');
      console.error(err);
    } finally {
      // setIsLoading(false); // Set loading state to false after the API call
      setCategoryLoading(false); // Hide loader after the response is processed
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('app_cd', appCd);
    formData.append('request_id', requestId);
    formData.append('route_cd', routeCd);
    // Convert the string to a pure JSON object
    const pureJsonResultModelResponse = JSON.parse(apiResponse.app_info.json_result_model_response);
    console.log(pureJsonResultModelResponse);
    formData.append('app_info', JSON.stringify({
      json_result_model_response: pureJsonResultModelResponse,
      final_response_flag: "True"
    }));
    formData.append('file', selectedFile); // Add the selected file

    try {
      const response = await fetch(
        `http://10.126.192.122:8000/upload_file/?app_cd=${appCd}&request_id=${requestId}&route_cd=${routeCd}`, {
        method: 'POST',
        body: formData, // FormData object
      });
      if (response.ok) {
        setUploadStatus('File uploaded successfully as an attachment to Confluence!');
        setSuccessMessage('Record Inserted successfully into Confluence Portal'); // Set success message
        setSuccessMessage('ARB review invitation sent successfully'); // Set success message
      } else {
        setUploadStatus('File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('An error occurred while uploading the file.');
    } finally {
      // After file upload logic, reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input
      }
      setSelectedFile(null); 
    }
  };

  // Update handleSubmit
  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return; // Prevent empty messages
    if (!appCd.trim() || !requestId.trim()) {
      setError('Please provide valid app_cd and request_id.');
      return;
    }

    const newMessage = {
      role: 'user',
      content: input,
    };
    const newChatLog = [...chatLog, newMessage]; // Add user's message to chat log
    setChatLog(newChatLog);
    setInput(''); // Clear the input field
    setIsLoading(true); // Set loading state to true
    setError(''); // Clear any previous error
    setShowInitialView(false);
    try {
      // Dynamic API URL based on user inputs
      const response = await fetch(
        `http://10.126.192.122:8000/get_llm_response/?app_cd=${appCd}&request_id=${requestId}&route_cd=${routeCd}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newChatLog)
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let data = await response.json();

      // Convert final_response_flag to a string if it is a boolean true
      if (data.final_response_flag === true) {
        data.final_response_flag = "true"; // Change the boolean true to the string "true"
      }

      setApiResponse(data);
      const modelReply = data.modelreply; // Store model reply

      if (modelReply.includes(' "Architecture Deck": "Yes"')) {
        setFileUploadCondition(true); // Show file upload option if user replies with "yes"
      }

      // Check if the model reply indicates "No"
      if (modelReply.includes(' "Architecture Deck": "No"')) {
        const dummyFile = createDummyFile(); // Create the dummy file

        // Prepare FormData with the dummy file
        const formData = new FormData();
        formData.append('app_cd', appCd);
        formData.append('request_id', requestId);
        formData.append('route_cd', routeCd);

        const pureJsonResultModelResponse = JSON.parse(data.app_info.json_result_model_response);
        formData.append('app_info', JSON.stringify({
          json_result_model_response: pureJsonResultModelResponse,
          final_response_flag: "True",
        }));

        formData.append('file', dummyFile); // Add the dummy file

        // Upload the dummy file
        const fileUploadResponse = await fetch(
          `http://10.126.192.122:8000/upload_file/?app_cd=${appCd}&request_id=${requestId}&route_cd=${routeCd}`,
          {
            method: 'POST',
            body: formData,
          }
        );
      }

       // After handling the file upload, reset the file input and clear upload status
       if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input
      }

      // If route_cd is updated, send a "hey" message to the API but don't display it
      if (data.route_cd && data.route_cd !== routeCd) {
        setRouteCd(data.route_cd);
        setRouteCdUpdated(true);

        // Send "Hey" message to the API but don't display it
        const silentMessage = {
          role: 'user',
          content: 'Hey',
        };

        const silentResponse = await fetch(
          `http://10.126.192.122:8000/get_llm_response/?app_cd=${appCd}&request_id=${requestId}&route_cd=${data.route_cd}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([...newChatLog, silentMessage])
          }
        );

        if (!silentResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const silentData = await silentResponse.json();
        const finalBotMessage = {
          role: 'assistant',
          content: silentData.modelreply,
        };

        // Only add the final response to the chat log
        setChatLog([...newChatLog, finalBotMessage]);
      } else {
        // Normal flow: Add bot's response to chat log
        const botMessage = {
          role: 'assistant',
          content: data.modelreply,
        };
        setChatLog([...newChatLog, botMessage]);
      }
    } catch (err) {
      setError('Error communicating with backend');
      console.error(err);
    } finally {
      setIsLoading(false); // Set loading state to false
      // setHidePrompts(false);
    }
  }

  // Handle key press event for disappearing the default chat bot message on user click
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      simulateChatbotResponse(); // Simulate receiving a response from the chatbot
      setShowInitialView(false);
    }
  };

  // Simulate receiving a response from the chatbot
  const simulateChatbotResponse = () => {
    // Simulate a delay for receiving response
    setTimeout(() => {
      setResponseReceived(true); // Set the state to indicate response received
    }, 1000); // Simulated delay (1 second)
  };


  // Handle focus or input changes
  const handleInputFocusOrChange = () => {
    setShowInitialView(false);// Hide avatar, categories, and prompts when the input field is clicked or typed
  };


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: layoutWidth,
        flexDirection: 'column',
        margin: 'auto',
      }}
    >
      {/* Conditionally render content based on category, prompt click, or text input */}
      {showInitialView && (
        <>
          <Avatar img={chatbot} altText="Chatbot" rounded />
          <Box
            component="p"
            sx={{
              marginTop: '10px',
              fontSize: '16.5px',
              fontWeight: 600,
              color: themeColor,
              textAlign: 'center',
              marginBottom: '19%',
            }}
          >
            Hello there, I am your ARB Scheduler Assistant. How can I help you today?

            {/* ARB Categories Component */}
            <ARBCategories
              handleCategoryClick={handleCategoryClick}
              selectedCategory={selectedCategory}
            />
          </Box>

        </>
      )}
      {categoryLoading && (
        <>
          <Box display="flex" justifyContent="center" mt={8}>
            <HashLoader color="#1a3673" size={30} aria-label="Loading Spinner" data-testid="loader" />
            <Typography variant="h6" sx={{ ml: 3, fontWeight: 'bold', color: '#1a3673' }}>
              Generating response
            </Typography>
          </Box>
        </>
      )}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          overflowY: 'auto',
          maxHeight: '73vh',
          padding: '10px',
        }}
      >
        <ChatMessage chatLog={chatLog} parseMessageContent={parseMessageContent} />
        <div ref={endOfMessagesRef} />
        {isLoading && <HashLoader color="#1a3673" size={30} aria-label="Loading Spinner" data-testid="loader" />}
        {fileUploadCondition && (
          <FileUploader
            handleFileUpload={handleFileUpload}
            uploadStatus={uploadStatus}
            setUploadStatus={setUploadStatus}
            fileInputRef={fileInputRef}
            setSelectedFile={setSelectedFile}
          />
        )}
        {responseReceived && <Feedback />}
        {successMessage && (
          <Alert color="success">
            <span className="font-medium">{successMessage}</span>
          </Alert>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%', // Ensure they take up full width of the container
          maxWidth: '100%',
          flexDirection: 'column'
        }}
      >
        <Grid container spacing={2} sx={{ width: '100%', maxWidth: '100%', position: 'fixed', bottom: '50px', left: '67%', transform: 'translateX(-50%)', width: '70%', marginLeft: '8px', flexDirection: 'column' }}>
          {/* Suggested Prompts */}
          {showInitialView && (
            <Grid item xs={12} sm={6}>
              <SuggestedPrompts
                prompts={suggestedPrompts}
                onPromptClick={handlePromptClick}
                sx={{
                  mb: 2,
                  textAlign: 'center',
                }}
              />
            </Grid>
          )}

          {/* Input Field */}
          <Grid item xs={12} sm={6}>
            <form onSubmit={handleSubmit} style={{ width: '100%', backgroundColor: '#fff', boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)' }}>
              <TextField
                fullWidth
                placeholder="What can I help you with..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  handleInputFocusOrChange(); // Ensure elements disappear when typing
                }}
                onFocus={handleInputFocusOrChange}
                inputProps={{ maxLength: 400 }}
                InputProps={{
                  sx: {
                    '& .MuiInputBase-input': {
                      padding: '12px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: themeColor,
                    },
                    '& .MuiInputAdornment-root button': {
                      color: themeColor,
                    },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit">
                        <FaTelegramPlane className="h-6 w-6" color={themeColor} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default UserChat;
