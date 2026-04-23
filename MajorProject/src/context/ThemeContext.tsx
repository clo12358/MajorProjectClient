import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { ThemeName } from "../constants/theme";

type ThemeContextType = {
  themeName: ThemeName;
  isDark: boolean;
  setTheme: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  themeName: "light",
  isDark: false,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("light");

  useEffect(() => {
    AsyncStorage.getItem("theme_preference").then((saved) => {
      if (saved && saved in require("../constants/theme").Colors) {
        setThemeName(saved as ThemeName);
      }
    });
  }, []);

  function setTheme(name: ThemeName) {
    setThemeName(name);
    AsyncStorage.setItem("theme_preference", name);
  }

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        isDark: themeName === "dark",
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
