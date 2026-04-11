import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  messagingSenderId: "...",
  appId: "..."
};

// تشغيل Firebase
const app = initializeApp(firebaseConfig);

// تشغيل Messaging
export const messaging = getMessaging(app);