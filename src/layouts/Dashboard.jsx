import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // Dynamically load the Tawk.to script
    const tawkScript = document.createElement('script');
    tawkScript.src = 'https://embed.tawk.to/674628752480f5b4f5a469fc/1idl0s3n9';
    tawkScript.async = true;
    tawkScript.charset = 'UTF-8';
    tawkScript.setAttribute('crossorigin', '*');

    // Append the script to the document body
    document.body.appendChild(tawkScript);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(tawkScript);
    };
  }, []);

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
