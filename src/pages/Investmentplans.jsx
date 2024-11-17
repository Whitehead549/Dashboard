import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { FaArrowDown, FaArrowUp, FaClock, FaChartLine } from 'react-icons/fa';
import { db, auth } from '../Config/Config'; // Adjust based on your file structure
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { collection, query, where, getDocs, onSnapshot} from 'firebase/firestore';
import Modal from "../components/Essentials/Modal";

// StatCard component for the Total Deposits card
const StatCard = ({ name, icon: Icon, value, color, textColor = '' }) => {
  return (
    <motion.div
      className='bg-white backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-200 w-full max-w-sm'
      initial={{ y: 50, opacity: 0 }}  // Starting position (offscreen)
      animate={{ y: 0, opacity: 1 }}  // End position (onscreen)
      transition={{ duration: 1.2, ease: "easeOut" }}  // Transition timing
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
    >
      <div className='px-6 py-8 sm:p-6'>
        <span className={`flex items-center text-sm font-medium ${textColor}`}>
          <Icon size={20} className='mr-2' style={{ color }} />
          {name}
        </span>
        <p className='mt-2 text-4xl font-semibold text-gray-900'>{value}</p>
      </div>
    </motion.div>
  );
};

const SubscriptionPlanCard = ({ title, price, min, max, duration, roi, amount, onAmountChange, onInvest }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col">
      <div className='text-center items-center'>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-xl font-bold mb-4">
          <span className="text-gray-600"></span>
          <span className="text-blue-600">{price}</span>
        </p>
      </div>
      <hr className="my-4 border-gray-300" />
      <ul className="flex-grow space-y-4 mb-6">
        <li className="flex items-start">
          <FaArrowDown className="text-blue-600 mr-2 mt-1" size={20} />
          <span className="text-gray-800">MINIMUM: ${min}</span>
        </li>
        <li className="flex items-start">
          <FaArrowUp className="text-blue-600 mr-2 mt-1" size={20} />
          <span className="text-gray-800">MAXIMUM: ${max}</span>
        </li>
        <li className="flex items-start">
          <FaClock className="text-blue-600 mr-2 mt-1" size={20} />
          <span className="text-gray-800">DURATION: {duration}</span>
        </li>
        <li className="flex items-start">
          <FaChartLine className="text-blue-600 mr-2 mt-1" size={20} />
          {/* Display ROI as percentage */}
          <span className="text-gray-800">ROI: {roi * 100}%</span>
        </li>
      </ul>
      <label className="block mb-2">Enter Amount (In USD)</label>
      <input 
        type="number" 
        value={amount} 
        onChange={onAmountChange}
        className="w-full p-2 border border-gray-300 rounded-xl mb-4"
        placeholder="$0" 
      />

      <div className='text-center'>
        <button 
          className='bg-blue-700 text-white py-3 px-8 rounded-3xl text-center font-medium hover:bg-blue-800 transition'
          onClick={onInvest}
        >
          Invest
        </button>
      </div>
    </div>
  );
};

const InvestmentPlans = () => {
  const [amount, setAmount] = useState({
    beginner: 0,
    advanced: 0,
    premium: 0,
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);  // To control the modal visibility
  const [modalMessage, setModalMessage] = useState('');   // To store the modal message
 

   // Step 1: Move the fetching logic directly into useEffect
  useEffect(() => {
    const fetchTotalAmount = async () => {
      const user = auth.currentUser;
      if (!user) {
        setModalMessage('Please log in.');
        setIsModalOpen(true);  // Open modal
        return;
      }

      const depositsQuery = query(
        collection(db, 'deposits'),
        where('uid', '==', user.uid)
      );

      const depositsSnapshot = await getDocs(depositsQuery);
      depositsSnapshot.forEach((docSnapshot) => {
        const depositData = docSnapshot.data();
        setTotalAmount(depositData.TotalAmount);  // Set TotalAmount in state
      });
    };

    // Call the fetch function when the component mounts
    fetchTotalAmount();
  }, []); 

  const handleInputChange = (e, plan) => {
    setAmount({ ...amount, [plan]: e.target.value });
  };

  const handleInvest = async (plan, roi, titleplan, min, max) => {
    const user = auth.currentUser;
    if (!user) {
      setModalMessage('Please log in to invest.');
      setIsModalOpen(true);  // Open modal
      return;
    }

     // Check if AccountBalance is low
     if (AccountBalance !== 0) {
      setModalMessage("You have an ongoing Plan");
      setIsModalOpen(true); // Open modal
      return;
  }


    const investmentAmount = parseFloat(amount[plan]);
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      setModalMessage('Please enter a valid investment amount.');
      setIsModalOpen(true);  // Open modal
      return;
    }
  
    // Check if the investment is within the allowed min and max range
  if (investmentAmount < min) {
    setModalMessage(`The amount you entered is below the minimum allowed for the ${plan.toUpperCase()} plan. Please invest at least $${min}.`);
    setIsModalOpen(true);  // Open modal
    return;
  }
  
  if (investmentAmount > max) {
    setModalMessage(`The amount you entered exceeds the maximum allowed for the ${plan.toUpperCase()} plan. Please invest no more than $${max}.`);
    setIsModalOpen(true);  // Open modal
    return;
  }

  
  try {
    const depositsQuery = query(
      collection(db, 'deposits'),
      where('uid', '==', user.uid)
    );
    const depositsSnapshot = await getDocs(depositsQuery);
    let totalAmountInDb = null;

    depositsSnapshot.forEach((docSnapshot) => {
      const depositData = docSnapshot.data();
      if (depositData && depositData.TotalAmount !== undefined) {
        totalAmountInDb = depositData.TotalAmount;
      }
    });
    
      // Step 2: Check if TotalAmount exists and is greater than investmentAmount
      if (totalAmountInDb === null) {
        alert('TotalAmount field does not exist in your deposits. Please check your account.');
        return;
      }
  
      if (totalAmountInDb < investmentAmount) {
        setModalMessage('Insufficient funds. Your total deposits are less than the amount you wish to invest.');
        setIsModalOpen(true);  // Open modal
        return;
      }
  
      const TotalEarnings = investmentAmount * roi;
      const AccountBalance = investmentAmount + TotalEarnings;
  
      // Subtract investmentAmount from the TotalAmount in the deposits collection
      const newTotalAmount = totalAmountInDb - investmentAmount;
      await updateDoc(doc(db, 'deposits', depositsSnapshot.docs[0].id), {
        TotalAmount: newTotalAmount,
      });
      setTotalAmount(newTotalAmount);
  
      // Update or create the AccountBalance collection
      const accountBalanceDoc = doc(db, 'AccountBalance', user.uid);
      const accountBalanceSnapshot = await getDoc(accountBalanceDoc);
  
      if (accountBalanceSnapshot.exists()) {
        await updateDoc(accountBalanceDoc, {
          AccountBalance: accountBalanceSnapshot.data().AccountBalance + AccountBalance,
          TotalEarnings: accountBalanceSnapshot.data().TotalEarnings + TotalEarnings,
          investmentAmount: accountBalanceSnapshot.data().investmentAmount + investmentAmount,
          titleplan,  
        });
      } else {
        await setDoc(accountBalanceDoc, {
          uid: user.uid,
          AccountBalance,
          TotalEarnings,
          investmentAmount,
          titleplan,  
        });
      }
  
      // Create or update a document in the history collection
      const usersQuery = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );
      const usersSnapshot = await getDocs(usersQuery);
  
      if (!usersSnapshot.empty) {
        const userData = usersSnapshot.docs[0].data();
        const { firstName, lastName } = userData;
  
        const presentDate = new Date();
        const durationDays = parseInt(plan === 'beginner' ? 10 : plan === 'advanced' ? 15 : 20);
        const futureDate = new Date(presentDate);
        futureDate.setDate(futureDate.getDate() + durationDays);
  
        const historyDoc = doc(db, 'history', user.uid);
        await setDoc(historyDoc, {
          futureDate: futureDate.toISOString(),
          status: false,
          firstName,
          lastName,
          uid: user.uid,
        }, { merge: true });
  
     
        setModalMessage(`Successfully invested $${investmentAmount} in the ${plan.toUpperCase()} plan!`);
        setIsModalOpen(true);  // Open modal
      } else {
        setModalMessage('User data not found in the database.');
        setIsModalOpen(true);  // Open modal
      }
    } catch (error) {
      console.error('Error updating account balance: ', error);
      setModalMessage('Failed to invest. Please try again later.');
      setIsModalOpen(true);  // Open modal
    }
  };


  // Listen for changes in AccountBalance
const [AccountBalance, setAccountBalance] = useState(0);

useEffect(() => {
    const user = auth.currentUser;
    if (user) {
        const accountBalanceQuery = query(
            collection(db, "AccountBalance"),
            where("uid", "==", user.uid)
        );

        const unsubscribe = onSnapshot(accountBalanceQuery, (accountBalanceSnapshot) => {
            if (!accountBalanceSnapshot.empty) {
                setAccountBalance(accountBalanceSnapshot.docs[0].data().AccountBalance);
            } else {
                setAccountBalance(0); // Set to 0 if no document exists
            }
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }
}, []);
  

  return (
    <>
      <h1 className="text-2xl font-bold">Investment Plans</h1>
      <div className="flex flex-col items-center justify-start p-6 gap-6 w-full max-w-4xl mx-auto min-h-screen pb-20">
        {/* Total Deposits Card */}
        <StatCard 
          name="Total Deposits" 
          icon={DollarSign} 
          value={totalAmount} 
          color="green" 
          textColor="text-green-900"
        />

        {/* Plans Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <SubscriptionPlanCard 
        title="BEGINNER'S PLAN"
        min={100}
        max={999}
        duration="10 DAYS"
        roi={1}
        amount={amount.beginner}
        onAmountChange={(e) => handleInputChange(e, 'beginner')}
        onInvest={() => handleInvest('beginner', 1, 'BEGINNER PLAN', 100, 999)}
      />

      <SubscriptionPlanCard 
        title="ADVANCED PLAN"
        min={1000}
        max={9999}
        duration="15 DAYS"
        roi={3}
        amount={amount.advanced}
        onAmountChange={(e) => handleInputChange(e, 'advanced')}
        onInvest={() => handleInvest('advanced', 3, 'ADVANCED PLAN', 1000, 9999)}
      />

      <SubscriptionPlanCard 
        title="PREMIUM PLAN"
        min={10000}
        max={100000}
        duration="20 DAYS"
        roi={5}
        amount={amount.premium}
        onAmountChange={(e) => handleInputChange(e, 'premium')}
        onInvest={() => handleInvest('premium', 5, 'PREMIUM PLAN', 10000, 100000)}
      />

        </div>
      </div>

      <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Result"
  message={modalMessage}
/>

    </>
  );
};

export default InvestmentPlans;
