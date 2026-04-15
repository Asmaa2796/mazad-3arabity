import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./config";

export const requestFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BF0F_4PUNQgaT3Fbg7rIINfYaxymCTQCLGL6DFVuD0j9kU5bYgMG71SBXj3aUskll2dq_gF8Vxrt4u-kwWkYqB4"
    });

    return token;
  } catch (error) {
    console.error("FCM error", error);
    return null;
  }
};

export const onMessageListener = (callback) =>
  onMessage(messaging, callback);