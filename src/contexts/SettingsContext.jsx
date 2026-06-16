import React, { createContext, useContext } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  return (
    <SettingsContext.Provider value={{}}>
      {children}
    </SettingsContext.Provider>
  );
};
