import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  Drawer,
  Box,
  Button as MuiButton,
  useMediaQuery,
  Button,
} from "@mui/material";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { SketchPicker } from "react-color"; // Import color picker
import { createTheme, ThemeProvider } from "@mui/material/styles"; // For dynamic theme changes
import elevance from "../assets/images/logo.png"; // Replace with your actual path
import UserChat from './UserChat';
import color from "../assets/images/color.png";
import { v4 as uuidv4 } from 'uuid';

const drawerWidth = 180;

const Dashboard = () => {
  const isMobile = useMediaQuery("(max-width:950px)");
  // Lift the states up from UserChat
  const [chatLog, setChatLog] = useState([]); // Chat log state
  const [responseReceived, setResponseReceived] = useState(false); // Hide helpfulness prompt
  const [error, setError] = useState(''); // Error message state
  const [routeCdUpdated, setRouteCdUpdated] = useState(false); // Track route update
  const [uploadStatus, setUploadStatus] = useState(''); // Track file upload status
  const [routeCd, setRouteCd] = useState('None');
  const [isLoading, setIsLoading] = useState(false); // Loading indicator
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const [fileUploadCondition, setFileUploadCondition] = useState(false); // Toggle for file upload option
  const [categoryLoading, setCategoryLoading] = useState(false); // New loading state for category click
  const [themeColor, setThemeColor] = useState("#1a3673"); // Default theme color
  const [showPicker, setShowPicker] = useState(false); // State to manage picker visibility
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [requestId, setRequestId] = useState(uuidv4());
   // New state to control visibility of the initial view (avatar, prompts, categories)
   const [showInitialView, setShowInitialView] = useState(true);

  // Function to handle color change
  const handleColorChange = (color) => {
    setThemeColor(color.hex); // Update the theme color state
  };

  const togglePicker = () => {
    setShowPicker((prev) => !prev); // Toggle visibility on button click
  };

   // Handle New Chat button click
   const handleNewChat = () => {
    setChatLog([]); // Reset chat log
    setResponseReceived(false);
    setError('');
    setRouteCdUpdated(false);
    setUploadStatus(false);
    setRouteCd('None');
    setIsLoading(false);
    setSuccessMessage('');
    setFileUploadCondition(false);
    setCategoryLoading(false);
    setSelectedCategory(null);
    setShowInitialView(true); // Show avatar, categories, etc.
    setRequestId(uuidv4()); 
  };

  // Define the theme dynamically based on selected color
  const theme = createTheme({
    palette: {
      primary: {
        main: themeColor,
      },
      background: {
        default: themeColor,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: '100vh', flexDirection: 'column', overflow: 'hidden' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: themeColor,
            boxShadow: "-1px -4px 14px #000",
            height: '64px',
          }}
        >
          <Toolbar sx={{ justifyContent: isMobile ? "space-between" : "flex-start" }}>
            <Box
              component="img"
              sx={{
                height: isMobile ? 40 : 50,
                marginRight: 2,
              }}
              src={elevance}
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
                fontSize: isMobile ? "1rem" : "1.5rem",
                marginLeft: '-90px'
              }}
            >
              EDA ARB Scheduler Assistant
            </Typography>
          </Toolbar>
        </AppBar>

        {!isMobile && (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
                backgroundColor: "#fff",
                boxShadow: '-1px -3px 10px grey',
              },
            }}
          >
            <Toolbar />
            <Box sx={{ position: "relative", height: "100%", padding: 2, textAlign: 'center' }}>
              {/* <Button
                variant="contained"
                onClick={togglePicker}
                startIcon={<img src={color} alt="icon" style={{ width: '15px', height: '15px' }} />}
                sx={{
                  marginBottom: '10px',
                  '&:hover': {
                    backgroundColor: '#1769aa', // Hover color
                  },
                }}
              >
                Color
              </Button>
              {showPicker && (
                <Box sx={{ margin: '0 auto' }}>
                  <SketchPicker color={themeColor} onChangeComplete={handleColorChange}
                    styles={{
                      default: {
                        picker: {
                          width: '125px',
                        },
                      },
                    }}
                  />
                </Box>
              )} */}
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
                  backgroundColor: themeColor,
                }}
                startIcon={<HiOutlinePencilAlt />}
                onClick={handleNewChat}
              >
                New Chat
              </MuiButton>
            </Box>
          </Drawer>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#fff",
            p: 3,
            height: "100vh",
            overflow: "hidden",
            paddingTop: '64px',
          }}
        >
          <Toolbar />

          {isMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 2,
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

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: '100%' }}>
            <UserChat
              chatLog={chatLog}
              setChatLog={setChatLog}
              responseReceived={responseReceived}
              setResponseReceived={setResponseReceived}
              error={error}
              setError={setError}
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
              themeColor={themeColor}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showInitialView={showInitialView} 
              setShowInitialView={setShowInitialView} 
              requestId={requestId}
              setRequestId={setRequestId}  
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
