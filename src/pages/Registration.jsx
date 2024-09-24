import React, { useState } from 'react';
import Signup from '../components/popups/SignUp';
import Login from '../components/popups/Login';

const Registration = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-teal-400 p-4 rounded-lg shadow-md">
      <div className="bg-white shadow-lg rounded-lg p-2 max-w-md w-full mx-2">
        {showLogin ? (
          <>
            <Login />
            <div className="text-center pb-2">
              <p className="text-gray-700 text-sm md:text-base">Don't have an account?</p>
              <button
                onClick={handleToggle}
                className="text-blue-600 hover:underline font-semibold"
              >
                Create one!
              </button>
            </div>
          </>
        ) : (
          <>
            <Signup />
            <div className="text-center pb-2">
              <p className="text-gray-700 text-sm md:text-base">Already have an account?</p>
              <button
                onClick={handleToggle}
                className="text-blue-600 hover:underline font-semibold"
              >
                Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Registration;
