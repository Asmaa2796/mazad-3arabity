export const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://development.auctionmycar.online/api/v1";


export const getToken = () => localStorage.getItem("token");

export const getCurrentLanguage = () =>
  localStorage.getItem("ui_lang") === "en" ? "en" : "ar";
