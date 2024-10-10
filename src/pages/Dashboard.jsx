// import React, { useState } from 'react';
// import { Sidebar, Navbar, Button } from 'flowbite-react';
// import { HiSearch, HiOutlinePencilAlt } from "react-icons/hi";
// import "./Dashboard.css";
// import elevance from '../assets/images/logo.png';
// import UserChat from './UserChat';
// // import UserX from './UserX';

// function Dashboard() {

  // // Lift the states up from UserChat
  // const [chatLog, setChatLog] = useState([]); // Chat log state
  // const [isVisible, setIsVisible] = useState(true); // Show/hide welcome message
  // const [responseReceived, setResponseReceived] = useState(false); // Hide helpfulness prompt
  // const [error, setError] = useState(''); // Error message state
  // const [showPrompts, setShowPrompts] = useState(true); // Show/hide suggested prompts
  // const [routeCdUpdated, setRouteCdUpdated] = useState(false); // Track route update
  // const [uploadStatus, setUploadStatus] = useState(''); // Track file upload status
  // const [routeCd, setRouteCd] = useState('None');
  // const [isLoading, setIsLoading] = useState(false); // Loading indicator
  // const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  // const [fileUploadCondition, setFileUploadCondition] = useState(false); // Toggle for file upload option




  // const handleNewChat = () => {
  //   setChatLog([]); // Reset chat log with default message
  //   setIsVisible(true); // Show the image and text again
  //   setResponseReceived(false); // Hide the helpfulness prompt
  //   setError(''); // Clear any existing error message
  //   setShowPrompts(true);
  //   setRouteCdUpdated(false); // Reset route update status
  //   setUploadStatus(false);
  //   setRouteCd('None');
  //   setIsLoading(false);
  //   setSuccessMessage('');
  //   setFileUploadCondition(false);
  // };


//   return (
//     <div className="flex flex-col md:flex-row h-screen main-content">
//       {/* Sidebar */}
//       <Sidebar className="fixed min-w-fit top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 md:w-40 h-full pt-4 font-normal sidebar">
//         <Sidebar.Items>
//           <Sidebar.ItemGroup>
//             <Button size="xl" onClick={handleNewChat} className="newChat-btn fw-bold">
//               New Chat
//               <HiOutlinePencilAlt className="ml-2 h-5 w-5" />
//             </Button>
//           </Sidebar.ItemGroup>
//         </Sidebar.Items>
//       </Sidebar>
//       {/* Navbar */}
//       <Navbar fluid={true} rounded={true} className="fixed z-30 w-full dark:border-gray-700 navbarfixed md:relative">
//         <Navbar.Toggle />
//         <a href="/" class="p-2 logo">
//           <img src={elevance} alt="Elevance Health Logo" width={100} height={60} />
//         </a>
//         <p className="d-flex p-2 ml-3 mb-0 align-items-center justify-content-center chat-assist text-center md:text-left">EDA ARB Scheduler Assistant</p>
//         <div></div>
//       </Navbar>

//       {/* Content Area */}
//       <div className="flex-grow start-chatbot-fullscreen p-4 md:p-6 d-flex justify-content-between">
        // <UserChat
        //   chatLog={chatLog}
        //   setChatLog={setChatLog}
        //   isVisible={isVisible}
        //   setIsVisible={setIsVisible}
        //   responseReceived={responseReceived}
        //   setResponseReceived={setResponseReceived}
        //   error={error}
        //   setError={setError}
        //   showPrompts={showPrompts}
        //   setShowPrompts={setShowPrompts}
        //   routeCdUpdated={routeCdUpdated}
        //   setRouteCdUpdated={setRouteCdUpdated}
        //   uploadStatus={uploadStatus}
        //   setUploadStatus={setUploadStatus}
        //   routeCd={routeCd}
        //   setRouteCd={setRouteCd}
        //   isLoading={isLoading}
        //   setIsLoading={setIsLoading}
        //   successMessage={successMessage}
        //   setSuccessMessage={setSuccessMessage}
        //   fileUploadCondition={fileUploadCondition}
        //   setFileUploadCondition={setFileUploadCondition}
        // />
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button as MuiButton,
  useMediaQuery,
} from "@mui/material";
import { HiOutlinePencilAlt } from "react-icons/hi";
import elevance from "../assets/images/logo.png"; // Replace with your actual path
import UserChat from './UserChat';

const drawerWidth = 180;

const Dashboard = () => {
  // Media query to detect if the screen size is mobile or desktop
  const isMobile = useMediaQuery("(max-width:600px)");
   // Lift the states up from UserChat
   const [chatLog, setChatLog] = useState([]); // Chat log state
   const [isVisible, setIsVisible] = useState(true); // Show/hide welcome message
   const [responseReceived, setResponseReceived] = useState(false); // Hide helpfulness prompt
   const [error, setError] = useState(''); // Error message state
   const [showPrompts, setShowPrompts] = useState(true); // Show/hide suggested prompts
   const [routeCdUpdated, setRouteCdUpdated] = useState(false); // Track route update
   const [uploadStatus, setUploadStatus] = useState(''); // Track file upload status
   const [routeCd, setRouteCd] = useState('None');
   const [isLoading, setIsLoading] = useState(false); // Loading indicator
   const [successMessage, setSuccessMessage] = useState(''); // New state for success message
   const [fileUploadCondition, setFileUploadCondition] = useState(false); // Toggle for file upload option
   const [categoryLoading, setCategoryLoading] = useState(false); // New loading state for category click


  const handleNewChat = () => {
    setChatLog([]); // Reset chat log with default message
    setIsVisible(true); // Show the image and text again
    setResponseReceived(false); // Hide the helpfulness prompt
    setError(''); // Clear any existing error message
    setShowPrompts(true);
    setRouteCdUpdated(false); // Reset route update status
    setUploadStatus(false);
    setRouteCd('None');
    setIsLoading(false);
    setSuccessMessage('');
    setFileUploadCondition(false);
    setCategoryLoading(false);
  };
  return (
    <Box sx={{ display: "flex", height: '100vh', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Sticky Navbar */}
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#1a3673",
          boxShadow: "-1px -4px 14px #000",
        }}
      >
        <Toolbar sx={{ justifyContent: isMobile ? "space-between" : "flex-start" }}>
          {/* Left Logo */}
          <Box
            component="img"
            sx={{
              height: isMobile ? 40 : 50, // Adjust logo size based on screen size
              marginRight: 2,
            }}
            src={elevance} // Replace this with your logo path
            alt="Elevance Health Logo"
          />

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontWeight: "bold",
              fontSize: isMobile ? "1rem" : "1.5rem", // Adjust font size based on screen size
            }}
          >
            EDA ARB Scheduler Assistant
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar for Desktop View */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", backgroundColor: "#fff", boxShadow: '-1px -3px 10px grey' },
          }}
        >
          <Toolbar />
          <Box sx={{  position: "relative", height: "100%" }}>

            {/* New Chat Button placed at the bottom */}
            <MuiButton
              variant="contained"
              size="large"
              sx={{
                position: "absolute",
                bottom: 16,
                width: "90%",
                left: "50%",
                transform: "translateX(-50%)",
                fontWeight: "bold",
                backgroundColor: "#1a3673",
              }}
              startIcon={<HiOutlinePencilAlt />}
              onClick={handleNewChat}
            >
              New Chat
            </MuiButton>
          </Box>
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Toolbar />

        {/* New Chat Button for Mobile View - Placed at the top of the content area */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 2, // Add some space after the button
            }}
          >
            <MuiButton
              variant="contained"
              size="large"
              sx={{ fontWeight: "bold" }}
              startIcon={<HiOutlinePencilAlt />}
              onClick={handleNewChat}
            >
              New Chat
            </MuiButton>
          </Box>
        )}

       <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            paddingTop: '150px' // Take up full height minus the AppBar height
          }}
        >
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
          uploadStatus={uploadStatus}
          setUploadStatus={setUploadStatus}
          routeCd={routeCd}
          setRouteCd={setRouteCd}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
          fileUploadCondition={fileUploadCondition}
          setFileUploadCondition={setFileUploadCondition}
          categoryLoading={categoryLoading}
          setCategoryLoading={setCategoryLoading}
        />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
