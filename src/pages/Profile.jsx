import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Lock, Phone, Globe, UserPlus, UserSquare } from 'lucide-react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../Config/Config'; // Adjust the import path

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const storage = getStorage();

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadPicture = async () => {
    if (!file) {
      setError('Please select an image file to upload.');
      return;
    }

    setLoading(true);
    const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userDocRef = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
      const userDoc = await getDocs(userDocRef);
      if (!userDoc.empty) {
        await updateDoc(userDoc.docs[0].ref, { avatar: downloadURL });
      }

      setProfile((prev) => ({ ...prev, avatar: downloadURL }));
      setAccountModalOpen(true); // Open modal on success
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('No user is currently signed in.');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, passwords.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwords.newPassword);
      setPasswordModalOpen(true); // Open modal on success
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="h-full flex flex-col container mx-auto p-4 md:p-6 overflow-y-auto">
      {/* Account Settings Section */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full mb-8 flex-grow">
        <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
        <div className="flex flex-col md:flex-row items-center mb-6">
          <img
            src={profile.avatar || 'https://via.placeholder.com/150'} // Placeholder for default avatar
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full border border-gray-300"
          />
          <div className="mt-4 md:mt-0 md:ml-4">
            <label className="cursor-pointer flex items-center bg-gray-500 text-white px-2 py-2 rounded-md hover:bg-blue-700 transition mb-2">
              <Camera className="mr-2" />
              Select Photo
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            <button
              className={`bg-blue-600 text-white px-4 py-2 rounded-lg ml-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition'
              }`}
              onClick={handleUploadPicture}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
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
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-blue-700 transition"
            onClick={handleSaveProfile}
          >
            Save Changes
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-gray-700 transition">
            Cancel
          </button>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-full">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <div className="space-y-4">
          {['currentPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
            <div className="flex items-center" key={index}>
              <Lock className="mr-2" />
              <input
                type="password"
                name={field}
                value={passwords[field]}
                onChange={handlePasswordChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
                placeholder={field.replace(/([A-Z])/g, ' $1').replace(/Password/, ' Password')}
              />
            </div>
          ))}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-blue-700 transition"
            onClick={handleSavePassword}
          >
            Update Password
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-gray-700 transition">
            Cancel
          </button>
        </div>
      </div>

      {/* Account Settings Modal */}
      {accountModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Profile Updated Successfully!</h3>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
              onClick={() => setAccountModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Password Updated Successfully!</h3>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
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

