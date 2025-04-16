import { useState } from "react";
import { Database, Users, Calendar, ChevronRight } from "lucide-react";
import PatientsTable from "./PatientTable";
import DoctorsTable from "./DoctorTable";
import TestsTable from "./TestTable";

const DatabaseManager = () => {
  const [activeDatabase, setActiveDatabase] = useState<string | null>(null);
  
  const sidebarItems = [
    { icon: Users, label: "Patients", id: "patients" },
    { icon: Users, label: "Doctors", id: "doctors" },
    { icon: Users, label: "Tests Available", id: "tests" },
    { icon: Calendar, label: "Appointments", id: "appointments" }
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 fixed left-0 top-0 h-full bg-blue-800 text-white">
        {/* Hospital Logo */}
        <div className="p-4 border-b border-opacity-20 flex items-center gap-2">
          <h1 className="text-xl font-bold">Hospital DB</h1>
        </div>
        
        {/* Sidebar Items */}
        <div className="p-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveDatabase(item.id)}
              className={`w-full flex items-center p-3 rounded-lg mb-1 transition-colors
                ${activeDatabase === item.id 
                  ? "bg-blue-700" 
                  : "hover:bg-blue-700 hover:bg-opacity-50"}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
              {activeDatabase === item.id && <ChevronRight className="ml-auto w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold">Hospital Database Manager</h1>
        </header>
        
        {/* Content Area */}
        <main className="p-6">
          {activeDatabase ? (
            <>
              {activeDatabase === "patients" && <PatientsTable />}
              {activeDatabase === "doctors" && <DoctorsTable />}
              {activeDatabase === "tests" && <TestsTable />}
              {activeDatabase === "appointments" && (
                <div className="text-center py-10">
                  <h2 className="text-2xl font-bold mb-4">Appointments</h2>
                  <p>Appointments management system will be available soon.</p>
                </div>
              )}
            </>
          ) : (
            // Empty state when no database is selected
            <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
              <Database className="w-20 h-20 text-gray-300" />
              <h2 className="mt-6 text-xl font-semibold text-gray-500">
                Select a database from the sidebar
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Choose an option from the left to view and manage data
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DatabaseManager;