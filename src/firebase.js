import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: "messenger-70fcd.firebaseapp.com",
  projectId: "messenger-70fcd",
  storageBucket: "messenger-70fcd.appspot.com",
  messagingSenderId: "567874520871",
  appId: "1:567874520871:web:4ee524cdda9648cc370b02"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
