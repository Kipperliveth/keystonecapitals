import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpxLFNGkHpubNtJUy_hD6CYmXUAntc8Jw",
  authDomain: "keystonetest-7f15b.firebaseapp.com",
  projectId: "keystonetest-7f15b",
  storageBucket: "keystonetest-7f15b.firebasestorage.app",
  messagingSenderId: "294152223979",
  appId: "1:294152223979:web:e4732a7a567bcd577a92ae"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const txtdb = getFirestore(app);

