import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
const History = () => {
    const db = getFirestore();  // Initialize Firestore
    const auth = getAuth();     // Initialize Firebase Auth
    const navigate = useNavigate(); // Initialize navigation
  
    const [countdown, setCountdown] = useState('');   // State to hold the countdown timer
    const [initialDate, setInitialDate] = useState(null); // State to store the initial registered date
    const [userId, setUserId] = useState(null); // State to store the authenticated user's ID
  
    const tenDaysInMillis = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds
    const fetchOrCreateDate = async (uid) => {
        const historyRef = collection(db, 'history'); // Reference to the Firestore 'history' collection
        const q = query(historyRef, where('userId', '==', uid)); // Query to find documents with the current user's ID
        const querySnapshot = await getDocs(q); // Execute query and get results
    
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data(); // Get existing history document data
          setInitialDate(docData.date.toDate()); // Convert Firestore Timestamp to JS Date
        } else {
          const currentDate = new Date();  // Current date as initial date
          const newDocRef = doc(historyRef, uid); // Use UID as document ID for uniqueness
          await setDoc(newDocRef, {  // Create a new document in Firestore
            userId: uid,
            date: currentDate,
          });
          setInitialDate(currentDate); // Update state with current date
        }
      };
      const calculateCountdown = (startDate) => {
        const interval = setInterval(() => {
          const currentTime = new Date(); // Get current time
          const timeDifference = (startDate.getTime() + tenDaysInMillis) - currentTime.getTime(); // Calculate the difference
    
          if (timeDifference > 0) {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Days left
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Hours left
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Minutes left
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000); // Seconds left
    
            setCountdown(`${days}d:${hours}h:${minutes}min:${seconds}sec`); // Update countdown
          } else {
            setCountdown('Time is up!'); // Time expired
            clearInterval(interval); // Clear interval to stop timer
          }
        }, 1000); // Run every second
      };
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserId(user.uid);  // Set the user ID
            fetchOrCreateDate(user.uid); // Fetch or create the initial date
          } else {
            navigate('/login'); // Redirect to login if not authenticated
          }
        });
    
        return () => unsubscribe(); // Clean up the listener on unmount
      }, [auth, navigate]);

      useEffect(() => {
        if (initialDate) {
          calculateCountdown(initialDate); // Start countdown if an initial date is set
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