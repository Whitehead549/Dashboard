import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALCOkDVnrTCSyi2rTUKoshDwvyY0sMlOQ",
  authDomain: "testloop500.firebaseapp.com",
  projectId: "testloop500",
  storageBucket: "testloop500.appspot.com",
  messagingSenderId: "860097259860",
  appId: "1:860097259860:web:f7f4308530c091ff2900c1",
  measurementId: "G-5V79M6GDVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)