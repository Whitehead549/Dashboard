import React, { useState } from 'react';
import Signup from '../components/popups/SignUp';
import Login from '../components/popups/Login';

const Registration = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 ">
      <div className="rounded-lg p-4 shadow-lg w-full max-w-md sm:w-full" style={{ background: 'rgb(105, 105, 105)' }}
      >
        {showLogin ? (
          <>
            <Login />
            <div className="text-center mt-2">
              <span>Don't have an account? </span>
              <button
                onClick={handleToggle}
                className="text-blue-500 font-semibold underline"
              >
                Create one!
              </button>
            </div>
          </>
        ) : (
          <>
            <Signup />
            <div className="text-center mt-4">
              <span>Already have an account? </span>
              <button
                onClick={handleToggle}
                className="text-blue-500 font-semibold underline"
              >
                Sign in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Registration;
