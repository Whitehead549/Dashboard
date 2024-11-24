import React, { useState } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Config/Config'; // Ensure Firebase is correctly initialized

const UploadPage = ({ amount,  onShowModal}) => {
  const [transactionHash, setTransactionHash] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);


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

    // Retrieve the dropped text (e.g., transaction hash)
    const text = e.dataTransfer.getData('text/plain');
    if (text) {
      setTransactionHash(text);
      setSaveStatus('Transaction hash ready to save');
    } else {
      setSaveStatus('Invalid transaction hash. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setTransactionHash(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    try {
      // Ensure the user is authenticated
      const user = auth.currentUser;
      if (!user) {
        onShowModal('You must be logged in to save a deposit.');
        return;
      }
  
      if (transactionHash.trim()) {
        setSaveStatus('Saving deposit...');
  
        // Fetch user details
        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userSnapshot = await getDocs(userQuery);
  
        if (userSnapshot.empty) {
          onShowModal('User details not found in the database.');
          return;
        }
  
        const userData = userSnapshot.docs[0].data();
        const { firstName, lastName } = userData;
  
        // Check for existing deposit
        const depositQuery = query(collection(db, 'deposits'), where('uid', '==', user.uid));
        const depositSnapshot = await getDocs(depositQuery);
  
        if (!depositSnapshot.empty) {
          const depositDoc = depositSnapshot.docs[0];
          await updateDoc(doc(db, 'deposits', depositDoc.id), {
            amount,
            transactionHash,
            status: 'pending',
            firstName,
            lastName,
          });
        } else {
          await addDoc(collection(db, 'deposits'), {
            uid: user.uid,
            amount,
            TotalAmount: 0,
            transactionHash,
            status: 'pending',
            firstName,
            lastName,
            createdAt: new Date(),
          });
        }
  
        setTransactionHash('');
        setSaveStatus('Deposit saved successfully!');
        onShowModal('Your deposit has been saved successfully.');
      } else {
        onShowModal('Invalid or empty transaction hash. Please Enter Tx Hash');
      }
    } catch (error) {
      onShowModal(`Failed to save deposit: ${error.message}`);
    } finally {
      // Ensure loading is stopped regardless of success or error
      setLoading(false);
    }
  };
  
  
  return (
    <div className="flex flex-col items-center justify-start md:p-8 max-w-xl w-full transition-transform duration-300 transform hover:scale-105 my-5 sm:my-5 md:my-5 lg:my-0">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
        {/* Transaction Hash Section */}
        <div className="bg-white shadow-md rounded-lg p-6 flex-grow">
          <h3 className="text-xl font-semibold text-gray-900">Transaction Hash</h3>
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
              <textarea
                value={transactionHash}
                onChange={handleInputChange}
                className="w-full h-24 border-none focus:outline-none resize-none"
                placeholder="Enter Tx Hash."
              />
            </div>
            {saveStatus && (
              <p
                className={`text-sm mt-2 ${
                  saveStatus.includes('success') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {saveStatus}
              </p>
            )}
            <button
              type="submit"
              className={`w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-900 transition duration-150 ${loading && "opacity-50 cursor-not-allowed"}`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Deposit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
