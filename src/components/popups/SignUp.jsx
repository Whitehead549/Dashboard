import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../Config/Config';
import { collection, addDoc } from 'firebase/firestore';
import LoaderSpinner from '../Essentials/LoaderSpinner'; // Import the LoaderSpinner component

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before signup process starts

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Adding user to Firestore
      await addDoc(collection(db, 'users'), {
        fullName: fullName,
        email: email,
        uid: user.uid,
      });

      setSuccessMsg(`Signed up as ${user.email}`);
      setFullName('');
      setEmail('');
      setPassword('');
      setErrorMsg('');

      setTimeout(() => {
        setSuccessMsg('');
        navigate('/');
      }, 3000);
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setErrorMsg('Invalid email address');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('Email already in use');
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters');
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(false); // Set loading to false after signup process completes (success or failure)
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="bg-white px-6 py-4 sm:p-8 md:p-10 lg:p-6 max-w-md w-full mx-auto ">
      {loading ? (
        // Loader spinner centered on the page
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <LoaderSpinner />
        </div>
      ) : (
        // Sign up form when not loading
        <>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">Sign Up</h1>
          <hr className="mb-4" />
          {successMsg && (
            <div className="bg-green-50 border border-green-400 text-green-600 p-3 rounded mb-4">
              {successMsg}
            </div>
          )}
          <form className="space-y-6" autoComplete="off" onSubmit={handleSignup}>
            <div>
              <label htmlFor="fullName" className="block text-gray-700 mb-2">Username</label>
              <input
                id="fullName"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-2 text-gray-600"
                >
                  {passwordVisible ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading} // Disable button while loading
            >
              Sign Up
            </button>
          </form>
          {errorMsg && (
            <div className="bg-red-50 border border-red-400 text-red-600 p-3 rounded mt-4">
              {errorMsg}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Signup;
