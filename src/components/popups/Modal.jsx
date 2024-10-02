// Modal.js
import React from 'react';

const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4">Success</h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
