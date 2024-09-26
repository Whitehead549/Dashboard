import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { FaCheck, FaArrowDown, FaArrowUp, FaClock, FaChartLine } from 'react-icons/fa';

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
          <span className="text-gray-800">ROI: {roi}</span>
        </li>
      </ul>
      <label className="block mb-2">Enter Amount (In USD)</label>
      <input 
        type="number" 
        value={amount} 
        onChange={onAmountChange}
        className="w-full p-2 border border-gray-300 rounded-xl mb-4"  // Changed to "rounded-lg" for roundness
        placeholder="$0" 
      />

      <div className='text-center'>
        <button 
          className='bg-blue-600 text-white py-3 px-8 rounded-3xl text-center font-medium hover:bg-blue-700 transition'
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
    professional: 0,
  });

  const handleInputChange = (e, plan) => {
    setAmount({ ...amount, [plan]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-start p-6 gap-6 w-full max-w-4xl mx-auto">
      {/* Total Deposits Card */}
      <StatCard 
        name="Total Deposits" 
        icon={DollarSign} 
        value="$0" 
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
          roi="30%"
          amount={amount.beginner}
          onAmountChange={(e) => handleInputChange(e, 'beginner')}
          onInvest={() => alert(`Investing $${amount.beginner} in BEGINNER PLAN`)}
        />

        {/* Plan 2: ADVANCED */}
        <SubscriptionPlanCard 
          title="ADVANCED PLAN"
          price="1000"
          min="1000"
          max="9999"
          duration="15 DAYS"
          roi="35%"
          amount={amount.advanced}
          onAmountChange={(e) => handleInputChange(e, 'advanced')}
          onInvest={() => alert(`Investing $${amount.advanced} in ADVANCED PLAN`)}
        />

        {/* Plan 3: PROFESSIONAL */}
        <SubscriptionPlanCard 
          title="PROFESSIONAL PLAN"
          price="10000"
          min="10000"
          max="99999"
          duration="20 DAYS"
          roi="40%"
          amount={amount.professional}
          onAmountChange={(e) => handleInputChange(e, 'professional')}
          onInvest={() => alert(`Investing $${amount.professional} in PROFESSIONAL PLAN`)}
        />
      </div>
    </div>
  );
};

export default InvestmentPlans;

