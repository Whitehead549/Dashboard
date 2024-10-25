// WelcomePopup.js
import React from 'react';

const WelcomePopup = ({ onProceed, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-semibold">Welcome!</h2>
        <p className="text-gray-700 my-4">
           Select your language below before clicking "Proceed"
        </p>
        <button
          onClick={onProceed}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Proceed
        </button>
        <button
          onClick={onClose}
          className="ml-2 text-gray-600 underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WelcomePopup;
