// src/layouts/DashboardLayout.js
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // Initialize Tawk.to
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    var s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://embed.tawk.to/674456ce4304e3196ae8365d/default';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    document.head.appendChild(s1);

    return () => {
      // Cleanup to remove Tawk.to script when the component unmounts
      document.head.removeChild(s1);
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
