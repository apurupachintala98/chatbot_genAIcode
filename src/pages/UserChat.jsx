import React, { useState, useLayoutEffect, useRef } from 'react';
import { Sidebar, Navbar, TextInput, Avatar, Dropdown, Button, Card, Modal } from 'flowbite-react';
import { HiSearch, HiOutlinePencilAlt } from "react-icons/hi";
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


  const suggestedPrompts = [
    "I want to schedule a ARB meeting",
    "What is the status of my ARB review?",
    "Guide me on the TGOV process?",
    "Guide me on snowflake Onboarding process"
  ];

  // New states for user-provided app_cd and request_id
  const [appCd, setAppCd] = useState('user'); // User input for app_cd
  const [requestId, setRequestId] = useState('8000'); // User input for request_id

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return; // Prevent empty messages
    if (!appCd.trim() || !requestId.trim()) {
      setError('Please provide valid app_cd and request_id.');
      return;
    }

     // Ensure chat starts only if "ARB New User" is clicked
  if (!isNewUser) {
    setError('Please click the ARB New User button to start the chat.');
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

  const getWidth = (length) => {
    const baseWidth = 10; // Minimum width
    const scaleFactor = 5; // Each character adds to the width
    const calculatedWidth = baseWidth + length * scaleFactor;
    return calculatedWidth > 100 ? 100 : calculatedWidth;
  };

  //   const handlePromptClick = (prompt) => {
  //     setInput(prompt);
  //     setChatLog(prompt);
  //     setShowPrompts(false); // Hide prompts when a prompt is clicked
  // };



  return (
    <div className="flex flex-col md:flex-row h-screen main-content">
      {/* Content Area */}
      <div className="flex-grow start-chatbot-fullscreen p-4 md:p-6 d-flex justify-content-between">
        <div className='chat-container'>
          {isVisible && (
            <div className="center-container">
              <Avatar img={chatbot} altText="Chatbot" rounded></Avatar>
              <p className="center-text">Hello there, I am your ARB Scheduler Assistant. How can I help you today? </p>
            </div>
          )}
          
          {chatLog.map((chat, index) => (
            <div key={index} style={{
              backgroundColor: 'lightblue',
              width: `${getWidth(chat.length)}%`,
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
        </div>
        {/* {error && <p className="error-message">{error}</p>} */}
        {/* <SuggestedPrompts prompts={suggestedPrompts} onPromptClick={handlePromptClick} /> */}
        {showPrompts && (
          <SuggestedPrompts prompts={suggestedPrompts} />
        )}

      </div>
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

          <button class="sendBtn" type="submit"> <svg class="w-8 h-6 ml-2" aria-hidden="true" fill="#ffffff" viewBox="0 0 448 448">
            <path d="M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z" onClick={handleSubmit} />
          </svg></button>
          {/* <FaTelegramPlane className="h-5 w-5 text-cyan-600 dark:text-cyan-500" /> */}
        </form>
      </div>
    </div>
  );
}

export default UserChat;