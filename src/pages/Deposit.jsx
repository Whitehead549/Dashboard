import React, { useEffect, useState } from 'react';
import { db } from '../Config/Config'; // Adjust the import based on your file structure
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { FaCopy } from 'react-icons/fa'; // Importing the copy icon from react-icons
import UploadPage from '../components/Essentials/UploadPage';
import { auth } from '../Config/Config'; // Assuming you are using Firebase Auth
import Modal from '../components/Essentials/Modal'; // Path to the Modal component

const Deposit = () => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState(''); // Ensure it's a string to handle empty state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proceed, setProceed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [status, setStatus] = useState('');
  const MINIMUM_DEPOSIT = 100;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

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

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = auth.onAuthStateChanged((user) => { // CHANGE 1: Using onAuthStateChanged
      if (user) {
        const uid = user.uid; // Get the logged-in user's UID
  
        // Real-time subscription to the user's deposits collection
        const depositsCollection = collection(db, 'deposits');
        const userDepositsQuery = query(depositsCollection, where('uid', '==', uid)); // Query deposits for this user
  
        const unsubscribeDeposits = onSnapshot(
          userDepositsQuery,
          (snapshot) => {
            const depositsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
            if (depositsData.length > 0) {
              const latestDeposit = depositsData[0];
              setAmount(latestDeposit.amount || '0');
              setStatus(latestDeposit.status || 'No status');
            } else {
              setAmount('0');
              setStatus('None');
            }
          },
          (error) => {
            console.error('Error fetching deposits: ', error);
            setError('Failed to fetch deposit data');
          }
        );
  
        // Cleanup deposits subscription on unmount
        return () => unsubscribeDeposits(); // CHANGE 2: Unsubscribe from deposits on unmount
      } else {
        setError('User not authenticated');
        setLoading(false);
      }
    });
  
    // Cleanup auth subscription on unmount
    return () => unsubscribeAuth(); // CHANGE 3: Unsubscribe from auth listener on unmount
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
            <li>Send only BITCOIN to this address.</li>
            <li>Sending any other coin may result in permanent loss.</li>
            <li>Account will be credited after confirmation.</li>
            <li>For verification purposes, please upload the payment proof.</li>
          </ul>
        );
      case 'USDT(TRC 20)':
        return (
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Send only USDT TETHER (TRC20) to this address.</li>
            <li>Sending any other coin may result in permanent loss.</li>
            <li>Account will be credited after confirmation.</li>
            <li>For verification purposes, please upload the payment proof.</li>
          </ul>
        );
      case 'USDT (ERC 20)':
        return (
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Send only USDT TETHER (ERC20) to this address.</li>
            <li>Sending any other coin may result in permanent loss.</li>
            <li>Account will be credited after confirmation.</li>
            <li>For verification purposes, please upload the payment proof.</li>
          </ul>
        );
      case 'ETHEREUM':
        return (
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Send only ETHEREUM to this address.</li>
            <li>Sending any other coin may result in permanent loss.</li>
            <li>Account will be credited after confirmation.</li>
            <li>For verification purposes, please upload the payment proof.</li>
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
  <h2 className="text-xl font-semibold mb-4 text-gray-800 font-sans">Transaction Summary</h2>
  <div className="mb-4">
    <span className="font-medium text-gray-700 block">Selected Wallet Type:</span>
    <div className="text-base font-semibold text-blue-600 break-words">
      {selectedWallet.walletType}
    </div>
  </div>
  <div className="mb-4">
    <span className="font-medium text-gray-700 block">Amount:</span>
    <div className="text-base font-semibold text-blue-600">
      ${amount}
    </div>
  </div>
  <h2 className="text-xl font-semibold mb-4 text-gray-800 font-sans">Wallet Address</h2>
  <div className="flex flex-wrap items-center justify-center gap-2">
    <div className="text-sm font-mono p-2 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden max-w-full break-all">
      {walletAddress}
    </div>
    <button
  onClick={copyToClipboard}
  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
>
  <FaCopy size={20} />
  <span className="text-sm font-medium">Copy</span>
</button>

  </div>
  <div className="text-sm text-gray-600 mt-4 max-w-prose mx-auto">
    {getInstructionNote(selectedWallet.walletType)}
  </div>
</div>

          
          )}
        </div>
      
        {proceed  && (<UploadPage amount={amount} onShowModal={showModal}/>)}
        
   
      <div className='my-4'>

      </div>
      {/* Render the Modal in the parent */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Result"
        message={modalMessage}
      />
      </div>
    </>
  );
}

export default Deposit;