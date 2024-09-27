import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState('');
  const [initialDate, setInitialDate] = useState(null);
  const [userId, setUserId] = useState(null);

  const tenDaysInMillis = 10 * 24 * 60 * 60 * 1000;

  // Function to check if the user's date is already registered
  const checkDate = async () => {
    if (userId) {
      const querySnapshot = await getDocs(collection(db, 'history'));
      let foundDate = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Ensure the user's ID matches the document's userId
        if (data.userId === userId) {
          const registeredDate = data.date.toDate(); // Convert Firestore Timestamp to JS Date
          setInitialDate(registeredDate); // Set the initial date from Firestore
          foundDate = true;
        }
      });

      // If no date is found for the user, register the current date
      if (!foundDate) {
        const newDate = new Date();
        await addDoc(collection(db, 'history'), {
          userId: userId,
          date: newDate, // Register the current date and time
        });
        setInitialDate(newDate); // Set initial date to now
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        checkDate(); // Check for existing date in Firestore
      } else {
        navigate('/login'); // Redirect to login if user is not authenticated
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    if (initialDate) {
      const interval = setInterval(() => {
        const currentTime = new Date();
        const timeDifference = (initialDate.getTime() + tenDaysInMillis) - currentTime.getTime();

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

      return () => clearInterval(interval);
    }
  }, [initialDate]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Countdown Timer</h2>
      <div className="text-lg">{countdown}</div>
    </div>
  );
};

export default History;
