import React, { useEffect, useState } from 'react';
import { db } from '../Config/Config'; // Adjust the import based on your file structure
import { collection, getDocs } from 'firebase/firestore';
import { FaCopy } from 'react-icons/fa'; // Importing the copy icon from react-icons
import UploadPage from '../components/Essentials/UploadPage';


const Deposit = () => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proceed, setProceed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const MINIMUM_DEPOSIT = 100;

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
    if (amount < MINIMUM_DEPOSIT) {
      setShowAlert(true);
    } else if (selectedWallet && amount >= MINIMUM_DEPOSIT) {
      setProceed(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        setShowCopyAlert(true);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const getInstructionNote = (walletType) => {
    switch (walletType) {
      case 'BITCOIN':
        return (
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Send Only BITCOIN to this address.</li>
            <li>Sending any other coin may result in permanent loss.</li>
            <li>Account will be credited after confirmation.</li>
            <li>Ensure to click on the save deposit button below after sending the coin.</li>
          </ul>
        );
      case 'USDT(TRC 20)':
        return (
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Send Only USDT TETHER (TRC20) to this address.</li>
            <li>Sending any other coin may result in permanent loss.</li>
            <li>Account will be credited after confirmation.</li>
            <li>Ensure to click on the save deposit button below after sending the coin.</li>
          </ul>
        );
      case 'USDT (ERC 20)':
        return (
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Send Only USDT TETHER (ERC20) to this address.</li>
            <li>Sending any other coin may result in permanent loss.</li>
            <li>Account will be credited after confirmation.</li>
            <li>Ensure to click on the save deposit button below after sending the coin.</li>
          </ul>
        );
      case 'ETHEREUM':
        return (
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Send Only ETHEREUM to this address.</li>
            <li>Sending any other coin may result in permanent loss.</li>
            <li>Account will be credited after confirmation.</li>
            <li>Ensure to click on the save deposit button below after sending the coin.</li>
          </ul>
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
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-6 flex flex-col items-center sm:mr-4">

        {/* Custom Alert Modal for Minimum Deposit Validation */}
        {showAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Invalid Deposit Amount</h2>
              <p className="text-gray-600 mb-4">The minimum deposit amount should be <strong className="font-bold">$100</strong>.</p>
              <button
                onClick={() => setShowAlert(false)} // Close the modal
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Custom Alert Modal for Copy Confirmation */}
        {showCopyAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Address Copied</h2>
              <p className="text-gray-600 mb-4">The wallet address has been copied to your clipboard.</p>
              <button
                onClick={() => setShowCopyAlert(false)} // Close the modal
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

          {/* Amount and status section */}
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-lg w-full transition-transform duration-300 transform hover:scale-105 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 font-sans">Transaction Details</h2>
        <div className="flex justify-between mb-4">
          {/* Amount Section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700">Amount</h3>
            <p className="text-lg  text-green-600">${amount}</p>
          </div>

          {/* Status Section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700">Status</h3>
            <p className="text-lg  text-yellow-600">Pending</p>
          </div>
        </div>
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
                  <p className="text-sm text-gray-700 mb-2">
                    The minimum deposit amount is <strong className="font-bold">$100</strong>
                  </p>

                  <label className="block text-gray-600 font-medium mb-2 font-sans" htmlFor="amount">
                    Enter Amount (In USD)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 font-sans"
                    placeholder="Enter amount"
                    min={MINIMUM_DEPOSIT}
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
            <h2 className="text-xl font-semibold mb-2 text-gray-800 font-sans">Transaction Summary</h2>
            <div className="mb-1">
              <span className="font-medium text-gray-700">Selected Wallet Type:</span>
              <div className="text-base font-semibold text-blue-600">{selectedWallet.walletType}</div>
            </div>
            <div className="mb-1">
              <span className="font-medium text-gray-700">Amount:</span>
              <div className="text-base font-semibold text-blue-600">${amount}</div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 font-sans">Wallet Address</h2>
            <div className="flex items-center justify-center gap-1">
              <div className="text-sm font-mono p-1 bg-gray-100 rounded-lg border border-gray-300 mb-1 sm:mb-0">
                {walletAddress}
              </div>
              <button onClick={copyToClipboard} className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <FaCopy size={20} />
              </button>
            </div>
            <div className="text-sm text-gray-600 mt-2">{getInstructionNote(selectedWallet.walletType)}</div>
          </div>
          
          )}
        </div>
      
        <UploadPage/>
        
   
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
