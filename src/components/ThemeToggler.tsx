import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 p-2 rounded-full shadow-md transition-colors duration-300
        bg-white dark:bg-blue-600"
    >
      {theme === "dark" ? (
        <FaSun className="text-white" />
      ) : (
        <FaMoon className="text-white" />
      )}
    </button>
  );
}
