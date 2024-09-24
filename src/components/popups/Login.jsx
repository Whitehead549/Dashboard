import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Config/Config';


const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setSuccessMsg('Logged in successfully, you will be redirected to homepage');

        setEmail('');
        setPassword('');
        setErrorMsg('');
        setTimeout(() => {
          setSuccessMsg('');
          navigate('/');
        }, 3000);
      })
      .catch((error) => {
        if (error.message === 'Firebase: Error (auth/network-request-failed).') {
          setErrorMsg('Check if you have an Internet connection');
        } else if (error.message === 'Firebase: Error (auth/invalid-credential).') {
          setErrorMsg('Email or password incorrect');
        } else {
          setErrorMsg(error.message);
        }
      });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    
    <div className="p-2 max-w-md w-full" style={{ background: 'rgb(105, 105, 105)' }}
>
        <h1 className="text-2xl font-semibold mb-4 text-center">Sign in</h1>
        <hr className="mb-4" />
        {successMsg && (
            <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMsg}</div>
        )}
        <form className="space-y-4" autoComplete="off" onSubmit={handleLogin}>
            <div>
                <label htmlFor="email" className="block mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    className="form-input w-full px-3 py-2 border rounded bg-gray-400 opacity-70"
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
                        className="form-input w-full px-3 py-2 border rounded bg-gray-400 opacity-70"
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
            <div className="flex justify-end items-center">
                <button type="submit" className="bg-blue-600 text-gray-300 px-2 py-1 rounded hover:bg-blue-600">
                Sign in
                </button>
            </div>
        </form>
        {errorMsg && <div className="bg-red-100 text-red-700 p-3 mt-4 rounded">{errorMsg}</div>}
    </div>
  
    
  );
};

export default Login;
