// src/context/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ Initialize directly from localStorage or system preference
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      console.log(
        "[ThemeContext] Initial theme from localStorage:",
        savedTheme,
      );
      return savedTheme;
    }
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const defaultTheme = prefersDark ? "dark" : "light";
    console.log(
      "[ThemeContext] Initial theme from system preference:",
      defaultTheme,
    );
    return defaultTheme;
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply theme to <html> and persist
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
    console.log(
      "[ThemeContext] Applied theme:",
      theme,
      "and saved to localStorage",
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      console.log("[ThemeContext] Toggling theme from", prev, "to", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
