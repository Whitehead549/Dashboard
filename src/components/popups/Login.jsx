import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Config/Config';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setSuccessMsg('Logged in successfully, redirecting...');
        setEmail('');
        setPassword('');
        setErrorMsg('');
        setTimeout(() => {
          setSuccessMsg('');
          navigate('/');
        }, 3000);
      })
      .catch((error) => {
        if (error.message.includes('network-request-failed')) {
          setErrorMsg('Please check your Internet connection.');
        } else if (error.message.includes('invalid-credential')) {
          setErrorMsg('Incorrect email or password.');
        } else {
          setErrorMsg(error.message);
        }
      });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="bg-white p-6 md:p-8 max-w-md w-full mx-auto mt-2">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Sign In</h1>
      {successMsg && (
        <div className="bg-green-50 border border-green-400 text-green-600 p-3 rounded mb-4">
          {successMsg}
        </div>
      )}
      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Sign In
        </button>
      </form>
      {errorMsg && (
        <div className="bg-red-50 border border-red-400 text-red-600 p-3 rounded mt-4">
          {errorMsg}
        </div>
      )}
    </div>
  );
};

export default Login;
