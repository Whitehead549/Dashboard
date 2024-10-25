import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../Config/Config'; // Firebase configuration

const History = () => {
  // State to manage which tab is selected (Deposits or Withdrawals)
  const [activeTab, setActiveTab] = useState('Deposits');
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch transaction history from Firestore
  const fetchTransactions = async () => {
    try {
      const user = auth.currentUser; // Get current user
      if (user) {
        const uid = user.uid; // Get the user's unique ID
        const transHistoryRef = doc(db, 'TransHistory', uid); // Reference to user's transaction history document
        const transHistoryDoc = await getDoc(transHistoryRef); // Fetch the document

        if (transHistoryDoc.exists()) {
          const data = transHistoryDoc.data();

          // Log the data fetched to verify its structure
          console.log('Fetched data:', data);

          // Fetch the depositTrans and withdrawlTrans arrays from the document
          const depositTransactions = data.depositTrans || [];
          const withdrawalTransactions = data.withdrawlTrans || []; // Correct key: 'withdrawlTrans'

          // Log both arrays to check if they are being retrieved correctly
          console.log('Fetched depositTrans:', depositTransactions);
          console.log('Fetched withdrawlTrans:', withdrawalTransactions);

          // Update the state with the fetched data
          setDeposits(depositTransactions);
          setWithdrawals(withdrawalTransactions);
        } else {
          console.log('No transaction history found.');
        }
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  // Fetch the data when the component mounts
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Determine which data to display based on the active tab
  const displayedData = activeTab === 'Deposits' ? deposits : withdrawals;

  // Show a loading message while fetching data
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
