import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDYqnCW4kXrvrqMBJmk95NHrum2eMPKMPA",
  authDomain: "triplea-5.firebaseapp.com",
  projectId: "triplea-5",
  storageBucket: "triplea-5.appspot.com",
  messagingSenderId: "562360371319",
  appId: "1:562360371319:web:2c8b3397bf3fa425829e72",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)