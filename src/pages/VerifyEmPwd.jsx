import React, { useState } from 'react';
import { auth } from '../Config/Config';
import { sendPasswordResetEmail } from 'firebase/auth';
import Modal from '../components/Essentials/Modal';


const VerifyEmPwd = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openGmail = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      window.location.href = "intent://inbox/#Intent;scheme=mailto;package=com.google.android.gm;end";
    } else if (isIOS) {
      window.location.href = "googlegmail://";
    } else {
      window.location.href = "https://mail.google.com";
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Password reset email sent to ${email}. Click below to check your inbox.`);
      setEmail('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessage('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mx-2 relative z-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-200"
          >
            Reset Password
          </button>
        </form>

        {/* Modal Component */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Password Reset"
          message={message}
          onGmailClick={openGmail} // Pass Gmail function to Modal
        />
      </div>
    </div>
  );
};

export default VerifyEmPwd;
