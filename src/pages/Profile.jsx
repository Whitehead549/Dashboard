import React, { useState } from 'react';
import { User, Mail, Building, Camera, Lock } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: 'nmaxwell',
    name: 'Nelle Maxwell',
    email: 'nmaxwell@mail.com',
    company: 'Company Ltd.',
    avatar: 'https://bootdey.com/img/Content/avatar/avatar1.png',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle profile changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // Mock save functions
  const handleSaveProfile = () => {
    alert('Profile saved successfully');
    // Save logic (e.g., API call)
  };

  const handleSavePassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password updated successfully');
    // Save logic (e.g., API call)
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Account Settings Section */}
      <div className="bg-white p-4 md:p-6 rounded-md shadow-md w-full">
        <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
        <div className="flex flex-col md:flex-row items-center mb-6">
          <img
            src={profile.avatar}
            alt="Profile Avatar"
            className="w-20 h-20 rounded-full"
          />
          <div className="mt-4 md:mt-0 md:ml-4">
            <label className="cursor-pointer flex items-center bg-blue-500 text-white px-4 py-2 rounded-md">
              <Camera className="mr-2" />
              Upload new photo
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center">
            <User className="mr-2" />
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              className="border px-4 py-2 rounded-md w-full"
              placeholder="Username"
            />
          </div>
          <div className="flex items-center">
            <User className="mr-2" />
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="border px-4 py-2 rounded-md w-full"
              placeholder="Name"
            />
          </div>
          <div className="flex items-center">
            <Mail className="mr-2" />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="border px-4 py-2 rounded-md w-full"
              placeholder="Email"
            />
          </div>
          <div className="flex items-center">
            <Building className="mr-2" />
            <input
              type="text"
              name="company"
              value={profile.company}
              onChange={handleProfileChange}
              className="border px-4 py-2 rounded-md w-full"
              placeholder="Company"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
            onClick={handleSaveProfile}
          >
            Save Changes
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md w-full md:w-auto">
            Cancel
          </button>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white p-4 md:p-6 rounded-md shadow-md mt-8 w-full">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <Lock className="mr-2" />
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="border px-4 py-2 rounded-md w-full"
              placeholder="Current Password"
            />
          </div>
          <div className="flex items-center">
            <Lock className="mr-2" />
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="border px-4 py-2 rounded-md w-full"
              placeholder="New Password"
            />
          </div>
          <div className="flex items-center">
            <Lock className="mr-2" />
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="border px-4 py-2 rounded-md w-full"
              placeholder="Confirm New Password"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
            onClick={handleSavePassword}
          >
            Update Password
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md w-full md:w-auto">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
