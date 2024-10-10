import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Avatar, Alert } from 'flowbite-react';
import { FaTelegramPlane } from 'react-icons/fa';
import chatbot from '../assets/images/chatbot.png';
import HashLoader from 'react-spinners/HashLoader';
import SuggestedPrompts from '../components/SuggestedPrompts';
import Feedback from '../components/Feedback';
import Loader from '../components/Loader';
import parseMessageContent from '../components/parseMessageContent';
import ARBCategories from '../components/ARBCategories';
import FileUploader from '../components/FileUploader'; // A new reusable component for file upload
import ChatMessage from '../components/ChatMessage'; // A new reusable component for chat message
import { Box, Grid, TextField, Button, IconButton, Typography, InputAdornment } from '@mui/material'; // Import MUI components

function UserChat(props) {
  const {
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
    fileUploadCondition, setFileUploadCondition,
    setCategoryLoading, categoryLoading,
  } = props;

  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file
  const [apiResponse, setApiResponse] = useState(null); // New state for storing API response
  // New states for user-provided app_cd and request_id
  const [appCd, setAppCd] = useState('ARB_Bot'); // User input for app_cd
  const [requestId, setRequestId] = useState('8000'); // User input for request_id

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
      content: prompt, // Use the clicked prompt as the message content
    };

    const newChatLog = [...chatLog, newMessage]; // Add new user message to chat log
    setChatLog(newChatLog); // Update the chat log state
    setInput(''); // Clear the input field
    setIsLoading(true); // Set loading state to true
    setError(''); // Clear any previous error
    setShowPrompts(false); // Hide prompts
    setIsVisible(false);
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
    setIsVisible(false); // Hide the welcome message and categories after clicking
    setRouteCdUpdated(true);
    setShowPrompts(false);
    // setIsLoading(true); // Set loading state for the category click

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
    setShowPrompts(false);
    setIsVisible(false); // Hide image and text on Enter

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

        // if (fileUploadResponse.ok) {
        //   setUploadStatus('Dummy file uploaded successfully!');
        // } else {
        //   setUploadStatus('Dummy file upload failed.');
        // }
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
      setShowPrompts(false);
    }
  }

  // Handle key press event for disappearing the default chat bot message on user click
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setIsVisible(false); // Hide image and text on Enter
      simulateChatbotResponse(); // Simulate receiving a response from the chatbot
      setShowPrompts(false);
    }
  };

  // Simulate receiving a response from the chatbot
  const simulateChatbotResponse = () => {
    // Simulate a delay for receiving response
    setTimeout(() => {
      setResponseReceived(true); // Set the state to indicate response received
    }, 1000); // Simulated delay (1 second)
  };

  useEffect(() => {
    // Check if isVisible state changes unexpectedly
    console.log(isVisible);
  }, [isVisible]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
        padding: '10px', // Padding for layout
        boxSizing: 'border-box',
        overflow: 'hidden', // Disable page scroll
        width: '60%',
        marginTop: '50px'
      }}
    >
      {isVisible && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textAlign: 'center',
            // mb: 2,
            // height: '100%',
            // mt: 8
          }}
        >
          <Avatar img={chatbot} altText="Chatbot" rounded />

          {/* Apply the styles to the <p> tag */}
          <Box
            component="p"
            sx={{
              marginTop: '10px',
              fontSize: '16.5px',
              fontWeight: 600,
              color: '#1a3673',
            }}
          >
            Hello there, I am your ARB Scheduler Assistant. How can I help you today?
          </Box>
          {/* ARB Categories Component */}
          <ARBCategories
            handleCategoryClick={handleCategoryClick}
            selectedCategory={selectedCategory} // Pass selected category for styling
          />  </Box>
      )}
      <Box>
        {/* Show the loader when a category is clicked */}
        {categoryLoading && (
          <Box display="flex" justifyContent="center" mt={8}>
            <HashLoader color="#1a3673" size={30} aria-label="Loading Spinner" data-testid="loader" />
            <Typography variant="h6" sx={{ ml: 3, fontWeight: 'bold' }}>Generating the response</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginTop: '60px', width: '100%' }}>
        {/* Chat Log */}
        <ChatMessage chatLog={chatLog} parseMessageContent={parseMessageContent} />
        <div ref={endOfMessagesRef} />
      </Box>
      {successMessage && <Alert color="success">
          <span className="font-medium">{successMessage}</span>
        </Alert>}
      {/* Loader section */}
      {isLoading && <Loader />}

      {/* Feedback icons */}
      {responseReceived && <Feedback />}

      {/* This empty div is to ensure scrolling to the last message */}
      {/* <div ref={endOfMessagesRef} /> */}

      {showPrompts && (
        <Box
          sx={{
            position: 'absolute',
            marginBottom: '30px',
            bottom: '60px', // Just above the input field
            width: '100%', // Full width of the input
            maxWidth: '600px', // Limit for larger screens
            left: '51%',
            transform: 'translateX(-50%)', // Center align the prompts to match the input field
            zIndex: 1000,
            // overflowY: 'auto', // Ensure it stays on top of other elements
          }}
        >
          <SuggestedPrompts prompts={suggestedPrompts} onPromptClick={handlePromptClick} />
        </Box>
      )}
      {/* File Upload Section */}
      {fileUploadCondition && (
        <FileUploader
          handleFileUpload={handleFileUpload}
          uploadStatus={uploadStatus}
        />)}

      <Box
        sx={{
          position: 'absolute',
          bottom: '50px', // Aligns the input to the bottom of the container
          left: '51%',
          transform: 'translateX(-50%)', // Centers the input horizontally
          width: '100%', // Ensures it takes the full width of the container
          maxWidth: '600px', // Optional: limit the max width of the input field
          backgroundColor: 'white',
          boxShadow: '1.7px 1.4px 5.4px hsl(0deg 0% 0% / 0.2)', // Optional: set background color
        }}
      >
        <form onSubmit={handleSubmit} className="flex">
          <TextField
            fullWidth
            placeholder="What can I help you with..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            inputProps={{ maxLength: 400 }}
            InputProps={{
              sx: {
                '& .MuiInputBase-input': {
                  padding: '12px',
                  fontSize: '12.5px' // Custom padding for the input
                },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" onClick={handleSubmit}>
                    <FaTelegramPlane className="h-6 w-6" color="#1a3673" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Box>
    </Box>
  );
}

export default UserChat;
