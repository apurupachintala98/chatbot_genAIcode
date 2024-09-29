import React, { useState, useLayoutEffect, useRef } from 'react';
import { Sidebar, Navbar, TextInput, Avatar, Dropdown, Button, Card, Modal } from 'flowbite-react';
import { HiSearch, HiOutlinePencilAlt } from "react-icons/hi";
import "./Dashboard.css";
import elevance from '../assets/images/logo.png';
import chatbot from '../assets/images/chatbot.jpg';
import user from '../assets/images/user.png';
import UserChat from './UserChat';

function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false); // Track if ARB New User button is clicked

  const handleNewChat = () => {
    setIsNewUser(false); // Reset new user flag
  };

  const getWidth = (length) => {
    const baseWidth = 10; // Minimum width
    const scaleFactor = 5; // Each character adds to the width
    const calculatedWidth = baseWidth + length * scaleFactor;
    return calculatedWidth > 100 ? 100 : calculatedWidth;
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
      {isNewUser ? (
          <UserChat />
        ) : (
        <div className='chat-container'>
          {/* {isVisible && ( */}
            <div className="center-container">
              <Avatar img={chatbot} altText="Chatbot" rounded></Avatar>
              <p className="center-text">Hello there, I am your ARB Scheduler Assistant. How can I help you today? </p>
            </div>
          {/* )} */}
          <Card className="max-w-sm mx-auto md:max-w-md choose-option" >
            <div className='lg-text p-0'>
              <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white card-heading">
                Select a Category
              </h5>
              {/* <button class="category-icon">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
</svg>
            </button>
            */}
            </div>
            <div className='category-btn mt-5'>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900 mb-3" onClick={() => setOpenModal(true)}
              >
                ARB Existing User
              </button>

              <button
                type="button"
                className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                onClick={() => {
                  setIsNewUser(true);  // Set to true when clicked
                  // setShowPrompts(false); // Optionally hide prompts
                }}>
                ARB New User
              </button>
            </div>
          </Card>
        
          <Modal show={openModal} size="2xl" onClose={() => setOpenModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center space-y-6">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Choose a ARB Category
                </h3>
                <div className="flex justify-center gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-6">
                      <Avatar img="/images/people/profile-picture-5.jpg" rounded bordered color="gray" size="lg" />
                      <Avatar img="/images/people/profile-picture-5.jpg" rounded bordered color="light" size="lg" />
                      <Avatar img="/images/people/profile-picture-5.jpg" rounded bordered color="purple" size="lg" />
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          
          {/* //userchat */}
       
        </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;