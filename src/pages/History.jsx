import React from 'react';

const History = () => {
  // Example data for different dates
  const historyData = [
    {
      date: '2024-09-20',
      totalEarnings: '$500',
      totalDeposits: '$1500',
      totalWithdrawals: '$300',
    },
    {
      date: '2024-09-21',
      totalEarnings: '$450',
      totalDeposits: '$1200',
      totalWithdrawals: '$400',
    },
    // Add more data as needed
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">History</h1>
      
      {historyData.map((entry, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-medium mb-4">{entry.date}</h2>
          
          <div className="flex flex-col space-y-4">
            <div className="bg-white shadow-md p-4 rounded-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold">Total Earnings</h3>
              <p className="text-xl">{entry.totalEarnings}</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold">Total Deposits</h3>
              <p className="text-xl">{entry.totalDeposits}</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold">Total Withdrawals</h3>
              <p className="text-xl">{entry.totalWithdrawals}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;

