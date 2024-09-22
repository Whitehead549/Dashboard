import { motion } from "framer-motion";
import { DollarSign, CreditCard, ArrowUpCircle, ArrowDownCircle, Users, Gift } from "lucide-react";
import StatCard from "./Statcard";

const OverviewPage = () => {
	return (
		<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
			{/* Responsive Grid Layout */}
			<motion.div
				className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mb-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				{/* 1. Account Balance */}
				<StatCard 
					name='Account Balance' 
					icon={DollarSign} 
					value='$5,678.90' 
					color='#6366F1' 
					textColor='text-white' 
				/>

				{/* 2. Total Earnings */}
				<StatCard 
					name='Total Earnings' 
					icon={CreditCard} 
					value='$45,678.90' 
					color='#8B5CF6' 
					textColor='text-white' 
				/>

				{/* 3. Total Withdrawals */}
				<StatCard 
					name='Total Withdrawals' 
					icon={ArrowUpCircle} 
					value='$10,234.00' 
					color='#EC4899' 
					textColor='text-white' 
				/>

				{/* 4. Total Deposits */}
				<StatCard 
					name='Total Deposits' 
					icon={ArrowDownCircle} 
					value='$12,345.00' 
					color='#10B981' 
					textColor='text-white' 
				/>

				{/* 5. Total Referrals */}
				<StatCard 
					name='Total Referrals' 
					icon={Users} 
					value='150' 
					color='#F59E0B' 
					textColor='text-white' 
				/>

				{/* 6. Referral Earnings */}
				<StatCard 
					name='Referral Earnings' 
					icon={Gift} 
					value='$1,234.56' 
					color='#3B82F6' 
					textColor='text-white' 
				/>
			</motion.div>
		</main>
	);
};

export default OverviewPage;
