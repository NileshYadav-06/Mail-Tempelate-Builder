import React from "react";
import { Feather, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const ThemeIcon = theme === "light" ? Moon : Sun;

  return (
    <nav
      className={`flex items-center border-b justify-between p-4 bg-gradient-to-r ${
        theme === "light"
          ? "from-black via-white to-gray-300"
          : "from-black via-black to-gray-900"
      } text-white shadow-lg relative z-10`}
    >
      <div className="flex items-center space-x-3">
        <Feather className="w-7 h-7" />
        <h1 className="text-xl sm:text-2xl text-[#f59e0b] font-bold tracking-wide">
          Mail Template Builder
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-[#f59e0b] hover:bg-amber-400 transition-colors duration-300 transform hover:scale-105"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Theme`}
        >
          <ThemeIcon className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
