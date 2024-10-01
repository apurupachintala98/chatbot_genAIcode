import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { Sidebar, Navbar, TextInput, Avatar, Dropdown, Button, Card, Modal } from 'flowbite-react';
import { HiSearch, HiOutlinePencilAlt, HiUpload } from "react-icons/hi";
import { FaTelegramPlane } from 'react-icons/fa';
import "./Dashboard.css";
import elevance from '../assets/images/logo.png';
import chatbot from '../assets/images/chatbot.jpg';
import user from '../assets/images/user.png';
import Feedback from "../components/Feedback";
import SuggestedPrompts from '../components/SuggestedPrompts';
import parseMessageContent from '../components/parseMessageContent';
import faq from '../assets/images/FAQ.jpg';
import query from '../assets/images/Query.png';
import scheduler from '../assets/images/scheduler.jpg';

function UserChat() {
  const [input, setInput] = useState(''); // User input
  const [chatLog, setChatLog] = useState([]);
  const endOfMessagesRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true); // State to control visibility for default chat image and text
  const [responseReceived, setResponseReceived] = useState(false); // feedback response icons
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading indicator
  const [routeCd, setRouteCd] = useState('None'); // Route code for API
  const [routeCdUpdated, setRouteCdUpdated] = useState(false);

  // New states for file upload functionality
  const [fileUploadCondition, setFileUploadCondition] = useState(false); // Toggle for file upload option
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file
  const [uploadStatus, setUploadStatus] = useState(''); // Track file upload status
  const [apiResponse, setApiResponse] = useState(null); // New state for storing API response



  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "I want to schedule an ARB meeting",
    "What is the status of my ARB review?",
    "Guide me on the TGOV process?",
    "Guide me on Snowflake Onboarding process",
  ]);
  const [filteredPrompts, setFilteredPrompts] = useState([]); // Filtered prompts
  const [showPrompts, setShowPrompts] = useState(false); // To toggle the suggestion display

  // New states for user-provided app_cd and request_id
  const [appCd, setAppCd] = useState('user'); // User input for app_cd
  const [requestId, setRequestId] = useState('8000'); // User input for request_id

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setInput(userInput);

    // Filter prompts based on user input
    if (userInput) {
      const filtered = suggestedPrompts.filter(prompt =>
        prompt.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredPrompts(filtered);
      setShowPrompts(true); // Show suggestions when input is typed
    } else {
      setFilteredPrompts([]);
      setShowPrompts(false); // Hide suggestions when input is cleared
    }
  };

  // Handle clicking on a suggested prompt
  const handlePromptClick = (prompt) => {
    setInput(prompt); // Autofill the input field with the clicked suggestion
    setShowPrompts(false); // Hide the suggestions list after a selection
  };

  // Handle file selection
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

    // Handle clicking on a category icon and updating routeCd
    const handleCategoryClick = (categoryRouteCd) => {
      setRouteCd(categoryRouteCd); // Update the route_cd based on the clicked category
      setIsVisible(false); // Hide the welcome message and categories after clicking
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
    formData.append('app_info', JSON.stringify(apiResponse.app_info));
    formData.append('file', selectedFile); // Add the selected file

    try {
      const response = await fetch('http://10.126.192.122:8000/upload_file/?app_cd=user&request_id=8000&route_cd=arb_scheduler', {
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
      setApiResponse(data); // Store the PUT API response in the state

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

  return (

    <div className='chat-container'>
      {isVisible && (
      <><div className="center-container">
          <Avatar img={chatbot} altText="Chatbot" rounded></Avatar>
          <p className="center-text">Hello there, I am your ARB Scheduler Assistant. How can I help you today? </p>
        </div><div className="text-center space-y-6">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Choose a ARB Category
            </h3>
            <div className="flex justify-center gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-6">
                   {/* ARB Scheduler Category */}
                   <div className="flex flex-col items-center" onClick={() => handleCategoryClick('arb_scheduler')}>
                    <Avatar img={scheduler} rounded bordered color="gray" size="lg" />
                    <p className="mt-2 text-center text-gray-700 dark:text-gray-300">ARB Scheduler</p>
                  </div>

                  {/* ARB FAQ Category */}
                  <div className="flex flex-col items-center" onClick={() => handleCategoryClick('arb_faq')}>
                    <Avatar img={faq} rounded bordered color="light" size="lg" />
                    <p className="mt-2 text-center text-gray-700 dark:text-gray-300">ARB FAQ</p>
                  </div>

                  {/* ARB Query Category */}
                  <div className="flex flex-col items-center" onClick={() => handleCategoryClick('arb_query')}>
                    <Avatar img={query} rounded bordered color="purple" size="lg" />
                    <p className="mt-2 text-center text-gray-700 dark:text-gray-300">ARB Query</p>
                  </div>
                </div>
              </div>
            </div>
          </div></> 
     )}
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
                          {/* Parse and render the assistant's message */}
                          {parseMessageContent(chat.content)}
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
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.pptx"  // Allow only PDF and PPTX files
          />
          {/* <button type="submit" className="upload-button">Upload</button> */}
          <button type="submit" className="upload-button">
            <HiUpload className="inline-block mr-2" /> {/* Upload Icon */}
            Upload
          </button>
        </form>
        {uploadStatus && <div className="upload-status d-flex justify-content-center mt-3">{uploadStatus}</div>}
        {/* Input section */}
        <div className="blanter-msg p-4 md:p-6">
          {/* Display Suggested Prompts */}
          {/* {showPrompts && filteredPrompts.length > 0 && (
          <ul className="suggested-prompts-list">
            {filteredPrompts.map((prompt, index) => (
              <li key={index} onClick={() => handlePromptClick(prompt)} className="suggested-prompt-item">
                {prompt}
              </li>
            ))}
          </ul>
        )} */}
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              id="chat-input"
              class="form-control"
              placeholder="What can I help you with..."
              value={input}
              // onChange={(e) => setInput(e.target.value)}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              maxLength="400"
            />

            {/* <button class="sendBtn" type="submit"> <svg class="w-8 h-6 ml-2" aria-hidden="true" fill="#1a3673" viewBox="0 0 448 448">
            <path d="M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z" onClick={handleSubmit} />
          </svg></button> */}
            <button class="sendBtn" type="submit" onClick={handleSubmit}> <FaTelegramPlane className="h-7 w-7 text-cyan-600 dark:text-cyan-500" color="#1a3673" />
            </button>
          </form>

        </div>
      </div>
    </div>

  );
}

export default UserChat;