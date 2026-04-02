import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translations";

const STORAGE_KEY = "ui_lang";
const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || "ar");

  useEffect(() => {
    const lang = language === "en" ? "en" : "ar";
    const dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [language]);

  const value = useMemo(() => {
    const lang = language === "en" ? "en" : "ar";
    return {
      language: lang,
      isArabic: lang === "ar",
      t: translations[lang],
      toggleLanguage: () => setLanguage((prev) => (prev === "ar" ? "en" : "ar")),
      setLanguage,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
