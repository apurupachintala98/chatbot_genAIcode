import React, { useState, useLayoutEffect, useRef } from 'react';
import { Sidebar, Navbar, TextInput, Avatar, Dropdown, Button } from 'flowbite-react';
import { HiSearch, HiOutlinePencilAlt } from "react-icons/hi";
import "./Dashboard.css";
import elevance from '../assets/images/logo.png';
import chatbot from '../assets/images/chatbot.jpg';
import user from '../assets/images/user.png';
import Feedback from "../components/Feedback";


function Dashboard() {
  const [input, setInput] = useState(''); // User input
  const [chatLog, setChatLog] = useState([
  ]);
  const endOfMessagesRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true); // State to control visibility for default chat image and text
  const [responseReceived, setResponseReceived] = useState(false); // feedback response icons
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading indicator
  const [routeCd, setRouteCd] = useState('None'); // Route code for API

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
    const newMessage = {
      role: 'user',
      content: input,
    };
    const newChatLog = [...chatLog, newMessage]; // Add user's message to chat log
    setChatLog(newChatLog);
    setInput(''); // Clear the input field
    setIsLoading(true); // Set loading state to true
    setError(''); // Clear any previous error

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
      const botMessage = {
        role: 'assistant',
        content: data.modelreply,
      };

      // Update route_cd if provided in the response
      if (data.route_cd) {
        setRouteCd(data.route_cd);
      }

      // Add bot's response to chat log
      setChatLog([...newChatLog, botMessage]);
    } catch (err) {
      setError('Error communicating with backend');
      console.error(err);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  }

  const handleNewChat = () => {
    setChatLog([
    ]); // Reset chat log with default message
    setIsVisible(true); // Show the image and text again
    setResponseReceived(false); // Hide the helpfulness prompt
    setError(''); // Clear any existing error message
    setRouteCd('None'); // Reset route_cd to None
    setIsLoading(false);
  };

  // Handle key press event for disappearing the default chat bot message on user click
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setIsVisible(false); // Hide image and text on Enter
      simulateChatbotResponse(); // Simulate receiving a response from the chatbot

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
  return (
    <div className="flex h-screen main-content">
      {/* Sidebar */}
      <Sidebar className="fixed min-w-fit top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-4 font-normal sidebar">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Button gradientDuoTone="greenToBlue" size="xl" onClick={handleNewChat} className="newChat-btn fw-bold">
              New Chat
              <HiOutlinePencilAlt className="ml-2 h-5 w-5" />
            </Button>
          </Sidebar.ItemGroup>

        </Sidebar.Items>
      </Sidebar>
      {/* Navbar */}
      <Navbar fluid={true} rounded={true} className="fixed z-30 w-full dark:border-gray-700 navbarfixed">
        <Navbar.Toggle />
        <a href="/" class="p-2 logo">
          <img src={elevance} alt="Elevance Health Logo" width={100} height={60} />
        </a>
        <p className="d-flex p-2 ml-3 mb-0 flex-fill align-items-center chat-assist">EDA ARB Scheduler</p>
        <div className="p-2 mr-2 header-searchbar">
          <TextInput type="search" placeholder="Search" icon={HiSearch} className="hidden md:block" />
        </div>
        <Dropdown
          label={<Avatar placeholderInitials="AC" rounded />}
          arrowIcon={false}
          inline
        >
          <Dropdown.Header>
            <span className="block text-sm">Apurupa</span>
            <span className="block truncate text-sm font-medium">example@ibm.com</span>
          </Dropdown.Header>
          <Dropdown.Item href="/">Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </Navbar>

      {/* Content Area */}
      <div className="start-chatbot-fullscreen">
        <div className='chat-container'>
          {isVisible && (
            <div className="center-container">
              <Avatar img={chatbot} altText="Chatbot" rounded></Avatar>
              <p className="center-text">Hello there, I am your assistant. How can I help you today? </p>
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

      </div>

      {/* Input section */}
      <div className="blanter-msg">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="chat-input"
            class="form-control"
            placeholder="What can I help you with..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress} // Listen for Enter key press
            maxLength="400"
          />

          <button class="sendBtn" > <svg class="w-8 h-6 ml-2" aria-hidden="true" fill="#ffffff" viewBox="0 0 448 448">
            <path d="M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z" onClick={handleSubmit} />
          </svg></button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
