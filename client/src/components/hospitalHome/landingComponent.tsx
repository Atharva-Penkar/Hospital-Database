import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from '@/assets/images/logo.png';
import landingBG from '@/assets/images/landingBG.png';
import { Sun, Moon } from "lucide-react";

interface HospitalHomePageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const HospitalHome = ({ darkMode, toggleDarkMode }: HospitalHomePageProps) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "text-blue-400" : "text-black"}`}>
      {/* Top Bar */}
      <div className={`w-full px-6 py-2 flex justify-between items-center ${darkMode ? "bg-zinc-900" : "bg-white"} shadow z-10`}>
        <div className="flex items-center gap-4">
          <img src={logo} alt="Hospital Logo" className="h-12 w-12 sm:h-14 sm:w-14" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">MASA Hospital</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <div
            className="relative w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            <div
              className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-1"}`}
            />
            <div className="absolute inset-0 flex justify-between items-center px-1">
              <Sun className="w-3 h-3 text-yellow-500" />
              <Moon className="w-3 h-3 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section with Background Image */}
      <div
        className="flex flex-1 flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${landingBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 w-full h-full bg-black opacity-40 pointer-events-none" style={{ zIndex: 0 }}></div>
        {/* Login Box */}
        <main
          className={`relative z-10 flex flex-col items-center justify-center
    rounded-lg p-10 shadow-lg w-full max-w-md my-16
    transition-colors duration-300
    ${darkMode
              ? "bg-zinc-900 text-blue-200 border border-zinc-700"
              : "bg-white text-gray-900 border border-gray-200"
            }`
          }
        >
          <div className="space-y-8 w-full">
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
    </div>
  );
};

export default HospitalHome;
