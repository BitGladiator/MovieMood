import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('purple');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('cinematic-theme') || 'purple';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    document.documentElement.className = ''; // Clear all classes
    document.documentElement.classList.add(`theme-${themeName}`);
    localStorage.setItem('cinematic-theme', themeName);
  };

  const changeTheme = (themeName) => {
    setTheme(themeName);
    applyTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};