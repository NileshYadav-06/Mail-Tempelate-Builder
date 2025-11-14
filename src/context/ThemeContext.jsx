import React, { useState, useEffect, createContext, useContext } from "react";
import { Sun, Moon } from "lucide-react";

// The GlobalStyles component from your original file
// --- START: THEME CONTEXT (ThemeContext.jsx content) ---

const GlobalStyles = () => {
  return (
    <style>{`
        /* Hide scrollbars */
        ::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* --- Light Theme Variables --- */
        html.light {
          --background-main: #f0f2f5;
          --background-light: #ffffff;
          --background-dark: #f9fafb;
          --canvas-bg: #ffffff;
          --header-bg-light: #f9fafb;
          --header-bg-dark: #ffffff;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --border-light: #e5e7eb;
          --border-dark: #d1d5db;
          --accent: #d97706;
          --accent-dark: #b45309;
          --input-bg: #ffffff;
          --dots-color: #d1d5db;
        }

        /* --- Dark Theme Variables (High Contrast) --- */
        html.dark {
          --background-main: #000000;
          --background-light: #111111;
          --background-dark: #0a0a0a;
          --canvas-bg: #111111;
          --header-bg-light: #0a0a0a;
          --header-bg-dark: #111111;
          --text-primary: #ffffff;
          --text-secondary: #a0a0a0;
          --border-light: #222222;
          --border-dark: #111111;
          --accent: #f59e0b;
          --accent-dark: #d97706;
          --input-bg: #111111;
          --dots-color: #222222;
        }

        /* --- Applying Variables --- */
        .bg-background-main { background-color: var(--background-main); }
        .bg-background-light { background-color: var(--background-light); }
        .bg-background-dark { background-color: var(--background-dark); }
        .bg-canvas-bg { background-color: var(--canvas-bg); }
        .bg-header-bg-light { background-color: var(--header-bg-light); }
        .bg-header-bg-dark { background-color: var(--header-bg-dark); }
        .text-text-primary { color: var(--text-primary); }
        .text-text-secondary { color: var(--text-secondary); }
        .border-border-light { border-color: var(--border-light); }
        .border-border-dark { border-color: var(--border-dark); }
        .ring-accent { --tw-ring-color: var(--accent); }
        .bg-accent { background-color: var(--accent); }
        .hover\\:bg-accent-dark:hover { background-color: var(--accent-dark); }
        .text-accent { color: var(--accent); }
        .border-accent-dark { border-color: var(--accent-dark); }
        .bg-input-bg { background-color: var(--input-bg); }

        /* Dot background patterns */
        .bg-dots-light {
          background-image: radial-gradient(var(--dots-color) 1px, transparent 1px);
        }
        .dark .bg-dots-dark {
          background-image: radial-gradient(var(--dots-color) 1px, transparent 1px);
        }

        /* Keyframe animations */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-zoom-in { animation: zoom-in 0.3s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }

      `}</style>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <GlobalStyles />
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
