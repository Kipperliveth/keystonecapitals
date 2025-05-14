import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKUfBsTC3EvOv2_h802L4Fpo3zcODUmRA",
  authDomain: "goklear-e2712.firebaseapp.com",
  projectId: "goklear-e2712",
  storageBucket: "goklear-e2712.appspot.com",
  messagingSenderId: "13487157421",
  appId: "1:13487157421:web:766b057eff6242e5c9d624"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const txtdb = getFirestore(app);

