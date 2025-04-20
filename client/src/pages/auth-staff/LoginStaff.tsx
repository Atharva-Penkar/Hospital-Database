// src/gate-pages/StaffLoginPage.tsx
import { useState, useEffect } from "react";
import { StaffLoginForm } from "../../components/auth-staff/AuthFormStaff";
import { Sun, Moon } from "lucide-react";

const StaffLoginPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div
      className={`min-h-screen flex flex-col bg-background text-foreground transition-colors ${
        isDarkMode ? "dark bg-zinc-900" : "bg-gray-100"
      }`}
    >
      {/* Top right dark mode toggle */}
      <div className="flex justify-end items-center p-4">
        <div
          className="relative w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
          onClick={toggleTheme}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <div
            className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
              isDarkMode ? "translate-x-5" : "translate-x-1"
            }`}
          />
          <div className="absolute inset-0 flex justify-between items-center px-1">
            <Sun className="w-3 h-3 text-yellow-500" />
            <Moon className="w-3 h-3 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Centered login form */}
      <div className="flex-1 flex items-center justify-center">
        <StaffLoginForm />
      </div>
    </div>
  );
};

export default StaffLoginPage;
