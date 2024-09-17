// import React from 'react';
// import { Navbar, Button, Sidebar } from 'flowbite-react';
// import "./Dashboard.css";


// function Dashboard() {
//     return (
//         <><nav class="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
//             <div class="px-3 py-3 lg:px-5 lg:pl-3">
//                 <div class="flex items-center justify-between">
//                     <div class="flex items-center justify-start">
//                         <a href="/" class="flex ml-2 md:mr-24">
//                             {/* <img src="https://flowbite-admin-dashboard.vercel.app/images/logo.svg" class="h-8 mr-3" alt="FlowBite Logo" /> */}
//                             <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">ArB</span>
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//         <Sidebar aria-label="Sidebar with content separator example" className='sidebar-content'>
//       <Sidebar.Items>
//         <Sidebar.ItemGroup>
//           <Sidebar.Item href="#">
//             Dashboard
//           </Sidebar.Item>
//           <Sidebar.Item href="#">
//             Kanban
//           </Sidebar.Item>
//         </Sidebar.ItemGroup>
//       </Sidebar.Items>
//     </Sidebar></>
//       );
// }

// export default Dashboard;
import React from 'react';
import { Sidebar, Navbar, Button, TextInput } from 'flowbite-react';

function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
       <Sidebar aria-label="Default sidebar example" className="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-4 font-normal">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#">
            Dashboard
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <Navbar fluid={true} rounded={true} className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <Navbar.Toggle />
          <div className="flex items-center space-x-4">
            {/* <TextInput type="search" placeholder="Search" className="hidden md:block" /> */}

<form class="max-w-md mx-auto">   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
      
    </div>
</form>

            {/* <Navbar.Link href="#" className="hover:bg-gray-200 p-2 rounded">
              <i className="fas fa-user-circle"></i>
            </Navbar.Link> */}
          </div>
        </Navbar>

        {/* Content Area */}
        <main className="flex flex-col items-center justify-center h-full p-10 bg-gray-100">
         
        </main>
      </div>
    </div>
  );
}

export default Dashboard;


