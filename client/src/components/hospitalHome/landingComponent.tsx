import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from '@/assets/images/logo.png';
import { Sun, Moon } from "lucide-react";

interface HospitalHomePageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const HospitalHome = ({ darkMode, toggleDarkMode }: HospitalHomePageProps) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen p-6 flex flex-col transition-colors duration-300 ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"}`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-6">
          <img src={logo} alt="Hospital Logo" className="h-24 w-24 sm:h-28 sm:w-28" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">MASA Hospital</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <div
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            <div
              className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                darkMode ? "translate-x-7" : "translate-x-1"
              }`}
            />
            <div className="absolute inset-0 flex justify-between items-center px-1.5">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Moon className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Login Choices */}
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="space-y-8 w-full max-w-md">
          <Button
            className="w-full text-2xl py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg"
            onClick={() => navigate("/login-patient")}
          >
            Patient Login/SignUp
          </Button>
          <Button
            className="w-full text-2xl py-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg"
            onClick={() => navigate("/login-staff")}
          >
            Staff Login
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HospitalHome;
