import React, { useState, useLayoutEffect, useRef } from 'react';
import { Sidebar, Navbar, TextInput, Avatar, Dropdown, Button, Card, Modal } from 'flowbite-react';
import { HiSearch, HiOutlinePencilAlt } from "react-icons/hi";
import { FaTelegramPlane } from 'react-icons/fa';
import "./Dashboard.css";
import elevance from '../assets/images/logo.png';
import chatbot from '../assets/images/chatbot.jpg';
import user from '../assets/images/user.png';
import Feedback from "../components/Feedback";
import SuggestedPrompts from '../components/SuggestedPrompts';

function UserChat() {
  const [input, setInput] = useState(''); // User input
  const [chatLog, setChatLog] = useState([]);
  const endOfMessagesRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true); // State to control visibility for default chat image and text
  const [responseReceived, setResponseReceived] = useState(false); // feedback response icons
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading indicator
  const [routeCd, setRouteCd] = useState('None'); // Route code for API
  const [showPrompts, setShowPrompts] = useState(true);
  const [routeCdUpdated, setRouteCdUpdated] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false); // Track if ARB New User button is clicked

  // New states for file upload functionality
  const [fileUploadCondition, setFileUploadCondition] = useState(false); // Toggle for file upload option
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file
  const [uploadStatus, setUploadStatus] = useState(''); // Track file upload status



  const suggestedPrompts = [
    "I want to schedule a ARB meeting",
    "What is the status of my ARB review?",
    "Guide me on the TGOV process?",
    "Guide me on snowflake Onboarding process"
  ];

  // New states for user-provided app_cd and request_id
  const [appCd, setAppCd] = useState('user'); // User input for app_cd
  const [requestId, setRequestId] = useState('8000'); // User input for request_id

   // Handle file selection
   const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // // Handle file upload
  // const handleFileUpload = async (e) => {
  //   e.preventDefault();

  //   if (!selectedFile) {
  //     setError('Please select a file to upload.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', selectedFile);

  //   try {
  //     const response = await fetch('your-api-url-to-upload-file', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error('File upload failed');
  //     }

  //     const fileData = await response.json();

  //     // Add file as a message in the chat log
  //     const newMessage = {
  //       role: 'user',
  //       content: `File uploaded: ${fileData.fileName}`, // You can adjust how to display the file
  //       fileUrl: fileData.fileUrl, // Use the file URL for showing file
  //     };

  //     setChatLog([...chatLog, newMessage]);
  //     setSelectedFile(null); // Clear the selected file
  //   } catch (err) {
  //     setError('Error uploading file');
  //   }
  // };


  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://your-backend-url/upload', {
        method: 'POST',
        body: formData, // FormData object
      });

      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
      } else {
        setUploadStatus('File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('An error occurred while uploading the file.');
    }
  };


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
 
      const data = await response.json();
 
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

  // chat Scroll to the bottom when a new message is added
  useLayoutEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  //   const handlePromptClick = (prompt) => {
  //     setInput(prompt);
  //     setChatLog(prompt);
  //     setShowPrompts(false); // Hide prompts when a prompt is clicked
  // };

  return (
    <div className='user-chat-container'>
      {chatLog.map((chat, index) => (
        <div key={index} style={{
          backgroundColor: 'lightblue',
          padding: '10px',
          transition: 'width 0.3s ease',
          overflowY: 'auto'
        }} className={`chat_message ${chat.role === 'assistant' ? 'ai' : ''}`}>
          <div className='chat_message_center'>
            <div className='avatar'>
              <div className={`flex ${chat.role === 'assistant' ? 'justify-start' : 'justify-end'} mb-4`}>
                {chat.role !== 'assistant' && (
                  <div class="container">
                    <div class="info">
                      <div className='message'>
                        {chat.content}
                        {chat.fileUrl && (
                          <div>
                            <a href={chat.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
                          </div>
                        )}
                      </div>
            
                    </div>
    
                    <div class="image">
                      <Avatar img={user} altText="User" className='mb-0' rounded></Avatar>
                    </div>
                  </div>
                )}
                {chat.role === 'assistant' && (
                  <div class="container">
                    <div class="image">
                      <Avatar img={chatbot} altText="Chatbot" rounded></Avatar>
                    </div>
                    <div class="info">
                      <div className='message'>
                        {chat.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))} 

      {/* Loader section */}
      {isLoading && <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>}

      {/* Feedback icons */}
      {responseReceived && (
        <Feedback />
      )}
      {/* This empty div is to ensure scrolling to the last message */}
      <div ref={endOfMessagesRef} />
      {/* {showPrompts && (
        <SuggestedPrompts prompts={suggestedPrompts} />
      )} */}
                                                                       {/* File Upload Section */}
       {/* {fileUploadCondition && (
        <form onSubmit={handleFileUpload} className="file-upload-form">
          <input type="file" onChange={handleFileChange} />
          <button type="submit" className="upload-button">Upload</button>
        </form>
      )} */}
       <form onSubmit={handleFileUpload} className="file-upload-form">
          <input type="file" onChange={handleFileChange} />
          <button type="submit" className="upload-button">Upload</button>
        </form>
      {/* Input section */}
      <div className="blanter-msg p-4 md:p-6">

        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            id="chat-input"
            class="form-control"
            placeholder="What can I help you with..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength="400"
          />

          {/* <button class="sendBtn" type="submit"> <svg class="w-8 h-6 ml-2" aria-hidden="true" fill="#1a3673" viewBox="0 0 448 448">
            <path d="M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z" onClick={handleSubmit} />
          </svg></button> */}
           <button class="sendBtn" type="submit" onClick={handleSubmit}> <FaTelegramPlane className="h-7 w-7 text-cyan-600 dark:text-cyan-500" color="#1a3673"/> 
           </button>
        </form>
      </div>
    </div>
  );
}

export default UserChat;