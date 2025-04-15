// components/frontDeskOperator/HomePage.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src="/hospital-logo.png" alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">MediCare Hospital</h1>
        </div>
        <Button variant="destructive" className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Main Functionalities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Schedule Appointment</h2>
            <p className="text-sm text-gray-600">Book appointments for patients with doctors.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Admit Patient</h2>
            <p className="text-sm text-gray-600">Admit patients to wards or rooms.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Schedule Test</h2>
            <p className="text-sm text-gray-600">Schedule diagnostic tests for patients.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Schedule Treatment</h2>
            <p className="text-sm text-gray-600">Assign treatments or procedures to patients.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
