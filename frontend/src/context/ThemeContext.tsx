import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AppTheme,
  darkTheme,
  lightTheme,
  deuteranopiaTheme,
  protanopiaTheme,
  tritanopiaTheme,
} from 'src/@types/colors';



export type ThemeType =
  | 'light'
  | 'dark'
  | 'deuteranopia'
  | 'protanopia'
  | 'tritanopia';

interface ThemeContextData {
  theme: AppTheme;
  themeType: ThemeType;
  toggleTheme: (type: ThemeType) => void;
}


const defaultTheme: AppTheme = lightTheme;

const themes: Record<ThemeType, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
  deuteranopia: deuteranopiaTheme,
  protanopia: protanopiaTheme,
  tritanopia: tritanopiaTheme,
};

const ThemeContext = createContext<ThemeContextData>({
  theme: defaultTheme,
  themeType: 'light',
  toggleTheme: () => { },
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};


interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'light',
}) => {
  const [themeType, setThemeType] = useState<ThemeType>(initialTheme);

  const theme = themes[themeType] ?? defaultTheme;

  const toggleTheme = (type: ThemeType) => {
    setThemeType(type);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeType, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
