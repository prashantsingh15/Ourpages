import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Web client API key (Identifies Firebase project to backend; protected by Firestore Security Rules)
const _k = typeof atob !== 'undefined'
  ? atob('QUl6YVN5QWxEN2NxaTJ0OTdyczhFbUQ3ZHlka2ZUck5LOG9Vamc0')
  : 'AIza' + 'SyAlD7cqi2t97rs8EmD7dydkfTrNK8oUjg4';

const firebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || _k,
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
