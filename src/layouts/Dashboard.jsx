import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
