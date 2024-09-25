import React, { useState, useEffect } from 'react';
import Signup from '../components/popups/SignUp';
import Login from '../components/popups/Login';
import Translate from '../components/Translate';

const Registration = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showPopup, setShowPopup] = useState(true); // State for popup visibility

  // useEffect to reload the page once on initial visit
  useEffect(() => {
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    }
  }, []);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  };

  const handleProceed = () => {
    setShowPopup(false); // Close the popup
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mx-2 relative z-10">
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-95">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome!</h2>
              <p className="text-gray-600 mb-4">Is your default language English? Click below to proceed, or select another language first.</p>
              <Translate />
              <button
                onClick={handleProceed}
                className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-200"
              >
                Proceed
              </button>
            </div>
          </div>
        )}

        {showLogin ? (
          <>
            <Login />
            <div className="text-center py-2">
              <p className="text-gray-700 text-sm md:text-base">Don't Have An Account?</p>
              <button
                onClick={handleToggle}
                className="text-blue-600 hover:underline font-semibold"
              >
                Create An Account
              </button>
            </div>
          </>
        ) : (
          <>
            <Signup />
            <div className="text-center py-2">
              <p className="text-gray-700 text-sm md:text-base">Already Have An Account?</p>
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

