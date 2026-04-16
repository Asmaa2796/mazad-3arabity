import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./config";

export const listenAuctionBids = (auctionId, callback) => {
  const ref = doc(db, "auction_bids", String(auctionId));

  const unsubscribe = onSnapshot(ref, (snapshot) => {
    const data = snapshot.data();

    const bids = data?.bids || [];

    callback(bids);
  });

  return unsubscribe;
};