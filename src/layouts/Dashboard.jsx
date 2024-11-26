import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    console.log('Initializing Tawk.to script');

    // Dynamically load the Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/674628752480f5b4f5a469fc/1idl0s3n9';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Optional event listeners for debugging
    script.onload = () => console.log('Tawk.to script loaded successfully');
    script.onerror = (error) => console.error('Error loading Tawk.to script:', error);

    // Append the script to the head
    document.head.appendChild(script);

    // Cleanup function to remove the script on unmount
    return () => {
      console.log('Cleaning up Tawk.to script');
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []); // Empty dependency array to run only on mount and unmount

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onSidebarToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-6 pt-20 overflow-y-auto">
          {/* Adding top padding (pt-20) to account for fixed header */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
