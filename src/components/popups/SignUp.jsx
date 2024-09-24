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
    <div className="p-2 max-w-md w-full" style={{ background: 'rgb(105, 105, 105)' }}>
      {loading ? (
        // Loader spinner centered on the page
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 pl-8">
          <LoaderSpinner />
        </div>
      ) : (
        // Sign up form when not loading
        <>
          <h1 className="text-xl font-semibold mb-2 text-center">Sign up</h1>
          <hr className="mb-2" />
          {successMsg && (
            <div className="bg-green-100 text-green-700 p-2 mb-2 rounded">{successMsg}</div>
          )}
          <form className="space-y-3" autoComplete="off" onSubmit={handleSignup}>
            <div>
              <label htmlFor="fullName" className="block mb-1">
                Username
              </label>
              <input
                id="fullName"
                type="text"
                className="form-input w-full px-2 py-1 border rounded bg-gray-300 opacity-85"
                required
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input w-full px-2 py-1 border rounded bg-gray-400 opacity-70"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  className="form-input w-full px-2 py-1 border rounded bg-gray-400 opacity-70"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2 text-gray-600"
                >
                  {passwordVisible ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className={`bg-blue-600 text-gray-300 px-2 py-1 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                disabled={loading} // Disable button while loading
              >
                Sign up
              </button>
            </div>
          </form>
          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-2 mt-2 rounded">{errorMsg}</div>
          )}
        </>
      )}
    </div>
  );
};

export default Signup;
