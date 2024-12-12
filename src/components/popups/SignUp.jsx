import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../Config/Config';
import { collection, addDoc } from 'firebase/firestore';
import LoaderSpinner from '../Essentials/LoaderSpinner'; // Import the LoaderSpinner component
import { User, AtSign, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react'; // Import lucide-react icons

const Signup = () => {
  const navigate = useNavigate();

  // State management for the form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false); // State for checkbox

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple password confirmation check
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Adding user to Firestore
      await addDoc(collection(db, 'users'), {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        country,
        uid: user.uid,
      });

      setSuccessMsg(`Signed up as ${user.email}`);
      // Clear form
      setFirstName('');
      setLastName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhoneNumber('');
      setCountry('');
      setErrorMsg('');
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/Dashboard');
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
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="bg-white px-6 md:p-8 max-w-md w-full mx-auto mt-2">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Sign Up</h1>
      {successMsg && (
        <div className="bg-green-50 border border-green-400 text-green-600 p-3 rounded mb-4">
          {successMsg}
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSignup}>
        {/* First Name */}
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <User className="w-5 h-5 text-gray-400 mx-2" />
          <input
            id="firstName"
            type="text"
            className="w-full px-4 py-2 border-0 focus:outline-none"
            placeholder="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last Name */}
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <User className="w-5 h-5 text-gray-400 mx-2" />
          <input
            id="lastName"
            type="text"
            className="w-full px-4 py-2 border-0 focus:outline-none"
            placeholder="Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Username */}
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <User className="w-5 h-5 text-gray-400 mx-2" />
          <input
            id="username"
            type="text"
            className="w-full px-4 py-2 border-0 focus:outline-none"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <AtSign className="w-5 h-5 text-gray-400 mx-2" />
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border-0 focus:outline-none"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <Lock className="w-5 h-5 text-gray-400 mx-2" />
          <input
            id="password"
            type={passwordVisible ? "text" : "password"}
            className="w-full px-4 py-2 border-0 focus:outline-none"
            placeholder="Password"
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

        {/* Confirm Password */}
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <Lock className="w-5 h-5 text-gray-400 mx-2" />
          <input
            id="confirmPassword"
            type={passwordVisible ? "text" : "password"}
            className="w-full px-4 py-2 border-0 focus:outline-none"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <Phone className="w-5 h-5 text-gray-400 mx-2" />
          <input
            id="phoneNumber"
            type="tel"
            className="w-full px-4 py-2 border-0 focus:outline-none"
            placeholder="Phone Number"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Country */}
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <MapPin className="w-5 h-5 text-gray-400 mx-2" />
          <input
            id="country"
            type="text"
            className="w-full px-4 py-2 border-0 focus:outline-none"
            placeholder="Country"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            className="mr-2 mt-1"
            checked={isTermsAccepted}
            onChange={() => setIsTermsAccepted(!isTermsAccepted)}
          />
          <label htmlFor="terms" className="text-gray-700 text-sm">
           <span className="font-bold">I Agree To The </span> 
            <a href="https://www.selmabriggswilson.xyz/termsandconditions.html" target="_blank" className="text-blue-600 hover:underline">
                     Terms and Conditions
                </a>
                &nbsp;&&nbsp;
                <a href="https://www.selmabriggswilson.xyz/privacypolicy/privacypolicy.html" target="_blank" className="text-blue-600 hover:underline">
                    Privacy Policy
                </a>.
          </label>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 ${loading || !isTermsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading || !isTermsAccepted}
        >
          {loading ? <LoaderSpinner /> : 'Sign Up'}
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

export default Signup;
