"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type GlobalContextType = {
  sidebarState: boolean;
  setSidebarState: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarState, setSidebarState] = useState<boolean>(true);

  return (
    <GlobalContext.Provider value={{ sidebarState, setSidebarState }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }

  return context;
};
