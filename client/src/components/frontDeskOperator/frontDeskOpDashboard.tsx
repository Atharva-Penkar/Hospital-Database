import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Sun, Moon } from "lucide-react";

interface HomePageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const HomePage = ({ darkMode, toggleDarkMode }: HomePageProps) => {
  const cards = [
    { title: "Schedule Appointment", desc: "Book appointments for patients with doctors." },
    { title: "Admit Patient", desc: "Admit patients to wards or rooms." },
    { title: "Schedule Test", desc: "Schedule diagnostic tests for patients." },
    { title: "Schedule Treatment", desc: "Assign treatments or procedures to patients." },
  ];

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"}`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src="/hospital-logo.png" alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">MediCare Hospital</h1>
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

          <Button variant="destructive" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Function Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`transition duration-300 hover:shadow-xl ${darkMode ? "hover:shadow-white bg-gray-800 border-gray-700" : ""}`}
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
