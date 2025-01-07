import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtIVE1hkmlS3zMgwx0_59x5fbBInTPAL8",
  authDomain: "tdbank-18f60.firebaseapp.com",
  projectId: "tdbank-18f60",
  storageBucket: "tdbank-18f60.firebasestorage.app",
  messagingSenderId: "587909445300",
  appId: "1:587909445300:web:fb709c320a6b49c99e89e1",
  measurementId: "G-PLCGMWD9DW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const txtdb = getFirestore(app);

