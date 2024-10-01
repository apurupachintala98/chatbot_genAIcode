import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { Sidebar, Navbar, Avatar, Dropdown, Button } from 'flowbite-react';
import { HiSearch, HiOutlinePencilAlt } from "react-icons/hi";
import "./Dashboard.css";
import elevance from '../assets/images/logo.png';
import UserChat from './UserChat';


function Dashboard() {

 // Lift the states up from UserChat
 const [chatLog, setChatLog] = useState([]); // Chat log state
 const [isVisible, setIsVisible] = useState(true); // Show/hide welcome message
 const [responseReceived, setResponseReceived] = useState(false); // Hide helpfulness prompt
 const [error, setError] = useState(''); // Error message state
 const [showPrompts, setShowPrompts] = useState(true); // Show/hide suggested prompts
 const [routeCdUpdated, setRouteCdUpdated] = useState(false); // Track route update

 const handleNewChat = () => {
   setChatLog([]); // Reset chat log with default message
   setIsVisible(true); // Show the image and text again
   setResponseReceived(false); // Hide the helpfulness prompt
   setError(''); // Clear any existing error message
   setShowPrompts(true);
      setRouteCdUpdated(false); // Reset route update status
 };


  return (
    <div className="flex flex-col md:flex-row h-screen main-content">
      {/* Sidebar */}
      <Sidebar className="fixed min-w-fit top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 md:w-40 h-full pt-4 font-normal sidebar">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Button size="xl" onClick={handleNewChat} className="newChat-btn fw-bold">
              New Chat
              <HiOutlinePencilAlt className="ml-2 h-5 w-5" />
            </Button>
          </Sidebar.ItemGroup>

        </Sidebar.Items>
      </Sidebar>
      {/* Navbar */}
      <Navbar fluid={true} rounded={true} className="fixed z-30 w-full dark:border-gray-700 navbarfixed md:relative">
        <Navbar.Toggle />
        <a href="/" class="p-2 logo">
          <img src={elevance} alt="Elevance Health Logo" width={100} height={60} />
        </a>
        <p className="d-flex p-2 ml-3 mb-0 align-items-center justify-content-center chat-assist text-center md:text-left">EDA ARB Scheduler Assistant</p>
        {/* <div className="p-2 mr-2 header-searchbar">
          <TextInput type="search" placeholder="Search" icon={HiSearch} className="hidden md:block" />
        </div> */}
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
      <div className="flex-grow start-chatbot-fullscreen p-4 md:p-6 d-flex justify-content-between">
      <UserChat
          chatLog={chatLog}
          setChatLog={setChatLog}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          responseReceived={responseReceived}
          setResponseReceived={setResponseReceived}
          error={error}
          setError={setError}
          showPrompts={showPrompts}
          setShowPrompts={setShowPrompts}
          routeCdUpdated={routeCdUpdated}
          setRouteCdUpdated={setRouteCdUpdated}
        />
      </div>
    </div>
  );
}

export default Dashboard;