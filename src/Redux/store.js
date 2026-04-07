// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./Slices/contentSlice";
import contactReducer from "./Slices/contactSlice";
import authReducer from "./Slices/authSlice";
import auctionsReucer from "./Slices/auctionsSlice";

export const store = configureStore({
  reducer: {
    content: contentReducer,
    contact: contactReducer,
    auth: authReducer,
    auctions: auctionsReucer,
  },
});