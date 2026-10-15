import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlD7cqi2t97rs8EmD7dydkfTrNK8oUjg4",
  authDomain: "ourpages-be037.firebaseapp.com",
  projectId: "ourpages-be037",
  storageBucket: "ourpages-be037.firebasestorage.app",
  messagingSenderId: "1087684198454",
  appId: "1:1087684198454:web:574f44f5562c77ff3fd897",
  measurementId: "G-ZLJMQ5ZDCW"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
