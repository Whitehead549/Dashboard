import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSnCxty5pTilXCRgx6EdXVeDGx-gkFDIU",
  authDomain: "selmabriggswilsoncom.firebaseapp.com",
  projectId: "selmabriggswilsoncom",
  storageBucket: "selmabriggswilsoncom.firebasestorage.app",
  messagingSenderId: "354228515367",
  appId: "1:354228515367:web:5c02f4b6c443faa9d21402",
  measurementId: "G-X872LXFFCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)