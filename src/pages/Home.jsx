import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs, query, collection, where, updateDoc } from "firebase/firestore";
import OverviewPage from "../components/common/Overviewpages";
import TradingViewChart from '../components/Essentials/TradingViewChart';
import { auth, db } from '../Config/Config';

const Home = () => {
    const [countdown, setCountdown] = useState('');
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const [AccountBalance, setAccountBalance] = useState(0);
    const [TotalEarnings, setTotalEarnings] = useState(0);
    const [TotalDeposits, setTotalDeposits] = useState(0);
    const [TotalWithdrawals, setTotalWithdrawals] = useState(0);
    const [Plan, setPlan] = useState(null);

    useEffect(() => {
        const getUsers = async (user) => {
            try {
                if (!user) {
                    setUserId(null);
                    return;
                }

                setUserId(user.uid);

                // Query for TotalDeposits
                const depositsQuery = query(collection(db, "deposits"), where("uid", "==", user.uid));
                const depositsData = await getDocs(depositsQuery);
                if (!depositsData.empty) {
                    setTotalDeposits(depositsData.docs[0].data().TotalAmount || 0);
                } else {
                    setTotalDeposits(0); // Set to 0 if no document exists
                }

                // Query for AccountBalance
                const accountBalanceQuery = query(collection(db, "AccountBalance"), where("uid", "==", user.uid));
                const accountBalanceData = await getDocs(accountBalanceQuery);
                if (!accountBalanceData.empty) {
                    setAccountBalance(accountBalanceData.docs[0].data().TotalAccountBalance || 0);
                } else {
                    setAccountBalance(0); // Set to 0 if no document exists
                }

                // Query for TotalEarnings
                const earningsQuery = query(collection(db, "AccountBalance"), where("uid", "==", user.uid));
                const earningsData = await getDocs(earningsQuery);
                if (!earningsData.empty) {
                    setTotalEarnings(earningsData.docs[0].data().TotalEarnings || 0);
                } else {
                    setTotalEarnings(0); // Set to 0 if no document exists
                }

                // Query for TotalWithdrawals
                const withdrawalsQuery = query(collection(db, "withdraws"), where("uid", "==", user.uid));
                const withdrawalsData = await getDocs(withdrawalsQuery);
                if (!withdrawalsData.empty) {
                    setTotalWithdrawals(withdrawalsData.docs[0].data().Totalwithdraw || 0);
                } else {
                    setTotalWithdrawals(0); // Set to 0 if no document exists
                }

                // Query for Plan (different handling)
                const planQuery = query(collection(db, "AccountBalance"), where("uid", "==", user.uid));
                const planData = await getDocs(planQuery);
                if (!planData.empty) {
                    setPlan(planData.docs[0].data().titleplan || null); // Leave as null if not found
                } else {
                    setPlan("None"); // No plan data found
                }

            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        // Listen to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                getUsers(user);
            } else {
                navigate("/Dashboard");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchFutureDate(user.uid);
            } else {
                navigate('/Dashboard'); // Redirect to login if not authenticated
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [navigate]);

    const fetchFutureDate = async (uid) => {
        try {
            const historyDocRef = doc(db, "history", uid);
            const historyDoc = await getDoc(historyDocRef);

            if (historyDoc.exists()) {
                const { futureDate } = historyDoc.data();
                startCountdown(futureDate, uid); // Start the countdown
            }
        } catch (error) {
            console.error("Error fetching history data: ", error);
        }
    };

    const startCountdown = (futureDate, uid) => {
        const intervalId = setInterval(async () => {
            const currentDate = new Date();
            const futureDateObj = new Date(futureDate); // Convert futureDate to Date object
            const timeDifference = futureDateObj - currentDate;

            if (timeDifference > 0) {
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                setCountdown(`${days}d:${hours}h:${minutes}min:${seconds}sec`);
            } else {
                setCountdown('None');
                clearInterval(intervalId); // Stop the countdown
                await updateStatusToTrue(uid); // Update status in Firestore
                await updateAccountBalance(uid); // Update AccountBalance
            }
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup the interval when component unmounts
    };

    const updateStatusToTrue = async (uid) => {
        try {
            const historyDocRef = doc(db, "history", uid);
            await updateDoc(historyDocRef, { status: true });
            console.log("Status updated to true");
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const updateAccountBalance = async (uid) => {
        try {
            const accountBalanceDocRef = doc(db, "AccountBalance", uid);
            const accountBalanceDoc = await getDoc(accountBalanceDocRef);

            let totalAccountBalance = 0;
            let accountBalance = 0;

            if (accountBalanceDoc.exists()) {
                const data = accountBalanceDoc.data();
                totalAccountBalance = data.TotalAccountBalance || 0;
                accountBalance = data.AccountBalance || 0;

                const newTotalAccountBalance = totalAccountBalance + accountBalance;

                await updateDoc(accountBalanceDocRef, {
                    TotalAccountBalance: newTotalAccountBalance,
                    AccountBalance: 0
                });

                console.log("AccountBalance updated successfully");
            } else {
                await updateDoc(accountBalanceDocRef, {
                    TotalAccountBalance: accountBalance,
                    AccountBalance: 0
                });

                console.log("AccountBalance document created and initialized");
            }
        } catch (error) {
            console.error("Error updating AccountBalance: ", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <OverviewPage countdown={countdown} AccountBalance={AccountBalance} TotalEarnings={TotalEarnings} 
            TotalDeposits={TotalDeposits} TotalWithdrawals={TotalWithdrawals} Plan={Plan}/>
            <div className="mt-6">
                <h2 className="text-xl font-semibold">Live BTC/USD Chart</h2>
                <TradingViewChart />
            </div>
        </div>
    );
};

export default Home;
