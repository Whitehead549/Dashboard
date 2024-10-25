import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, onSnapshot } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import { auth } from "../Config/Config"; // Firebase auth
import Modal from "../components/popups/Modal"; // Import the Modal component
import TransactionDetailsCard from "../components/Essentials/TransactionDetailsCard";

const Withdraws = () => {
  const [walletType, setWalletType] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0); // State for account balance
  const db = getFirestore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [withdrawId, setWithdrawId] = useState(null); // State to hold the ID of the withdrawal

  // Authenticate user when they visit the page
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Set authenticated user
        fetchAccountBalance(user.uid); // Fetch account balance on user login
      } else {
        // If not authenticated, redirect to login page
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchAccountBalance = async (userId) => {
    const accountRef = doc(db, "AccountBalance", userId);
    const accountSnap = await getDoc(accountRef);

    if (accountSnap.exists()) {
      const { TotalAccountBalance } = accountSnap.data();
      setAccountBalance(TotalAccountBalance); // Set account balance state
    } else {
      setError("Account balance not found.");
    }
  };

  const validateForm = () => {
    if (!walletType || !walletAddress || !amount) {
      setError("Please fill in all fields.");
      return false;
    }
    if (parseFloat(amount) < 100) {
      setError("The minimum amount to withdraw is $100.");
      return false;
    }
    return true;
  };

  const handleProceed = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!user) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const userId = user.uid;

      // Step 5: Fetch user details from the 'users' collection
      const userQuery = query(collection(db, "users"), where("uid", "==", userId));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        setError("User details not found in the 'users' collection.");
        setLoading(false);
        return;
      }

      // Assuming user details are stored in the first document found
      const userData = userSnapshot.docs[0].data();
      const { firstName, lastName } = userData;

    try {
      // Step 1: Create or update the withdraw record in the 'withdraws' collection
      const withdrawRef = query(collection(db, "withdraws"), where("uid", "==", userId));
      const withdrawRefSnapshot = await getDocs(withdrawRef);
      let withdrawDocId;

      if (!withdrawRefSnapshot.empty) {
        // If withdraw exists, update it with the new data
        withdrawDocId = withdrawRefSnapshot.docs[0].id;
        await updateDoc(doc(db, "withdraws", withdrawDocId), {
          amountWithdraw: parseFloat(amount),
            status: "pending",
            firstName,
            lastName,
            uid: userId,
            WalletType: walletType,
            WalletAddress: walletAddress,
        });
      } else {
        // Create a new withdrawal record
        const newWithdrawDoc = await addDoc(collection(db, "withdraws"), {
          amountWithdraw: parseFloat(amount),
            status: "pending",
            Totalwithdraw: 0,
            firstName,
            lastName,
            uid: userId,
            WalletType: walletType,
            WalletAddress: walletAddress,
        });
        withdrawDocId = newWithdrawDoc.id; // Get the new document ID
      }

      setWithdrawId(withdrawDocId); // Save the withdrawal ID for monitoring

      // Show success message in modal
      setSuccess("Withdrawal request submitted successfully. Please allow time for processing.");
      setIsModalOpen(true); // Open the modal

      // Step 2: Set up a listener to monitor the withdrawal status
      const withdrawDocRef = doc(db, "withdraws", withdrawDocId);
      const unsubscribe = onSnapshot(withdrawDocRef, async (doc) => {
        const data = doc.data();
        if (data && data.status === "approved") {
          // Proceed to deduct from the TotalAccountBalance
          await deductFromAccountBalance(userId, parseFloat(amount));
          unsubscribe(); // Stop listening after deduction
        }
      });

    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deductFromAccountBalance = async (userId, amount) => {
    try {
      const accountRef = doc(db, "AccountBalance", userId);
      const accountSnap = await getDoc(accountRef);

      if (accountSnap.exists()) {
        const { TotalAccountBalance } = accountSnap.data();

        // Check if amountWithdraw is less than TotalAccountBalance
        if (amount > TotalAccountBalance) {
          setError("Insufficient balance for the withdrawal.");
          return;
        }

        // Subtract amountWithdraw from TotalAccountBalance
        const newBalance = TotalAccountBalance - amount;

        // Update the TotalAccountBalance in Firestore
        await updateDoc(accountRef, {
          TotalAccountBalance: newBalance,
        });
      } else {
        setError("Account balance not found.");
      }
    } catch (error) {
      setError("An error occurred while deducting the balance: " + error.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSuccess(""); // Clear success message
  };

  return (
    <>
      {user ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Withdraw</h1>
          <div className="flex flex-col items-center justify-center">
            {/* Add the Status card here */}
            <TransactionDetailsCard/>

            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-8">
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

              <button
                onClick={handleProceed}
                className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading && "opacity-50 cursor-not-allowed"}`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed"}
              </button>

              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>

          {/* Modal for success message */}
          {isModalOpen && (
            <Modal onClose={handleCloseModal}>
              <h2 className="text-xl font-semibold mb-4">Success</h2>
              <p>{success}</p>
              <button onClick={handleCloseModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                Close
              </button>
            </Modal>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Withdraws;
