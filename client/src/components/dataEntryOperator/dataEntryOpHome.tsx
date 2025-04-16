import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Sun, Moon, FileText, Clipboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // or use Next.js router if applicable

interface DataEntryOpHomeProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DataEntryOpHome = ({ darkMode, toggleDarkMode }: DataEntryOpHomeProps) => {
  const navigate = useNavigate(); // For React Router
  // const router = useRouter(); // Uncomment for Next.js

  const handleNavigateToTests = () => {
    navigate('/data-entry-tests');
    // router.push('/dataoperator/tests'); // Uncomment for Next.js
  };

  const handleNavigateToTreatments = () => {
    navigate('/data-entry-treatments');
    // router.push('/dataoperator/treatments'); // Uncomment for Next.js
  };

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

      {/* Welcome Card */}
      <Card className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
        <CardHeader>
          <CardTitle>Data Entry Operator Dashboard</CardTitle>
          <CardDescription>Welcome to the data entry portal. Select an option below to continue.</CardDescription>
        </CardHeader>
      </Card>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Tests Card */}
        <Card
          className={`transition duration-300 hover:shadow-xl cursor-pointer ${darkMode ? "hover:shadow-white bg-gray-800 border-gray-700" : ""}`}
          onClick={handleNavigateToTests}
        >
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-4 py-4">
              <FileText className={`w-12 h-12 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <div>
                <h2 className="text-xl font-semibold mb-2">Tests</h2>
                <p className="text-sm">Manage and enter test results for patients.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatments Card */}
        <Card
          className={`transition duration-300 hover:shadow-xl cursor-pointer ${darkMode ? "hover:shadow-white bg-gray-800 border-gray-700" : ""}`}
          onClick={handleNavigateToTreatments}
        >
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-4 py-4">
              <Clipboard className={`w-12 h-12 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <div>
                <h2 className="text-xl font-semibold mb-2">Treatments</h2>
                <p className="text-sm">Schedule and manage patient treatments.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>© 2025 MediCare Hospital. All rights reserved.</p>
      </div>
    </div>
  );
};

export default DataEntryOpHome;
