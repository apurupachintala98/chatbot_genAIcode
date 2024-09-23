"use client";
import React, { useState } from 'react';
import { Sidebar, Navbar, TextInput, Avatar, Dropdown, Button } from 'flowbite-react';
import {
  HiSearch, HiOutlinePencilAlt
} from "react-icons/hi";
import "./Dashboard.css";

//chat message section
const Message = (props) => {
  let dataRoll = props.position === "left_buble" ? "ASSISTANT" : "USER";
  let thisClass = `chat-bubble ${props.position}`;
  return (
    <div data-role={dataRoll} className="bubble-container">
      <div className={thisClass}>
        <div className="text_message">
          {props.message.replace(/<\/?[^>]+(>|$)/g, "")}
        </div>
      </div>
      <div className="clear"></div>
    </div>
  );
}

function Dashboard() {

  //messages
  const [chatMessage, setChatMessage] = useState([
    // {
    //     position: "left_buble",
    //     message: "Hello there, I am your assistant. How can I help you today? ",
    // },
  ]);
  const [inputValue, setInputValue] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const prompt = inputValue.trim();
    if (prompt === "") {
      return;
    }
    const newMessages = [
      ...chatMessage,
      {
        position: "right_buble",
        message: prompt,
      },
    ];
    setChatMessage(newMessages);
    setInputValue("");

    // const data = {
    //     input: prompt,
    // };

    try {
      // const res = await axios.post('http://localhost:5000/get_response', data);
      // const updatedMessages = [
      //     ...newMessages,
      //     {
      //         position: "left_buble",
      //         message: res.data.response,
      //     },
      // ];
      // setChatMessage(updatedMessages);
    } catch (error) {
      // console.error("Error fetching response:", error);
      // const errorMessage = {
      //     position: "left_buble",
      //     message: "Error",
      // };
      // setChatMessage([...newMessages, errorMessage]);
    } finally {
    }
  }

  return (
    <div className="flex h-screen main-content">
      {/* Sidebar */}
      <Sidebar className="fixed min-w-fit top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-4 font-normal sidebar">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Button gradientDuoTone="greenToBlue" size="xl">
              New Chat
              <HiOutlinePencilAlt className="ml-2 h-5 w-5" />
            </Button>
          </Sidebar.ItemGroup>

        </Sidebar.Items>
      </Sidebar>
      {/* Navbar */}
      <Navbar fluid={true} rounded={true} className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 navbarfixed">
        <Navbar.Toggle />
        <a href="/" class="p-2 logo">
          <img src="/logo.png" alt="Elevance Health Logo" />
        </a>
        <p className="d-flex p-2 ml-3 mb-0 flex-fill align-items-center chat-assist">ARB Chat Assistant</p>
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
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </Navbar>

      {/* Content Area */}
      <div className="start-chatbot-fullscreen">
        {/* chat messages section */}
        {chatMessage.map((chatMessage, key) => (
          <Message
            key={key}
            position={chatMessage.position}
            message={chatMessage.message}
          />
        ))}
        {/* Loader section */}
        {/* {isLoading && <div className="loader">
//                             <div className="dot"></div>
//                             <div className="dot"></div>
//                             <div className="dot"></div>
//                             <div className="dot"></div>
                        </div>} */}
        {/* Loader section */}
        <div className="blanter-msg">
          <form onSubmit={handleSubmit}>

            <input
              type="text"
              id="chat-input"
              class="form-control"
              placeholder="What can I help you with..."
              maxLength="400"
            />
            <button class="sendBtn"> <svg class="w-8 h-6 ml-2" aria-hidden="true" fill="#ffffff" viewBox="0 0 448 448">
              <path d="M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z" />
            </svg></button>
          </form>
        </div>

      </div>

    </div>


  );
}

export default Dashboard;


