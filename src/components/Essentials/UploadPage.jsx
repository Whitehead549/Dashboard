import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Config/Config'; // Ensure Firebase is correctly initialized

const UploadPage = ({ amount }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadStatus('File ready to upload');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus('File ready to upload');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the user is authenticated
    const user = auth.currentUser;
    if (!user) {
      setUploadStatus('User not authenticated.');
      return;
    }

    if (file) {
      try {
        // Start upload process
        setUploadStatus('Uploading...');
        const storageRef = ref(getStorage(), `proofs/${user.uid}/${file.name}`);

        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Fetch user's firstName and lastName from the 'users' collection
        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          setUploadStatus('User details not found.');
          return;
        }

        // Assuming user details are stored in the first document found
        const userData = userSnapshot.docs[0].data();
        const { firstName, lastName } = userData;

        // Check if a deposit already exists for the user
        const depositQuery = query(collection(db, 'deposits'), where('uid', '==', user.uid));
        const depositSnapshot = await getDocs(depositQuery);

        if (!depositSnapshot.empty) {
          // If deposit exists, update it with the new data
          const depositDoc = depositSnapshot.docs[0]; // Assuming only one deposit document exists for simplicity
          await updateDoc(doc(db, 'deposits', depositDoc.id), {
            amount,
            proofOfPayment: downloadURL,
            status: 'pending',
            firstName,
            lastName,
          });
        } else {
          // If deposit does not exist, create a new one
          await addDoc(collection(db, 'deposits'), {
            uid: user.uid,
            amount,
            TotalAmount: 0, // Initial value for TotalAmount
            proofOfPayment: downloadURL,
            status: 'pending',
            firstName,
            lastName,
            createdAt: new Date(),
          });
        }

        setUploadStatus('Upload successful! Deposit registered.');
        setFile(null); // Reset file input
      } catch (error) {
        setUploadStatus(`Upload failed: ${error.message}`);
      }
    } else {
      setUploadStatus('Please select a file before uploading.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:p-8 max-w-xl w-full transition-transform duration-300 transform hover:scale-105 my-5 sm:my-5 md:my-5 lg:my-0">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
        {/* Upload Proof of Payment Section */}
        <div className="bg-white shadow-md rounded-lg p-6 flex-grow">
          <h3 className="text-xl font-semibold text-gray-900">Upload Proof of Payment</h3>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div
              className={`border-dashed border-2 p-6 rounded-lg text-center cursor-pointer hover:border-blue-600 transition duration-150 ${
                dragActive ? 'border-blue-600 bg-blue-100' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="fileInput"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                {file ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="h-12 w-12 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                      />
                    </svg>
                    <span className="ml-3 text-sm text-gray-700">{file.name}</span>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="h-16 w-16 mx-auto text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-700">Drag and drop or click to upload</p>
                  </div>
                )}
              </label>
            </div>
            {uploadStatus && (
              <p
                className={`text-sm mt-2 ${
                  uploadStatus.includes('success') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {uploadStatus}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-900 transition duration-150"
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
