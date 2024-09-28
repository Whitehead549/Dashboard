import React, { useState, useEffect } from "react";

const Withdraws = () => {
  const [walletType, setWalletType] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleProceed = () => {
    // Handle the withdrawal process
    console.log("Proceed with withdrawal:", { walletType, walletAddress, amount });
  };

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Withdraws</h1>
      <div className="flex flex-col items-center justify-center">
        {/* Card for Account Balance */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-4 w-full max-w-md"> {/* Reduced mb-8 to mb-4 */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Balance</h2>
          <p className="text-2xl font-bold text-gray-900">$2000</p> {/* Example balance */}
        </div>

        {/* Form Inputs */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-8 sm:my-8 lg:my-8">
          {/* Wallet Type */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Wallet Type</label>
            <input
              type="text"
              placeholder="Enter wallet type"
              value={walletType}
              onChange={(e) => setWalletType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Wallet Address */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Wallet Address</label>
            <input
              type="text"
              placeholder="Enter wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Amount with Note */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Note: The minimum amount you can withdraw is $100. A management fee of 5% will be deducted.
            </p>
            <label className="block text-gray-700 mb-2">Amount (In USD)</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Proceed
          </button>
        </div>
      </div>

    </>
  );
};

export default Withdraws;
