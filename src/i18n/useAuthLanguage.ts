import { useEffect, useState } from "react";
import { translate, type LanguageCode } from "./authI18n";

const STORAGE_KEY = "neurooption_language";

// Shared language state for the auth pages: persisted, and applied to <html>
// so Arabic switches the layout to right-to-left.
export function useAuthLanguage() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem(STORAGE_KEY) as LanguageCode) || "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const tt = (key: Parameters<typeof translate>[1]) => translate(language, key);

  return { language, setLanguage, tt };
}
