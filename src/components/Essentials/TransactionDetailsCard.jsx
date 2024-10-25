import React, { useEffect, useState } from 'react';
import { db } from '../../Config/Config'; // Adjust the import based on your file structure
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth } from '../../Config/Config'; // Assuming you are using Firebase Auth

const TransactionDetailsCard = () => {
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState(''); // Set a default status
  const [error, setError] = useState(null); // Error state for better error handling

  useEffect(() => {
    const user = auth.currentUser; // Assuming Firebase Auth is used for authentication

    if (user) {
      const uid = user.uid; // Get the logged-in user's UID

      // Real-time subscription to the user's withdraws collection
      const withdrawsCollection = collection(db, 'withdraws');
      const userWithdrawsQuery = query(withdrawsCollection, where('uid', '==', uid)); // Query withdraws for this user

      const unsubscribe = onSnapshot(
        userWithdrawsQuery,
        (snapshot) => {
          const withdrawsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          if (withdrawsData.length > 0) {
            // Assuming you want the first document's amount and status
            const latestWithdraw = withdrawsData[0]; // Adjust logic here if needed
            setAmount(latestWithdraw.amountWithdraw || 0); // Safely handle undefined
            setStatus(latestWithdraw.status || 'No status'); // Safely handle undefined
          } else {
            setAmount(0); // Handle no withdrawals
            setStatus('None');
          }
        },
        (error) => {
          console.error('Error fetching withdraws: ', error);
          setError('Failed to fetch withdraw data'); // Add error handling for withdraws
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      setError('User not authenticated');
    }
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 md:p-8  w-full transition-transform duration-300 transform hover:scale-105
       max-w-md mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 font-sans">Transaction Details</h2>
      <div className="flex justify-between mb-4">
        {/* Amount Section */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700">Amount</h3>
          <p className="text-lg text-green-600">${amount}</p>
        </div>

        {/* Status Section */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700">Status</h3>
          <p className="text-lg text-yellow-600">
            {status === "approved" ? "None" : status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsCard;
