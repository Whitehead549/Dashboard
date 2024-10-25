import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, query, where, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
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
    const [status, setStatus] = useState(false); // New state for tracking status

    useEffect(() => {
        const getUsers = (user) => {
            if (!user) {
                setUserId(null);
                return;
            }

            setUserId(user.uid);

            // Listen for changes in TotalDeposits
            const depositsQuery = query(collection(db, "deposits"), where("uid", "==", user.uid));
            onSnapshot(depositsQuery, (depositsSnapshot) => {
                if (!depositsSnapshot.empty) {
                    setTotalDeposits(depositsSnapshot.docs[0].data().TotalAmount || 0);
                } else {
                    setTotalDeposits(0); // Set to 0 if no document exists
                }
            });

            // Listen for changes in AccountBalance
            const accountBalanceQuery = query(collection(db, "AccountBalance"), where("uid", "==", user.uid));
            onSnapshot(accountBalanceQuery, (accountBalanceSnapshot) => {
                if (!accountBalanceSnapshot.empty) {
                    setAccountBalance(accountBalanceSnapshot.docs[0].data().TotalAccountBalance || 0);
                } else {
                    setAccountBalance(0); // Set to 0 if no document exists
                }
            });

            // Listen for changes in TotalWithdrawals
            const withdrawalsQuery = query(collection(db, "withdraws"), where("uid", "==", user.uid));
            onSnapshot(withdrawalsQuery, (withdrawalsSnapshot) => {
                if (!withdrawalsSnapshot.empty) {
                    setTotalWithdrawals(withdrawalsSnapshot.docs[0].data().Totalwithdraw || 0);
                } else {
                    setTotalWithdrawals(0); // Set to 0 if no document exists
                }
            });

            // Listen for changes in Plan
            const planQuery = query(collection(db, "AccountBalance"), where("uid", "==", user.uid));
            onSnapshot(planQuery, (planSnapshot) => {
                if (!planSnapshot.empty) {
                    setPlan(planSnapshot.docs[0].data().titleplan || "None");
                } else {
                    setPlan("None"); // No plan data found
                }
            });

            // Listen for status changes
            const statusDocRef = doc(db, "history", user.uid);
            onSnapshot(statusDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const { status } = docSnapshot.data();
                    setStatus(status); // Update local status state
                }
            });

            // Fetch TotalEarnings only if status is true
            if (status) {
                const earningsQuery = query(collection(db, "AccountBalance"), where("uid", "==", user.uid));
                onSnapshot(earningsQuery, (earningsSnapshot) => {
                    if (!earningsSnapshot.empty) {
                        setTotalEarnings(earningsSnapshot.docs[0].data().TotalEarnings || 0);
                    } else {
                        setTotalEarnings(0); // Set to 0 if no document exists
                    }
                });
            } else {
                setTotalEarnings(0); // Reset to 0 if status is false
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
    }, [navigate, status]); // Add status as a dependency

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                listenToFutureDate(user.uid); // Set up the real-time listener for futureDate
            } else {
                navigate('/Dashboard'); // Redirect to login if not authenticated
            }
        });
    
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [navigate]);
    
    // Real-time listener for futureDate field
    const listenToFutureDate = (uid) => {
        const historyDocRef = doc(db, "history", uid);
    
        // Set up real-time listener
        const unsubscribe = onSnapshot(historyDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const { futureDate } = docSnapshot.data();
                if (futureDate) {
                    startCountdown(futureDate, uid); // Start the countdown with updated futureDate
                } else {
                    setCountdown('None'); // Set to None if no futureDate exists
                }
            }
        }, (error) => {
            console.error("Error listening to futureDate: ", error);
        });
    
        return unsubscribe; // Cleanup the listener when component unmounts
    };
    
    // Updated startCountdown function to update the countdown in real-time
    const startCountdown = (futureDate, uid) => {
        const futureDateObj = new Date(futureDate); // Convert futureDate to Date object
    
        // Clear any existing intervals before starting a new one
        clearInterval(window.countdownInterval);
    
        window.countdownInterval = setInterval(async () => {
            const currentDate = new Date();
            const timeDifference = futureDateObj - currentDate;
    
            if (timeDifference > 0) {
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
                setCountdown(`${days}d:${hours}h:${minutes}min:${seconds}sec`);
            } else {
                setCountdown('None');
                clearInterval(window.countdownInterval); // Stop the countdown
                await updateStatusToTrue(uid); // Update status in Firestore
                await updateAccountBalance(uid); // Update AccountBalance
            }
        }, 1000);
    };
    
    // Clean up the interval when the component unmounts
    useEffect(() => {
        return () => clearInterval(window.countdownInterval); // Clean up interval
    }, []);
    

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
            TotalDeposits={TotalDeposits} TotalWithdrawals={TotalWithdrawals} Plan={Plan} />
            <TradingViewChart />
        </div>
    );
};

export default Home;
