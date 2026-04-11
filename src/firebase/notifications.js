import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./config";


// 1️⃣ الحصول على FCM Token
export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "YOUR_VAPID_KEY"
      });

      return token;
    }
  } catch (error) {
    console.log("FCM error:", error);
  }
};


// 2️⃣ استقبال الإشعارات داخل الموقع
export const listenNotifications = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Notification:", payload);

    // صوت (اختياري)
    const audio = new Audio("/notification.mp3");
    audio.play();

    // إرسال للـ UI
    if (callback) callback(payload);
  });
};