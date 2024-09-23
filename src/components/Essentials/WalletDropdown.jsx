import React, { useEffect, useState } from 'react';
import { db } from '../../Config/Config'; // Adjust the import based on your file structure
import { collection, getDocs } from 'firebase/firestore';

const WalletDropdown = () => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proceed, setProceed] = useState(false);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const walletCollection = collection(db, 'wallets');
        const walletSnapshot = await getDocs(walletCollection);
        const walletList = walletSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWallets(walletList);
      } catch (err) {
        setError('Failed to fetch wallets');
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  // Function to handle wallet selection
  const handleWalletSelect = (event) => {
    const selectedWalletType = event.target.value;
    const selectedWallet = wallets.find(wallet => wallet.walletType === selectedWalletType);

    if (selectedWallet) {
      setSelectedWallet(selectedWallet);
      setWalletAddress(selectedWallet.walletAddress);
    } else {
      setSelectedWallet(null);
      setWalletAddress('');
    }
  };

  // Function to handle proceed button click
  const handleProceed = () => {
    if (selectedWallet && amount) {
      setProceed(true);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-600">Loading wallets...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen px-6 mt-0 pt-0">
      {!proceed ? (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full transform transition-all duration-300">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Select Your Wallet</h1>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2" htmlFor="wallet-type">Wallet Type</label>
            <select
              id="wallet-type"
              className="w-full border rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              onChange={handleWalletSelect}
              defaultValue=""
            >
              <option value="" disabled>Select Wallet Type</option>
              {wallets.map(wallet => (
                <option key={wallet.id} value={wallet.walletType}>
                  {wallet.walletType}
                </option>
              ))}
            </select>
          </div>

          {selectedWallet && (
            <div className="mb-6">
              <label className="block text-gray-600 font-medium mb-2" htmlFor="amount">Enter Amount</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                placeholder="Enter amount"
              />
            </div>
          )}

          <button
            onClick={handleProceed}
            disabled={!selectedWallet || !amount}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
              !selectedWallet || !amount
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
          >
            Proceed
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full transform transition-all duration-300 text-center">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">Wallet Address</h1>
          <div className="text-lg font-mono p-4 bg-gray-100 rounded-lg border border-gray-300">
            {walletAddress}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDropdown;
