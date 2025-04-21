"use client";
import { Button } from "@/components/ui/button";
import logo from '@/assets/images/logo.png';
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HomePageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const BACKEND_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev",
  "http://localhost:5000"
];

const HomePage = ({ darkMode, toggleDarkMode }: HomePageProps) => {
  const navigate = useNavigate();

  const cards = [
    { title: "Schedule Appointment", desc: "Book appointments for patients with doctors.", path: "/front-desk-appointments" },
    { title: "Admit Patient", desc: "Admit patients to wards or rooms.", path: "/front-desk-admissions" },
    { title: "Schedule Test", desc: "Schedule diagnostic tests for patients.", path: "/front-desk-tests" },
    { title: "Schedule Treatment", desc: "Assign treatments or procedures to patients.", path: "/front-desk-treatments" },
  ];

  // Function to call logout API and navigate to /login-staff with Sonner toast notifications.
  const handleLogout = async () => {
    try {
      let lastError: any = null;
      let logoutSuccess = false;
      for (const base of BACKEND_URLS) {
        try {
          const res = await fetch(`${base}/api/auth-staff/logout/fdo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: localStorage.getItem("operator_ID") || ""
            }),
          });
          if (!res.ok) {
            console.error(`Logout error from ${base}: ${res.status}`);
            continue;
          }
          logoutSuccess = true;
          break;
        } catch (err) {
          lastError = err;
          console.error(`Logout error from ${base}:`, err);
        }
      }
      if (!logoutSuccess) {
        throw lastError;
      }
      localStorage.removeItem("operator_ID");
      toast.success("Logout successful!");
      navigate("/login-staff");
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error("Logout failed: " + error.message);
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"}`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Hospital Logo" className="h-16 w-16" />
          <h1 className="text-3xl font-bold">MASA Hospital</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle Switch */}
          <div
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
            onClick={toggleDarkMode}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-7" : "translate-x-1"}`}
            />
            <div className="absolute inset-0 flex justify-between items-center px-1.5">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Moon className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          <Button variant="destructive" className="flex items-center gap-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Function Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition duration-300 hover:shadow-xl ${darkMode ? "hover:shadow-white bg-gray-800 border-gray-700" : ""}`}
            onClick={() => navigate(card.path)}
          >
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-sm">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
