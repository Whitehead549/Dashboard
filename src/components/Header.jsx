import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Update the path to your logo;
import { FaSignOutAlt } from 'react-icons/fa';
import {auth} from '../Config/Config'

const Header = ({ onSidebarToggle }) => {

  const navigate = useNavigate()

  const handleLogout = () => {
    auth.signOut().then(()=>{
      navigate('/');

    })

  }


  return (
    <header className="fixed top-0 left-0 w-full bg-gray-100 shadow-md p-2 flex justify-between items-center z-50">
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button 
          onClick={onSidebarToggle} 
          className="text-gray-500 text-2xl md:text-2xl font-semibold focus:outline-none md:hidden">
          &#9776;
        </button>
        
        {/* Responsive Logo Image */}
        <img 
          src={logo} 
          alt="Logo" 
          className="w-32 h-5 sm:w-30 sm:h-8 md:w-72 md:h-7 lg:w-42 lg:h-9 xl:w-[230px] xl:h-[30px] ml-4" 
        /> {/* Responsive scaling of the logo */}
      </div>
      
      {/* Right Side */}
      <div className="flex items-center space-x-0.5">
      <FaSignOutAlt className="text-gray-600 hover:text-gray-800 cursor-pointer text-md" onClick={handleLogout} />
      <div className="text-gray-600 hover:text-gray-800 cursor-pointer text-md" onClick={handleLogout}>
        Logout
      </div>
    </div>

    </header>
  );
};

export default Header;

