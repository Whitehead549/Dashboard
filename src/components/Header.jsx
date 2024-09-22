// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onSidebarToggle }) => {
  return (
    <header className="bg-gray-100 shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button 
          onClick={onSidebarToggle} 
          className="text-gray-500 focus:outline-none md:hidden">
          &#9776;
        </button>
        <h1 className="text-xl font-semibold text-gray-800 ml-4">LOGO</h1>
      </div>
      
      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="text-gray-600 hover:text-gray-800">
          Profile
        </Link>
        <button className="text-gray-600 hover:text-gray-800">
          Log Out
        </button>
      </div>
    </header>
  );
};

export default Header;
