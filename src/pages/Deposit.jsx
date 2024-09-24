import React, { useEffect, useState } from 'react';
import { db } from '../Config/Config'; // Adjust the import based on your file structure
import { collection, getDocs } from 'firebase/firestore';
import { FaCopy } from 'react-icons/fa'; // Importing the copy icon from react-icons

const Deposit = () => {
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

  const handleProceed = () => {
    if (selectedWallet && amount) {
      setProceed(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        alert('Wallet address copied to clipboard!'); // Alert the user
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const getInstructionNote = (walletType) => {
    switch (walletType) {
      case 'BITCOIN':
        return (
          <>
            • Send Only BITCOIN to this address.<br />
            • Sending any other coin may result in permanent loss.<br />
            • Account will be credited after confirmation.<br />
            • Ensure to click on the save deposit button below after sending the coin.
          </>
        );
      case 'USDT(TRC 20)':
        return (
          <>
            • Send Only USDT TETHER (TRC20) to this address.<br />
            • Sending any other coin may result in permanent loss.<br />
            • Account will be credited after confirmation.<br />
            • Ensure to click on the save deposit button below after sending the coin.
          </>
        );
      case 'USDT (ERC 20)':
        return (
          <>
            • Send Only USDT TETHER (ERC20) to this address.<br />
            • Sending any other coin may result in permanent loss.<br />
            • Account will be credited after confirmation.<br />
            • Ensure to click on the save deposit button below after sending the coin.
          </>
        );
      case 'ETHEREUM':
        return (
          <>
            • Send Only ETHEREUM to this address.<br />
            • Sending any other coin may result in permanent loss.<br />
            • Account will be credited after confirmation.<br />
            • Ensure to click on the save deposit button below after sending the coin.
          </>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-600">Loading wallets...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;

  return (
    <>
      <h1 className="text-3xl md:text-3xl font-bold text-gray-800 mb-8 font-sans">Deposit</h1>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-6 flex flex-col items-center">

        <div className="flex justify-center mb-8">
          <iframe
            src="https://lottie.host/embed/e1522f67-bcc6-4bd0-82ee-006ff594c65c/vSWZhyYART.json"
            className="w-full max-w-md h-64"
            title="Lottie Animation"
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-lg w-full transition-transform duration-300 transform hover:scale-105">
          {!proceed ? (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 font-sans">Select Your Wallet</h2>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2 font-sans" htmlFor="wallet-type">Wallet Type</label>
                <select
                  id="wallet-type"
                  className="w-full border rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 font-sans"
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
                  {/* Instruction about the minimum deposit amount */}
                  <p className="text-sm text-gray-700 mb-2">
                    The minimum deposit amount is <strong className="font-bold">$100</strong>
                  </p>

                  <label className="block text-gray-600 font-medium mb-2 font-sans" htmlFor="amount">
                    Enter Amount (in USD)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 font-sans"
                    placeholder="Enter amount"
                  />
                  </div>
              )}

              <button
                onClick={handleProceed}
                disabled={!selectedWallet || !amount}
                className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 font-roboto ${
                  !selectedWallet || !amount
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }`}
              >
                Proceed
              </button>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 font-sans">Transaction Summary</h2>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Selected Wallet Type:</span>
                <div className="text-lg font-semibold text-blue-600">{selectedWallet.walletType}</div>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Amount:</span>
                <div className="text-lg font-semibold text-blue-600">${amount}</div>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 font-sans">Wallet Address</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="text-sm font-mono p-2 bg-gray-100 rounded-lg border border-gray-300 mb-2 sm:mb-0">
                  {walletAddress}
                </div>
                <button onClick={copyToClipboard} className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  <FaCopy size={20} />
                </button>
              </div>

              {/* Conditional rendering of instruction notes */}
              <div className="mt-4 text-left text-gray-700 text-sm font-sans">
                {getInstructionNote(selectedWallet.walletType)}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <img
            src="https://www.freepngimg.com/thumb/bitcoin/63394-cryptocurrency-money-ethereum-bitcoin-download-hd-png.png"
            alt="Cryptocurrency representation"
            className="h-auto w-full max-w-xs md:max-w-sm lg:max-w-lg"
          />
        </div>
      </div>
    </>
  );
}

export default Deposit;
