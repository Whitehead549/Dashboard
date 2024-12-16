import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaMoneyBillWave, FaChartLine, FaHandHoldingUsd, FaHistory, FaPhone} from 'react-icons/fa'; // Import icons

const Sidebar = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Set mobile view for widths < 768px
    };

    handleResize(); // Call on component mount
    window.addEventListener('resize', handleResize); // Add resize listener

    return () => window.removeEventListener('resize', handleResize); // Cleanup listener on unmount
  }, []);

  return (
    <aside 
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:inset-auto md:w-64 w-64 transition-transform duration-200 ease-in-out bg-gray-800 text-white z-50`}
      style={isMobile ? { zIndex: 90 } : {}} // Apply zIndex: 90 only for mobile views
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-lg font-bold">Menu</span>
        <button 
          onClick={onClose} 
          className="text-white text-2xl md:hidden">
          &times;
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-8">
        <ul>
          <li>
            <Link to="/Dashboard" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaHome className="mr-3" /> {/* Icon */}
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaUser className="mr-3" /> {/* Icon */}
              Profile
            </Link>
          </li>
          <li>
            <Link to="/Deposit" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaMoneyBillWave  className="mr-3" /> {/* Icon */}
              Deposit
            </Link>
          </li>
          <li>
            <Link to="/Investmentplans" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaChartLine  className="mr-3" /> {/* Icon */}
              Investment Plans
            </Link>
          </li>
          <li>
            <Link to="/Withdraws" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaHandHoldingUsd  className="mr-3" /> {/* Icon */}
              Withdraw
            </Link>
          </li>
          <li>
            <Link to="/History" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaHistory  className="mr-3" /> {/* Icon */}
              History
            </Link>
          </li>
          <li>
          <a href="https://www.selmabriggswilson.xyz/contact.html" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaPhone className="mr-3" /> {/* Icon */}
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
