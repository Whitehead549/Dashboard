import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Lock, Phone, Globe, UserPlus, UserSquare } from 'lucide-react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../Config/Config'; // Adjust the import path

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [passwords, setPasswords] = useState({
    CurrentPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const data = await getDocs(q);
        if (!data.empty) {
          const userData = data.docs[0].data();
          setProfile((prev) => ({ ...prev, ...userData }));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const userDocRef = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
      const userDoc = await getDocs(userDocRef);
      if (!userDoc.empty) {
        await updateDoc(userDoc.docs[0].ref, profile);
        setAccountModalOpen(true); // Open modal on success
      }
    } catch (error) {
      setError(error.message);
    }
  };


  const handleSavePassword = async () => {
    if (!passwords.CurrentPassword) {
      setError('Current password is required!');
      return;
    }
  
    if (passwords.NewPassword !== passwords.ConfirmPassword) {
      setError('New passwords do not match!');
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('No user is currently signed in.');
        return;
      }
  
      const credential = EmailAuthProvider.credential(user.email, passwords.CurrentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwords.NewPassword);
      // Reset the passwords state to clear the fields
      setPasswords({
        CurrentPassword: '',
        NewPassword: '',
        ConfirmPassword: '',
      });
      // Optionally, clear any error messages
    setError('');
      setPasswordModalOpen(true); // Open modal on success
    } catch (error) {
      setError(error.message);
    }
  };
  

  return (
    <div className="flex flex-col container mx-auto p-4 md:p-6 min-h-screen overflow-y-auto mb-8 sm:mb-8 lg:mb-8">
      {/* Account Settings Section */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full mb-4 flex-grow">
        <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
      
        <div className="space-y-4">
          {['username', 'firstName', 'lastName', 'email', 'phoneNumber', 'country'].map((field, index) => (
            <div className="flex items-center" key={index}>
              {field === 'email' ? <Mail className="mr-2" /> : 
              field === 'username' ? <UserPlus className="mr-2" /> : 
              field === 'lastName' ? <UserSquare className="mr-2" /> : 
              field === 'phoneNumber' ? <Phone className="mr-2" /> : 
              field === 'country' ? <Globe className="mr-2" /> : 
              <User className="mr-2" />}

              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={profile[field] || ''}
                onChange={handleProfileChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-blue-800 transition"
            onClick={handleSaveProfile}
          >
            Save
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-gray-700 transition">
            Cancel
          </button>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-4 w-full">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <div className="space-y-4">
        {['CurrentPassword', 'NewPassword', 'ConfirmPassword'].map((field, index) => (
          <div className="flex items-center" key={index}>
            <Lock className="mr-2" />
            <input
              type="password"
              name={field} // Corrected name attribute
              value={passwords[field] || ''} // Ensure state is properly accessed
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
              placeholder={field.replace(/([A-Z])/g, ' $1')} // Adjust placeholder dynamically
            />
          </div>
        ))}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-blue-800 transition"
            onClick={handleSavePassword}
          >
            Update
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-gray-700 transition">
            Cancel
          </button>
        </div>
      </div>

      {/* Account Settings Modal */}
      {accountModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h2 className="text-lg font-semibold">Profile Updated!</h2>
            <p className="mt-2">Your account settings have been updated successfully.</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              onClick={() => setAccountModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Password Update Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h2 className="text-lg font-semibold">Password Updated!</h2>
            <p className="mt-2">Your password has been updated successfully.</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              onClick={() => setPasswordModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;


