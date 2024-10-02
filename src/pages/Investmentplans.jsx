import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { FaArrowDown, FaArrowUp, FaClock, FaChartLine } from 'react-icons/fa';
import { db, auth } from '../Config/Config'; // Adjust based on your file structure
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
          <span className="text-gray-600">$</span>
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

   // Step 1: Move the fetching logic directly into useEffect
  useEffect(() => {
    const fetchTotalAmount = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert('Please log in.');
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

  const handleInvest = async (plan, roi, titleplan) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to invest.');
      return;
    }

    const investmentAmount = parseFloat(amount[plan]);
    const TotalEarnings = investmentAmount * roi;  // Use original ROI value for calculation
    const AccountBalance = investmentAmount + TotalEarnings;
       
    try {
      // 1. Subtract investmentAmount from the TotalAmount in the deposits collection
      const depositsQuery = query(
        collection(db, 'deposits'),
        where('uid', '==', user.uid)
      );
      const depositsSnapshot = await getDocs(depositsQuery);

      depositsSnapshot.forEach(async (docSnapshot) => {
        const depositData = docSnapshot.data();
        const newTotalAmount = depositData.TotalAmount - investmentAmount;

        if (newTotalAmount >= 0) {
          // Update the TotalAmount after subtracting the investment
          await updateDoc(doc(db, 'deposits', docSnapshot.id), {
            TotalAmount: newTotalAmount,
          });
          setTotalAmount(newTotalAmount);
        } else {
          alert('Not enough funds to make this investment.');
          return;
        }
      });

      // 2. Update or create the AccountBalance collection
      const accountBalanceDoc = doc(db, 'AccountBalance', user.uid);
      const accountBalanceSnapshot = await getDoc(accountBalanceDoc);

      if (accountBalanceSnapshot.exists()) {
        // Update the existing document
        await updateDoc(accountBalanceDoc, {
          AccountBalance: accountBalanceSnapshot.data().AccountBalance + AccountBalance,
          TotalEarnings: accountBalanceSnapshot.data().TotalEarnings + TotalEarnings,
          investmentAmount: accountBalanceSnapshot.data().investmentAmount + investmentAmount,
          titleplan,  // Include the title of the subscribed plan
        });
      } else {
        // Create a new document if it doesn't exist
        await setDoc(accountBalanceDoc, {
          uid: user.uid,
          AccountBalance,
          TotalEarnings,
          investmentAmount,
          titleplan,  // Include the title of the subscribed plan
        });
      }

      // 3. Create or update a document in the history collection
      const usersQuery = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );
      const usersSnapshot = await getDocs(usersQuery);

      if (!usersSnapshot.empty) {
        const userData = usersSnapshot.docs[0].data();
        const { firstName, lastName } = userData;

        const presentDate = new Date();
        const durationDays = parseInt(plan === 'beginner' ? 10 : plan === 'advanced' ? 15 : 20); // Set duration based on plan
        const futureDate = new Date(presentDate);
        futureDate.setDate(futureDate.getDate() + durationDays);

        const historyDoc = doc(db, 'history', user.uid);
        await setDoc(historyDoc, {
          futureDate: futureDate.toISOString(),
          status: false,
          firstName,
          lastName,
          uid: user.uid,
        }, { merge: true }); // Use merge to update if exists

        alert(`Successfully invested $${investmentAmount} in the ${plan.toUpperCase()} plan!`);
      } else {
        alert('User data not found in the database.');
      }
    } catch (error) {
      console.error('Error updating account balance: ', error);
      alert('Failed to invest. Please try again later.');
    }
  };

 

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
          {/* Plan 1: BEGINNER */}
          <SubscriptionPlanCard 
            title="BEGINNER PLAN"
            price="100"
            min="100"
            max="999"
            duration="10 DAYS"
            roi={1}  // ROI used in calculations
            amount={amount.beginner}
            onAmountChange={(e) => handleInputChange(e, 'beginner')}
            onInvest={() => handleInvest('beginner', 1, 'BEGINNER PLAN')}
          />

          {/* Plan 2: ADVANCED */}
          <SubscriptionPlanCard 
            title="ADVANCED PLAN"
            price="1000"
            min="1000"
            max="9999"
            duration="15 DAYS"
            roi={3}  // ROI used in calculations
            amount={amount.advanced}
            onAmountChange={(e) => handleInputChange(e, 'advanced')}
            onInvest={() => handleInvest('advanced', 3, 'ADVANCED PLAN')}
          />

          {/* Plan 3: PROFESSIONAL */}
          <SubscriptionPlanCard 
            title="PROFESSIONAL PLAN"
            price="10000"
            min="10000"
            max="100000"
            duration="20 DAYS"
            roi={5}  // ROI used in calculations
            amount={amount.premium}
            onAmountChange={(e) => handleInputChange(e, 'premium')}
            onInvest={() => handleInvest('premium', 5, 'PROFESSIONAL PLAN')}
          />
        </div>
      </div>
    </>
  );
};

export default InvestmentPlans;
