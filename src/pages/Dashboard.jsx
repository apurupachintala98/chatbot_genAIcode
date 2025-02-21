// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   CssBaseline,
//   Typography,
//   Drawer,
//   Box,
//   Button as MuiButton,
//   useMediaQuery,
//   Modal,
//   IconButton
// } from "@mui/material";
// import { HiOutlinePencilAlt } from "react-icons/hi";
// import DescriptionIcon from '@mui/icons-material/Description';
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import elevance from "../assets/images/logo.png";
// import UserChat from './UserChat';
// import { v4 as uuidv4 } from 'uuid';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// const drawerWidth = 180;

// const Dashboard = () => {
//   const isMobile = useMediaQuery("(max-width:950px)");

//   const [chatLog, setChatLog] = useState([]);
//   const [responseReceived, setResponseReceived] = useState(false);
//   const [error, setError] = useState('');
//   const [routeCdUpdated, setRouteCdUpdated] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState('');
//   const [routeCd, setRouteCd] = useState('None');
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [fileUploadCondition, setFileUploadCondition] = useState(false);
//   const [categoryLoading, setCategoryLoading] = useState(false);
//   const [themeColor, setThemeColor] = useState("#1a3673");
//   const [showPicker, setShowPicker] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [requestId, setRequestId] = useState(uuidv4());
//   const [showInitialView, setShowInitialView] = useState(true);

//   const [open, setOpen] = useState(false);
//   const [copySuccess, setCopySuccess] = useState('');

//   const jsonData = JSON.stringify({
//     "SVRO_APPROVED_YN": " ",
//     "SVRO_PROGRAM_NO": " ",
//     "BUSINESS_FUNDED": " ",
//     "FUNDING_COST_CENTER_NO": " ",
//     "TGOV_REQUEST_ID": " ",
//     "PROJECT_NAME": " ",
//     "PROJECT_CODE": " ",
//     "APM_NO": " ",
//     "IT_OWNER_NAME": " ",
//     "ARCHITECT_LEAD_NAME": "  ",
//     "BUSINES_OWNER_NAME": "  ",
//     "Architecture Deck": " ",
//     "REVIEW_DATE": " ",
//     "Receiver_Email": " "
//   }, null, 2);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(jsonData).then(() => {
//       setCopySuccess('Copied!');
//       setTimeout(() => setCopySuccess(''), 2000);
//     });
//   };

//   const handleNewChat = () => {
//     setChatLog([]);
//     setResponseReceived(false);
//     setError('');
//     setRouteCdUpdated(false);
//     setUploadStatus(false);
//     setRouteCd('None');
//     setIsLoading(false);
//     setSuccessMessage('');
//     setFileUploadCondition(false);
//     setCategoryLoading(false);
//     setSelectedCategory(null);
//     setShowInitialView(true);
//     setRequestId(uuidv4());
//   };

//   const theme = createTheme({
//     palette: {
//       primary: {
//         main: themeColor,
//       },
//       background: {
//         default: themeColor,
//       },
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ display: "flex", height: '100vh', flexDirection: 'column', overflow: 'hidden' }}>
//         <CssBaseline />
//         <AppBar
//           position="fixed"
//           sx={{
//             zIndex: (theme) => theme.zIndex.drawer + 1,
//             backgroundColor: themeColor,
//             boxShadow: "-1px -4px 14px #000",
//             height: '64px',
//           }}
//         >
//           <Toolbar sx={{ justifyContent: isMobile ? "space-between" : "flex-start" }}>
//             <Box
//               component="img"
//               sx={{
//                 height: isMobile ? 40 : 50,
//                 marginRight: 2,
//               }}
//               src={elevance}
//               alt="Elevance Health Logo"
//             />
//             <Typography
//               variant="h6"
//               noWrap
//               component="div"
//               sx={{
//                 flexGrow: 1,
//                 textAlign: "center",
//                 fontWeight: "bold",
//                 fontSize: isMobile ? "1rem" : "1.5rem",
//                 marginLeft: '-90px'
//               }}
//             >
//               EDA ARB Assistant
//             </Typography>
//           </Toolbar>
//         </AppBar>

//         {!isMobile && (
//           <Drawer
//             variant="permanent"
//             sx={{
//               width: drawerWidth,
//               flexShrink: 0,
//               [`& .MuiDrawer-paper`]: {
//                 width: drawerWidth,
//                 boxSizing: "border-box",
//                 backgroundColor: "#fff",
//                 boxShadow: '-1px -3px 10px grey',
//               },
//             }}
//           >
//             <Toolbar />
//             <Box sx={{ position: "relative", height: "100%", padding: 2, textAlign: 'center' }}>
//               {routeCd === 'arb_scheduler' && (
//                 <MuiButton
//                   variant="contained"
//                   size="large"
//                   sx={{ fontWeight: 'bold' }}
//                   startIcon={<DescriptionIcon />}
//                   onClick={handleOpen}
//                 >
//                   Json
//                 </MuiButton>
//               )}
//               <Modal open={open} onClose={handleClose} aria-labelledby="json-modal-title">
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: 400,
//                     bgcolor: 'background.paper',
//                     border: '2px solid #000',
//                     borderRadius: '8px',
//                     boxShadow: 24,
//                     p: 3,
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography id="json-modal-title" variant="h6" component="h2">
//                       JSON Data
//                     </Typography>
//                     <IconButton
//                       onClick={handleCopy}
//                       sx={{
//                         color: 'primary.main',
//                         fontSize: '18px',
//                       }}
//                     >
//                       <ContentCopyIcon />
//                     </IconButton>
//                   </Box>
//                   <Box
//                     component="pre"
//                     sx={{
//                       whiteSpace: 'pre-wrap',
//                       wordWrap: 'break-word',
//                       maxHeight: '200px',
//                       overflowY: 'auto',
//                       mt: 2,
//                       p: 2,
//                       bgcolor: '#f5f5f5',
//                       borderRadius: '4px',
//                     }}
//                   >
//                     {jsonData}
//                   </Box>
//                   {copySuccess && (
//                     <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
//                       {copySuccess}
//                     </Typography>
//                   )}
//                 </Box>
//               </Modal>
//               <MuiButton
//                 variant="contained"
//                 size="large"
//                 sx={{
//                   position: "absolute",
//                   bottom: 16,
//                   width: "90%",
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                   fontWeight: "bold",
//                   backgroundColor: themeColor,
//                 }}
//                 startIcon={<HiOutlinePencilAlt />}
//                 onClick={handleNewChat}
//               >
//                 New Chat
//               </MuiButton>
//             </Box>
//           </Drawer>
//         )}

//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             bgcolor: "#fff",
//             p: 3,
//             height: "100vh",
//             overflow: "hidden",
//             paddingTop: '64px',
//           }}
//         >
//           <Toolbar />
//           {isMobile && (
//             <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
//               <MuiButton
//                 variant="contained"
//                 size="large"
//                 sx={{ fontWeight: "bold" }}
//                 startIcon={<HiOutlinePencilAlt />}
//                 onClick={handleNewChat}
//               >
//                 New Chat
//               </MuiButton>
//             </Box>
//           )}
//           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: '100%' }}>
//             <UserChat
//               chatLog={chatLog}
//               setChatLog={setChatLog}
//               responseReceived={responseReceived}
//               setResponseReceived={setResponseReceived}
//               error={error}
//               setError={setError}
//               routeCdUpdated={routeCdUpdated}
//               setRouteCdUpdated={setRouteCdUpdated}
//               uploadStatus={uploadStatus}
//               setUploadStatus={setUploadStatus}
//               routeCd={routeCd}
//               setRouteCd={setRouteCd}
//               isLoading={isLoading}
//               setIsLoading={setIsLoading}
//               successMessage={successMessage}
//               setSuccessMessage={setSuccessMessage}
//               fileUploadCondition={fileUploadCondition}
//               setFileUploadCondition={setFileUploadCondition}
//               categoryLoading={categoryLoading}
//               setCategoryLoading={setCategoryLoading}
//               themeColor={themeColor}
//               selectedCategory={selectedCategory}
//               setSelectedCategory={setSelectedCategory}
//               showInitialView={showInitialView}
//               setShowInitialView={setShowInitialView}
//               requestId={requestId}
//               setRequestId={setRequestId}
//               handleNewChat={handleNewChat}
//             />
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default Dashboard;

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
  Modal,
  IconButton
} from "@mui/material";
import { HiOutlinePencilAlt } from "react-icons/hi";
import DescriptionIcon from '@mui/icons-material/Description';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import elevance from "../assets/images/logo.png";
import UserChat from './UserChat';
import { v4 as uuidv4 } from 'uuid';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import JsonButton from "../components/JSON";

const drawerWidth = 180;

const Dashboard = () => {
  const isMobile = useMediaQuery("(max-width:950px)");

  const [chatLog, setChatLog] = useState([]);
  const [responseReceived, setResponseReceived] = useState(false);
  const [error, setError] = useState('');
  const [routeCdUpdated, setRouteCdUpdated] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [routeCd, setRouteCd] = useState('None');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fileUploadCondition, setFileUploadCondition] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [themeColor, setThemeColor] = useState("#1a3673");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [requestId, setRequestId] = useState(uuidv4());
  const [showInitialView, setShowInitialView] = useState(true);

  const [open, setOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const jsonData = JSON.stringify({
    "SVRO_TO_APPROVED_YN": " ",
    "SVRO_TO_PROGRAM_NO": " ",
    "BUSINESS_FUNDED": " ",
    "FUNDING_COST_CENTER_NO": " ",
    "TGOV_REQUEST_ID": " ",
    "PROJECT_NAME": " ",
    "PROJECT_CODE": " ",
    "APM_NO": " ",
    "IT_OWNER_NAME": " ",
    "ARCHITECT_LEAD_NAME": "  ",
    "BUSINES_OWNER_NAME": "  ",
    "Architecture Deck": " ",
    "REVIEW_DATE": " ",
    "Receiver_Email": " "
  }, null, 2);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonData).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleNewChat = () => {
    setChatLog([]);
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
    setShowInitialView(true);
    setRequestId(uuidv4());
  };

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
              EDA ARB Assistant
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
              {/* {routeCd === 'arb_scheduler' && (
                <MuiButton
                  variant="contained"
                  size="large"
                  sx={{ fontWeight: 'bold' }}
                  startIcon={<DescriptionIcon />}
                  onClick={handleOpen}
                >
                  Json
                </MuiButton>
              )} */}

<MuiButton
                  variant="contained"
                  size="large"
                  sx={{ fontWeight: 'bold' }}
                  startIcon={<DescriptionIcon />}
                  onClick={handleOpen}
                >
                  Json
                </MuiButton>
              {/* <Modal open={open} onClose={handleClose} aria-labelledby="json-modal-title">
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography id="json-modal-title" variant="h6" component="h2">
                      JSON Data
                    </Typography>
                    <IconButton
                      onClick={handleCopy}
                      sx={{
                        color: 'primary.main',
                        fontSize: '18px',
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                  <Box
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      mt: 2,
                      p: 2,
                      bgcolor: '#f5f5f5',
                      borderRadius: '4px',
                    }}
                  >
                    {jsonData}
                  </Box>
                  {copySuccess && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      {copySuccess}
                    </Typography>
                  )}
                </Box>
              </Modal> */}
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
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
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
           <JsonButton open={open} handleClose={handleClose}
             error={error}
             setError={setError}
             routeCdUpdated={routeCdUpdated}
             setRouteCdUpdated={setRouteCdUpdated}
             routeCd={routeCd}
             setRouteCd={setRouteCd}
             requestId={requestId}
             setRequestId={setRequestId}
             app_cd="ARB_Bot"
           />
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
              handleNewChat={handleNewChat}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;