import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Firebase auth listener
import { auth, db } from '../Config/Config'; // Firebase configuration

const History = () => {
  const [activeTab, setActiveTab] = useState('Deposits');
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for transaction history
  const subscribeToTransactions = (user) => {
    const uid = user.uid; // Get the user's unique ID
    const transHistoryRef = doc(db, 'TransHistory', uid); // Reference to user's transaction history document

    // Set up real-time listener with Firestore
    const unsubscribe = onSnapshot(
      transHistoryRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          console.log('Real-time update:', data); // Log updates for debugging

          // Update state with new transaction data
          setDeposits(data.depositTrans || []);
          setWithdrawals(data.withdrawlTrans || []); // Correct key: 'withdrawlTrans'
        } else {
          console.log('No transaction history found.');
          setDeposits([]);
          setWithdrawals([]);
        }
        setLoading(false); // Data is now loaded
      },
      (error) => {
        console.error('Error listening to real-time updates:', error);
        setLoading(false); // Stop loading even if an error occurs
      }
    );

    return unsubscribe; // Return the unsubscribe function to clean up the listener
  };

  // Handle Firebase auth state change and set up Firestore listener
  useEffect(() => {
    let unsubscribeFromFirestore = null;

    const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribeFromFirestore = subscribeToTransactions(user); // Start listening to Firestore updates
      } else {
        console.log('No user is signed in.');
        setDeposits([]);
        setWithdrawals([]);
        setLoading(false);
      }
    });

    // Clean up both listeners on component unmount
    return () => {
      if (unsubscribeFromFirestore) unsubscribeFromFirestore();
      unsubscribeFromAuth();
    };
  }, []);

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const displayedData = activeTab === 'Deposits' ? deposits : withdrawals;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Transaction History</h1>

      {/* Toggle Buttons */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => handleTabClick('Deposits')}
          className={`px-6 py-3 rounded-md transition-colors duration-300 ${
            activeTab === 'Deposits'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Deposits
        </button>
        <button
          onClick={() => handleTabClick('Withdrawals')}
          className={`px-6 py-3 rounded-md transition-colors duration-300 ${
            activeTab === 'Withdrawals'
              ? 'bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Withdrawals
        </button>
      </div>

      {/* Table for displaying data */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="py-3 px-5 border-b text-blue-900 font-medium">Date</th>
              <th className="py-3 px-5 border-b text-blue-900 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.length > 0 ? (
              displayedData.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-5 border-b text-gray-800">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-5 border-b text-gray-800">
                    ${transaction.amount.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-3 px-5 border-b text-center text-gray-600" colSpan="2">
                  No transactions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
