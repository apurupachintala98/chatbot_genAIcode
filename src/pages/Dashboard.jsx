import React from 'react';
import { Sidebar, Navbar, TextInput } from 'flowbite-react';
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="flex h-screen main-content">
      {/* Sidebar */}
      <Sidebar className="fixed min-w-fit top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-4 font-normal sidebar">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#">
              Test
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      {/* Navbar */}
      <Navbar fluid={true} rounded={true} className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 navbarfixed">
        <Navbar.Toggle />
        <a href="https://flowbite.com" class="flex ms-2 md:me-24">
          <img src="" class="h-8 me-3" alt="Logo" />
          <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Elevance Health</span>
        </a>
        <div className="flex items-center space-x-4">
          <TextInput type="search" placeholder="Search" className="hidden md:block" />
          {/* <form class="max-w-md mx-auto">   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
   <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-2 pl-2 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
         </svg>
        </div>
       <input type="search" id="default-search" class="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
   </div> </form> */}
        </div>
        <button type="button" class="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
</svg>


        </button>
      </Navbar>

      {/* Content Area */}
      <div className="start-chatbot-fullscreen">
        {/* chat messages section */}
        {/* {chatMessage.map((chatMessage, key) => (
//                             <Message
//                                 key={key}
//                                 position={chatMessage.position}
//                                 message={chatMessage.message}
//                             />
                         ))} */}
        {/* Loader section */}
        {/* {isLoading && <div className="loader">
//                             <div className="dot"></div>
//                             <div className="dot"></div>
//                             <div className="dot"></div>
//                             <div className="dot"></div>
                        </div>} */}
        {/* Loader section */}
        <div className="blanter-msg">
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
        </div>

      </div>

    </div>


  );
}

export default Dashboard;


