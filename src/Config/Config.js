import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtzCZIHsxQP6VGc5T8eWDByJctLyoRf-U",
  authDomain: "test900-83ca0.firebaseapp.com",
  projectId: "test900-83ca0",
  storageBucket: "test900-83ca0.appspot.com",
  messagingSenderId: "637332663500",
  appId: "1:637332663500:web:c2d4c6fb2d0c7ca0d2a669",
  measurementId: "G-0QBB0DLKBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)