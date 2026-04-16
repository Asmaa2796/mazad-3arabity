import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6KuVD2PGaQG5s1x9JzN6rY40VrvB-mgQ",
  authDomain: "mazad-3arabety.firebaseapp.com",
  projectId: "mazad-3arabety",
  storageBucket: "mazad-3arabety.firebasestorage.app",
  messagingSenderId: "147335979279",
  appId: "1:147335979279:web:96e0e9d09186c74f211e7a"
};

export const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
export const db = getFirestore(app);