"use client";
import { Button, Drawer, DrawerHeader } from "flowbite-react";
import React, { useState } from 'react';
import axios from 'axios';
import "./Chatbot.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

// SVG icons for feedback section //
const ThumbsUpIcon = () => <svg class="w-[16px] h-[16px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475" />
</svg>;
const ThumbsDownIcon = () => <svg class="w-[16px] h-[16px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13c-.889.086-1.416.543-2.156 1.057a22.322 22.322 0 0 0-3.958 5.084 1.6 1.6 0 0 1-.582.628 1.549 1.549 0 0 1-1.466.087 1.587 1.587 0 0 1-.537-.406 1.666 1.666 0 0 1-.384-1.279l1.389-4.114M17 13h3V6.5A1.5 1.5 0 0 0 18.5 5v0A1.5 1.5 0 0 0 17 6.5V13Zm-6.5 1H5.585c-.286 0-.372-.014-.626-.15a1.797 1.797 0 0 1-.637-.572 1.873 1.873 0 0 1-.215-1.673l2.098-6.4C6.462 4.48 6.632 4 7.88 4c2.302 0 4.79.943 6.67 1.475" />
</svg>;
const ThumbsUpIconDark = () => <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109 2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072 0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485 25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z" clip-rule="evenodd" />
</svg>;
const ThumbsDownIconDark = () => <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M8.97 14.316H5.004c-.322 0-.64-.08-.925-.232a2.022 2.022 0 0 1-.717-.645 2.108 2.108 0 0 1-.242-1.883l2.36-7.201C5.769 3.54 5.96 3 7.365 3c2.072 0 4.276.678 6.156 1.256.473.145.925.284 1.35.404h.114v9.862a25.485 25.485 0 0 0-4.238 5.514c-.197.376-.516.67-.901.83a1.74 1.74 0 0 1-1.21.048 1.79 1.79 0 0 1-.96-.757 1.867 1.867 0 0 1-.269-1.211l1.562-4.63ZM19.822 14H17V6a2 2 0 1 1 4 0v6.823c0 .65-.527 1.177-1.177 1.177Z" clip-rule="evenodd" />
</svg>;
const CommentIcon = () => <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
</svg>;

// End of SVG icons for feedback section //

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

function Chatbot() {

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const [isVisible, setIsVisible] = useState(true);      // State to control visibility for default chat image and text
    const [responseReceived, setResponseReceived] = useState(false);

    //messages
    const [chatMessage, setChatMessage] = useState([
        // {
        //     position: "left_buble",
        //     message: "Hello there, I am your assistant. How can I help you today? ",
        // },
    ]);

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New state for loading

    //reset
    const resetChat = () => {
        setIsVisible(true); // Show the image and text again
    setResponseReceived(false); // Hide the helpfulness prompt
        setChatMessage([
        ]);
    };

    // Handle key press
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

    //feedback
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);

    const handleThumbsUp = async () => {
        // Toggle the thumbs-up state and reset thumbs-down if it's active
        setIsLiked(!isLiked);
        if (isDisliked) setIsDisliked(false);

        //Send the new state to the backend
        // try {
        //     const response = await fetch('http://localhost:5000/api/like', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ liked: !isLiked, disliked: false }),
        //     });

        //     if (!response.ok) {
        //         throw new Error('Failed to update like status');
        //     }
        // } catch (error) {
        //     console.error('Error updating like status:', error);
        // }
    };

    const handleThumbsDown = async () => {
        // Toggle the thumbs-down state and reset thumbs-up if it's active
        setIsDisliked(!isDisliked);
        if (isLiked) setIsLiked(false);

        // Send the new state to the backend
        // try {
        //     const response = await fetch('http://localhost:5000/api/like', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ liked: false, disliked: !isDisliked }),
        //     });

        //     if (!response.ok) {
        //         throw new Error('Failed to update dislike status');
        //     }
        // } catch (error) {
        //     console.error('Error updating dislike status:', error);
        // }
    };

    const handleButtonClick = () => {
        setIsCommentBoxVisible(!isCommentBoxVisible);
    };

    function chat_scroll_up() {
        let elem = document.querySelector(".start-chatbot");
        setTimeout(() => {
            elem.scrollTo({
                top: elem.scrollHeight,
                behavior: "smooth",
            });
        }, 200);
    }

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
        setIsLoading(true); // Start loading

        const data = {
            input: prompt,
        };

        try {
            const res = await axios.post('http://localhost:5000/get_response', data);
            const updatedMessages = [
                ...newMessages,
                {
                    position: "left_buble",
                    message: res.data.response,
                },
            ];
            setChatMessage(updatedMessages);
        } catch (error) {
            console.error("Error fetching response:", error);
            const errorMessage = {
                position: "left_buble",
                message: "Error",
            };
            setChatMessage([...newMessages, errorMessage]);
        } finally {
            setIsLoading(false); // Stop loading whether there's an error or not
            chat_scroll_up();
        }
    }
    return (
        <>
            <div className="flex min-h-[50vh] items-center justify-center">
                <a
                    onClick={() => setIsOpen(true)}
                    className="blantershow-chats"
                    href="#"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -30 128 180"
                        x="0px"
                        y="0px"
                    >
                        <g>
                            <g data-name="Glyph">
                                <path
                                    fill="#09c"
                                    d="M9.847,70.468A45.764,45.764,0,0,0,55.527,116s6.427-.033,7.544-.1a1.51,1.51,0,0,0,1.221-2.217,26.586,26.586,0,0,1-3.042-9.131,1.5,1.5,0,0,0-1.552-1.292c-.629.028-1.261.044-1.9.044-10.64,0-19.971-3.862-26.275-10.875C25.573,85.806,22.865,76.833,23.9,67.16A14.622,14.622,0,0,1,38.4,53.985,16.016,16.016,0,0,1,47.383,56.5,18.654,18.654,0,0,0,57.8,59.385,18.654,18.654,0,0,0,68.211,56.5a16.014,16.014,0,0,1,8.981-2.516,14.62,14.62,0,0,1,14.5,13.175c.078.73.133,1.5.172,2.412a1.492,1.492,0,0,0,1.592,1.515,39.834,39.834,0,0,1,10.561.718,1.509,1.509,0,0,0,1.8-1.466l.032-9.825a52.884,52.884,0,0,0-15.416-37.38c-9-9.084-20.577-14.086-32.6-14.086s-23.6,5-32.6,14.086A52.882,52.882,0,0,0,9.814,60.505ZM57.815,23.5a5.5,5.5,0,1,1-5.5,5.5A5.5,5.5,0,0,1,57.815,23.5ZM27.44,25.17A67.511,67.511,0,0,0,37.88,39.19,9.378,9.378,0,0,0,44.55,42H71.04a9.361,9.361,0,0,0,6.67-2.81A67.9,67.9,0,0,0,88.18,25.13s1.5,1.55,2.15,2.29A70.775,70.775,0,0,1,79.86,41.29,12.4,12.4,0,0,1,71.04,45H44.55a12.382,12.382,0,0,1-8.81-3.71A69.6,69.6,0,0,1,25.3,27.46C25.96,26.71,27.44,25.17,27.44,25.17Z"
                                />
                                <path
                                    fill="#09c"
                                    d="M7.2,17.091v22.46a13.145,13.145,0,0,0-1.85,1.54c-4.2,4.18-4.38,9.48-4.62,16.83-.25,7.39-.43,12.73,3.45,16.96.15.16.31.31.47.46a1.5,1.5,0,0,0,2.55-1.18c-.1-1.33-.15-2.42-.15-3.45l-.04-9.97a53.787,53.787,0,0,1,3.025-18.154,2.915,2.915,0,0,0,.165-.961V17.091A8.5,8.5,0,0,0,8.491.233,8.592,8.592,0,0,0,.223,8.094,8.513,8.513,0,0,0,7.2,17.091Z"
                                />
                                <path
                                    fill="#09c"
                                    d="M67.814,67.03v5.857a5.5,5.5,0,0,0,4.487,5.4,1.5,1.5,0,0,0,1.155-.259,35.133,35.133,0,0,1,4.321-2.672,1.5,1.5,0,0,0,.731-.86,5.706,5.706,0,0,0,.306-1.8V67.227c.063-2.941-2.525-5.815-5.5-5.7A5.515,5.515,0,0,0,67.814,67.03Z"
                                />
                                <path
                                    fill="#09c"
                                    d="M114.977,8.084A8.59,8.59,0,0,0,106.709.223,8.5,8.5,0,0,0,105,17.08V38.785a3.006,3.006,0,0,0,.176,1.02c.357.988.74,1.971,1.054,2.965a53.9,53.9,0,0,1,2.62,17l-.04,11.49A1.545,1.545,0,0,0,110,72.74l.87.33a1.511,1.511,0,0,0,1.8-.53c2.79-4.02,2.63-8.89,2.4-15.64-.25-7.34-.42-12.64-4.62-16.82A14.188,14.188,0,0,0,108,38.13V17.08A8.512,8.512,0,0,0,114.977,8.084Z"
                                />
                                <path
                                    fill="#09c"
                                    d="M96,74c-10.986,0-20.977,4.609-26.9,12.368-1.662-.109-2.878-.792-4.848-2.206a4.39,4.39,0,0,0-5.408.127A4.5,4.5,0,0,0,57.491,89.6a24.939,24.939,0,0,0,6.6,9.338C64.031,99.628,64,100.318,64,101c0,14.888,14.355,27,32,27s32-12.112,32-27S113.645,74,96,74ZM78.5,105a4,4,0,1,1,4-4A4,4,0,0,1,78.5,105Zm18,0a4,4,0,1,1,4-4A4,4,0,0,1,96.5,105Zm17,0a4,4,0,1,1,4-4A4,4,0,0,1,113.5,105Z"
                                />
                                <path
                                    fill="#09c"
                                    d="M42.32,61.53a5.713,5.713,0,0,0-5.51,5.7c.02,1.36,0,4.1,0,5.46a5.686,5.686,0,0,0,5.26,5.69,5.574,5.574,0,0,0,5.74-5.49c-.01-1.47,0-4.4,0-5.86A5.521,5.521,0,0,0,42.32,61.53Z"
                                />
                            </g>
                        </g>
                    </svg>
                </a>
            </div>
            <Drawer open={isOpen} onClose={handleClose} position="right" className="curved-borderforchat">
                <DrawerHeader titleIcon={() => <></>} />
                <Drawer.Items>
                    <div className="header-chats">
                        <div className="head-home">
                            <div className="info-avatar">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -30 128 180"
                                    x="0px"
                                    y="0px"
                                >
                                    <g>
                                        <g data-name="Glyph">
                                            <path
                                                fill="#09c"
                                                d="M9.847,70.468A45.764,45.764,0,0,0,55.527,116s6.427-.033,7.544-.1a1.51,1.51,0,0,0,1.221-2.217,26.586,26.586,0,0,1-3.042-9.131,1.5,1.5,0,0,0-1.552-1.292c-.629.028-1.261.044-1.9.044-10.64,0-19.971-3.862-26.275-10.875C25.573,85.806,22.865,76.833,23.9,67.16A14.622,14.622,0,0,1,38.4,53.985,16.016,16.016,0,0,1,47.383,56.5,18.654,18.654,0,0,0,57.8,59.385,18.654,18.654,0,0,0,68.211,56.5a16.014,16.014,0,0,1,8.981-2.516,14.62,14.62,0,0,1,14.5,13.175c.078.73.133,1.5.172,2.412a1.492,1.492,0,0,0,1.592,1.515,39.834,39.834,0,0,1,10.561.718,1.509,1.509,0,0,0,1.8-1.466l.032-9.825a52.884,52.884,0,0,0-15.416-37.38c-9-9.084-20.577-14.086-32.6-14.086s-23.6,5-32.6,14.086A52.882,52.882,0,0,0,9.814,60.505ZM57.815,23.5a5.5,5.5,0,1,1-5.5,5.5A5.5,5.5,0,0,1,57.815,23.5ZM27.44,25.17A67.511,67.511,0,0,0,37.88,39.19,9.378,9.378,0,0,0,44.55,42H71.04a9.361,9.361,0,0,0,6.67-2.81A67.9,67.9,0,0,0,88.18,25.13s1.5,1.55,2.15,2.29A70.775,70.775,0,0,1,79.86,41.29,12.4,12.4,0,0,1,71.04,45H44.55a12.382,12.382,0,0,1-8.81-3.71A69.6,69.6,0,0,1,25.3,27.46C25.96,26.71,27.44,25.17,27.44,25.17Z"
                                            />
                                            <path
                                                fill="#09c"
                                                d="M7.2,17.091v22.46a13.145,13.145,0,0,0-1.85,1.54c-4.2,4.18-4.38,9.48-4.62,16.83-.25,7.39-.43,12.73,3.45,16.96.15.16.31.31.47.46a1.5,1.5,0,0,0,2.55-1.18c-.1-1.33-.15-2.42-.15-3.45l-.04-9.97a53.787,53.787,0,0,1,3.025-18.154,2.915,2.915,0,0,0,.165-.961V17.091A8.5,8.5,0,0,0,8.491.233,8.592,8.592,0,0,0,.223,8.094,8.513,8.513,0,0,0,7.2,17.091Z"
                                            />
                                            <path
                                                fill="#09c"
                                                d="M67.814,67.03v5.857a5.5,5.5,0,0,0,4.487,5.4,1.5,1.5,0,0,0,1.155-.259,35.133,35.133,0,0,1,4.321-2.672,1.5,1.5,0,0,0,.731-.86,5.706,5.706,0,0,0,.306-1.8V67.227c.063-2.941-2.525-5.815-5.5-5.7A5.515,5.515,0,0,0,67.814,67.03Z"
                                            />
                                            <path
                                                fill="#09c"
                                                d="M114.977,8.084A8.59,8.59,0,0,0,106.709.223,8.5,8.5,0,0,0,105,17.08V38.785a3.006,3.006,0,0,0,.176,1.02c.357.988.74,1.971,1.054,2.965a53.9,53.9,0,0,1,2.62,17l-.04,11.49A1.545,1.545,0,0,0,110,72.74l.87.33a1.511,1.511,0,0,0,1.8-.53c2.79-4.02,2.63-8.89,2.4-15.64-.25-7.34-.42-12.64-4.62-16.82A14.188,14.188,0,0,0,108,38.13V17.08A8.512,8.512,0,0,0,114.977,8.084Z"
                                            />
                                            <path
                                                fill="#09c"
                                                d="M96,74c-10.986,0-20.977,4.609-26.9,12.368-1.662-.109-2.878-.792-4.848-2.206a4.39,4.39,0,0,0-5.408.127A4.5,4.5,0,0,0,57.491,89.6a24.939,24.939,0,0,0,6.6,9.338C64.031,99.628,64,100.318,64,101c0,14.888,14.355,27,32,27s32-12.112,32-27S113.645,74,96,74ZM78.5,105a4,4,0,1,1,4-4A4,4,0,0,1,78.5,105Zm18,0a4,4,0,1,1,4-4A4,4,0,0,1,96.5,105Zm17,0a4,4,0,1,1,4-4A4,4,0,0,1,113.5,105Z"
                                            />
                                            <path
                                                fill="#09c"
                                                d="M42.32,61.53a5.713,5.713,0,0,0-5.51,5.7c.02,1.36,0,4.1,0,5.46a5.686,5.686,0,0,0,5.26,5.69,5.574,5.574,0,0,0,5.74-5.49c-.01-1.47,0-4.4,0-5.86A5.521,5.521,0,0,0,42.32,61.53Z"
                                            />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <p>
                                <span className="assistantName"> Chat With HEDIS Bot</span>
                                <div className="online-status">
                                    <FontAwesomeIcon icon={faCircle} className="online-icon" />
                                    <span class="sliding-text">Online</span>
                                </div>
                            </p>
                        </div>
                    </div>
                    <div className="start-chatbot">
                        {isVisible && (
                            <div className="center-container">
                                {/* <img src="/src/assets/images/chatbot.png" alt="logo" className="center-image" /> */}
                                <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -30 128 180"
                       width="80" height="80" >
                        <g>
                            <g data-name="Glyph">
                                <path
                                    fill="#09c"
                                    d="M9.847,70.468A45.764,45.764,0,0,0,55.527,116s6.427-.033,7.544-.1a1.51,1.51,0,0,0,1.221-2.217,26.586,26.586,0,0,1-3.042-9.131,1.5,1.5,0,0,0-1.552-1.292c-.629.028-1.261.044-1.9.044-10.64,0-19.971-3.862-26.275-10.875C25.573,85.806,22.865,76.833,23.9,67.16A14.622,14.622,0,0,1,38.4,53.985,16.016,16.016,0,0,1,47.383,56.5,18.654,18.654,0,0,0,57.8,59.385,18.654,18.654,0,0,0,68.211,56.5a16.014,16.014,0,0,1,8.981-2.516,14.62,14.62,0,0,1,14.5,13.175c.078.73.133,1.5.172,2.412a1.492,1.492,0,0,0,1.592,1.515,39.834,39.834,0,0,1,10.561.718,1.509,1.509,0,0,0,1.8-1.466l.032-9.825a52.884,52.884,0,0,0-15.416-37.38c-9-9.084-20.577-14.086-32.6-14.086s-23.6,5-32.6,14.086A52.882,52.882,0,0,0,9.814,60.505ZM57.815,23.5a5.5,5.5,0,1,1-5.5,5.5A5.5,5.5,0,0,1,57.815,23.5ZM27.44,25.17A67.511,67.511,0,0,0,37.88,39.19,9.378,9.378,0,0,0,44.55,42H71.04a9.361,9.361,0,0,0,6.67-2.81A67.9,67.9,0,0,0,88.18,25.13s1.5,1.55,2.15,2.29A70.775,70.775,0,0,1,79.86,41.29,12.4,12.4,0,0,1,71.04,45H44.55a12.382,12.382,0,0,1-8.81-3.71A69.6,69.6,0,0,1,25.3,27.46C25.96,26.71,27.44,25.17,27.44,25.17Z"
                                />
                                <path
                                    fill="#09c"
                                    d="M7.2,17.091v22.46a13.145,13.145,0,0,0-1.85,1.54c-4.2,4.18-4.38,9.48-4.62,16.83-.25,7.39-.43,12.73,3.45,16.96.15.16.31.31.47.46a1.5,1.5,0,0,0,2.55-1.18c-.1-1.33-.15-2.42-.15-3.45l-.04-9.97a53.787,53.787,0,0,1,3.025-18.154,2.915,2.915,0,0,0,.165-.961V17.091A8.5,8.5,0,0,0,8.491.233,8.592,8.592,0,0,0,.223,8.094,8.513,8.513,0,0,0,7.2,17.091Z"
                                />
                                <path
                                    fill="#09c"
                                    d="M67.814,67.03v5.857a5.5,5.5,0,0,0,4.487,5.4,1.5,1.5,0,0,0,1.155-.259,35.133,35.133,0,0,1,4.321-2.672,1.5,1.5,0,0,0,.731-.86,5.706,5.706,0,0,0,.306-1.8V67.227c.063-2.941-2.525-5.815-5.5-5.7A5.515,5.515,0,0,0,67.814,67.03Z"
                                />
                                <path
                                    fill="#09c"
                                    d="M114.977,8.084A8.59,8.59,0,0,0,106.709.223,8.5,8.5,0,0,0,105,17.08V38.785a3.006,3.006,0,0,0,.176,1.02c.357.988.74,1.971,1.054,2.965a53.9,53.9,0,0,1,2.62,17l-.04,11.49A1.545,1.545,0,0,0,110,72.74l.87.33a1.511,1.511,0,0,0,1.8-.53c2.79-4.02,2.63-8.89,2.4-15.64-.25-7.34-.42-12.64-4.62-16.82A14.188,14.188,0,0,0,108,38.13V17.08A8.512,8.512,0,0,0,114.977,8.084Z"
                                />
                                <path
                                    fill="#09c"
                                    d="M96,74c-10.986,0-20.977,4.609-26.9,12.368-1.662-.109-2.878-.792-4.848-2.206a4.39,4.39,0,0,0-5.408.127A4.5,4.5,0,0,0,57.491,89.6a24.939,24.939,0,0,0,6.6,9.338C64.031,99.628,64,100.318,64,101c0,14.888,14.355,27,32,27s32-12.112,32-27S113.645,74,96,74ZM78.5,105a4,4,0,1,1,4-4A4,4,0,0,1,78.5,105Zm18,0a4,4,0,1,1,4-4A4,4,0,0,1,96.5,105Zm17,0a4,4,0,1,1,4-4A4,4,0,0,1,113.5,105Z"
                                />
                                <path
                                    fill="#09c"
                                    d="M42.32,61.53a5.713,5.713,0,0,0-5.51,5.7c.02,1.36,0,4.1,0,5.46a5.686,5.686,0,0,0,5.26,5.69,5.574,5.574,0,0,0,5.74-5.49c-.01-1.47,0-4.4,0-5.86A5.521,5.521,0,0,0,42.32,61.53Z"
                                />
                            </g>
                        </g>
                    </svg>
                                <p className="center-text">Hello there, I am your assistant. How can I help you today? </p>
                            </div>
                        )}
                        {/* chat messages section */}
                        {chatMessage.map((chatMessage, key) => (
                            <Message
                                key={key}
                                position={chatMessage.position}
                                message={chatMessage.message}
                            />
                        ))}
                        {/* Loader section */}
                        {isLoading && <div className="loader">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>}
                        {/* Loader section */}
                        {/* Feedback section */}
                        {responseReceived && (
                        <div className="feedback-container">
                            <p className="feedback-text">Was this response helpful?</p>
                            <button onClick={handleThumbsUp} className="text-gray-500 hover:text-gray-800 ml-2">
                                {isLiked ? <ThumbsUpIconDark /> : <ThumbsUpIcon />}
                            </button>
                            <button onClick={handleThumbsDown} className="text-gray-500 hover:text-gray-800 ml-2">
                                {isDisliked ? <ThumbsDownIconDark /> : <ThumbsDownIcon />}
                            </button>
                            <button onClick={handleButtonClick} className="feedback-button">
                                <CommentIcon />
                            </button>
                            {isCommentBoxVisible && (
                                <div className="comment-box">
                                    <form className="comment-submit">
                                        <label for="chat" class="sr-only">Your Comment</label>
                                        <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                            <textarea id="chat" rows="3" class="block p-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                                            <button type="submit" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                                <svg class="w-5 h-5" aria-hidden="true" fill="#44b8f3" viewBox="0 0 448 448">
                                                    <path d="M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z" />
                                                </svg>
                                                <span class="sr-only">Send message</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                        )}
                    </div>
                    {/* input && reset section  */}
                    <div className="blanter-msg">
                        <form onSubmit={handleSubmit}>
                            <div class="input-group">
                                <div>

                                    <Button
                                        onClick={resetChat}
                                        disabled={isLoading}
                                        type="button"
                                        className="reset-chat-button"
                                        data-toggle="tooltip" data-placement="top" title="Reset Chat"
                                    >
                                        <svg
                                            className="w-6 h-6 text-gray-800 dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                                            />
                                        </svg>
                                    </Button>
                                </div>
                                <input
                                    type="text"
                                    id="chat-input"
                                    class="form-control"
                                    placeholder="What can I help you with..."
                                    maxLength="400"
                                    value={inputValue}
                                    onKeyPress={handleKeyPress} // Listen for Enter key press
                                    onChange={(e) => setInputValue(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </form>
                    </div>
                    {/* input && reset section  */}
                </Drawer.Items>
            </Drawer>
        </>
    );
}

export default Chatbot;
