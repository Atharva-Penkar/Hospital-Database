import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const DataEntryOperatorHome = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
  return (
    <div className={`min-h-screen p-4 grid grid-rows-[auto_1fr_auto] gap-4 ${darkMode ? "bg-gray-900 text-blue-400" : ""}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/hospital-logo.png" alt="Hospital Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Data Entry Operator</h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
            onClick={toggleDarkMode}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-7" : "translate-x-1"}`}
            />
            <div className="absolute inset-0 flex justify-between items-center px-1.5">
              <span className="text-yellow-500">☀️</span>
              <span className="text-blue-400">🌙</span>
            </div>
          </div>

          <Button variant="destructive" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex justify-center gap-8 mt-8">
        {/* Left Button - Go to Tests */}
        <Button className="w-48 p-4 text-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition">
          Go to Tests
        </Button>

        {/* Right Button - Go to Treatments */}
        <Button className="w-48 p-4 text-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition">
          Go to Treatments
        </Button>
      </div>
    </div>
  );
};

export default DataEntryOperatorHome;
