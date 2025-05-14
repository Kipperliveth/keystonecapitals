import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyD2QdJsntqXzwO5L1DU_lz4DwpUBQqGGUI",
  authDomain: "keystonecapitals.firebaseapp.com",
  projectId: "keystonecapitals",
  storageBucket: "keystonecapitals.appspot.com",
  messagingSenderId: "378718510329",
  appId: "1:378718510329:web:94bba1ed633be602981628"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const txtdb = getFirestore(app);

