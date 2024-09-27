import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();
  
  const [countdown, setCountdown] = useState('');
  const [initialDate, setInitialDate] = useState(null);
  const [userId, setUserId] = useState(null);

  const tenDaysInMillis = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds

  // Fetch or create the initial date for the authenticated user
  const fetchOrCreateDate = async (uid) => {
    const historyRef = collection(db, 'history');
    const q = query(historyRef, where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // If a date exists for the user, retrieve it
      const docData = querySnapshot.docs[0].data();
      setInitialDate(docData.date.toDate()); // Convert Firestore Timestamp to JS Date
    } else {
      // If no date exists, register the current date for the user
      const currentDate = new Date();
      await addDoc(historyRef, {
        userId: uid,
        date: currentDate, // Save the current date in Firestore
      });
      setInitialDate(currentDate); // Set the initial date
    }
  };

  // Calculate and update the countdown based on the initial date
  const calculateCountdown = (startDate) => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = (startDate.getTime() + tenDaysInMillis) - currentTime.getTime();

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setCountdown(`${days}d:${hours}h:${minutes}min:${seconds}sec`);
      } else {
        setCountdown('Time is up!');
        clearInterval(interval);
      }
    }, 1000);
  };

  // Authentication and Firestore date fetching logic
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchOrCreateDate(user.uid); // Fetch the initial date or create one if necessary
      } else {
        navigate('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // Start the countdown calculation when the initial date is set
  useEffect(() => {
    if (initialDate) {
      calculateCountdown(initialDate); // Start countdown
    }
  }, [initialDate]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Countdown Timer</h2>
      <div className="text-base sm:text-lg text-center">{countdown}</div>
    </div>
  );
};

export default History;

