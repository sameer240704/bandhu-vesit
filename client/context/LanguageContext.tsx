"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { usePathname } from "next/navigation";

type LanguageCode = "en" | "hi" | "mr";

type Dictionary = {
  [key: string]: string | Dictionary;
};

interface LanguageContextType {
  currentLang: LanguageCode;
  dict: Dictionary;
  setCurrentLang: React.Dispatch<React.SetStateAction<LanguageCode>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
  initialLang?: LanguageCode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const langFromUrl = pathname.split("/")[1] as LanguageCode;
  const isValidLang = ["en", "hi", "mr"].includes(langFromUrl);

  const [currentLang, setCurrentLang] = useState<LanguageCode>(
    isValidLang ? langFromUrl : "en"
  );
  const [dict, setDict] = useState<Dictionary>({});

  useEffect(() => {
    if (isValidLang && currentLang !== langFromUrl) {
      setCurrentLang(langFromUrl);
    }
  }, [langFromUrl]);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(currentLang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, dict, setCurrentLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};
