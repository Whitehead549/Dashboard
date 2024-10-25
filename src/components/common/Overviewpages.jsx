import { motion } from "framer-motion";
import { DollarSign, CreditCard, ArrowUpCircle, ArrowDownCircle, Users, Gift, Timer } from "lucide-react";
import StatCard from "./Statcard";

const OverviewPage = ({countdown, AccountBalance, TotalEarnings, TotalDeposits, TotalWithdrawals, Plan}) => {
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
					value={`$${AccountBalance}`}
					color='#6366F1' 
					textColor='text-white' 
				/>

				{/* 2. Total Earnings */}
				<StatCard 
					name='Total Earnings' 
					icon={CreditCard} 
					value={`$${TotalEarnings}`}
					color='#8B5CF6' 
					textColor='text-white' 
				/>

				{/* 3. Total Withdrawals */}
				<StatCard 
					name='Total Withdrawals' 
					icon={ArrowUpCircle} 
					value= {`$${TotalWithdrawals}`}
					color='#EC4899' 
					textColor='text-white' 
				/>

				{/* 4. Total Deposits */}
				<StatCard 
					name='Total Deposits' 
					icon={ArrowDownCircle} 
					value={`$${TotalDeposits}`}
					color='#10B981' 
					textColor='text-white' 
				/>

				{/* 5. Duration */}
				<StatCard 
				name='Duration' 
				icon={Timer} 
				value={
					<span className="text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl">
					{countdown ? countdown : 'None'}
					</span>
				}
				color='#F59E0B' 
				textColor='text-white' 
				/>



				{/* 6. Plans */}
				<StatCard 
					name='Plan' 
					icon={Gift}
					value={
						<span className="text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl">
							{Plan}
						</span>
					}
					color='#3B82F6' 
					textColor='text-white' 
				/>
			</motion.div>
		</main>
	);
};

export default OverviewPage;
