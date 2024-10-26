import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Config/Config';
import { AtSign, Lock, Eye, EyeOff } from 'lucide-react'; // Import lucide-react icons

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
          navigate('/Dashboard');
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
    <div className="bg-white px-6 md:p-8 max-w-md w-full mx-auto mt-2 ">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Sign In</h1>
      {successMsg && (
        <div className="bg-green-50 border border-green-400 text-green-600 p-3 rounded mb-4">
          {successMsg}
        </div>
      )}
      <form className="space-y-6" onSubmit={handleLogin}>
        {/* Email Field */}
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <AtSign className="w-5 h-5 text-gray-400 mx-2" />
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border-0 focus:outline-none"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <Lock className="w-5 h-5 text-gray-400 mx-2" />
          <input
            id="password"
            type={passwordVisible ? "text" : "password"}
            className="w-full px-4 py-2 border-0 focus:outline-none"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-gray-600 mx-2"
          >
            {passwordVisible ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Forget Password Link */}
        <Link to="/Verifyempwd" className="text-blue-600 hover:underline ml-auto block text-right my=0">
          Forgot Password?
        </Link>

        {/* Sign In Button */}
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
