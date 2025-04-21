// import { useState } from "react";
// import { Database, Users, Calendar, ChevronRight, LogOut, Sun, Moon } from "lucide-react";
// import { Button } from "@/components/ui/button"; // <-- Import your custom Button component
// import PatientsTable from "@/components/DBmanager/PatientTable";
// import DoctorsTable from "@/components/DBmanager/DoctorTable";
// import TestsTable from "@/components/DBmanager/TestTablenew";

// interface HomePageProps {
//     darkMode: boolean;
//     toggleDarkMode: () => void;
//   }  

// // Theme Toggle Switch Component
// const ThemeToggleSwitch = ({ darkMode, toggleDarkMode } : HomePageProps) => (
//   <div
//     className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
//     onClick={toggleDarkMode}
//     title="Toggle theme"
//   >
//     <div
//       className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
//         darkMode ? "translate-x-7" : "translate-x-1"
//       }`}
//     />
//     <div className="absolute inset-0 flex justify-between items-center px-1.5">
//       <Sun className="w-4 h-4 text-yellow-500" />
//       <Moon className="w-4 h-4 text-blue-400" />
//     </div>
//   </div>
// );

// // Logout Button Component
// const LogoutButton = ({ onLogout }) => (
//   <Button
//     variant="destructive"
//     className="flex items-center gap-2"
//     onClick={onLogout}
//     title="Logout"
//   >
//     <LogOut className="w-4 h-4" />
//     Logout
//   </Button>
// );

// // Main DatabaseManager Component
// const DatabaseManager = () => {
//   const [activeDatabase, setActiveDatabase] = useState<string | null>(null);
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => setDarkMode((prev) => !prev);
//   const handleLogout = () => {
//     // Implement your logout logic here
//     alert("Logged out!");
//   };

//   const sidebarItems = [
//     { icon: Users, label: "Patients", id: "patients" },
//     { icon: Users, label: "Doctors", id: "doctors" },
//     { icon: Users, label: "Tests Available", id: "tests" },
//     { icon: Calendar, label: "Appointments", id: "appointments" }
//   ];

//   return (
//     <div className={`min-h-screen flex transition-colors duration-300 font-sans ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"}`}>
//       {/* Sidebar */}
//       <div className={`w-64 fixed left-0 top-0 h-full ${darkMode ? "bg-gray-800" : "bg-blue-800"} text-white`}>
//          <img src="/hospital-logo.png" alt="Hospital Logo" className="h-12 w-12" />
//          <h1 className="text-3xl font-bold">MediCare Hospital</h1>
//         <div className="p-4 border-b border-opacity-20 flex items-center gap-2">
//           <h1 className="text-xl font-bold">Hospital DB</h1>
//         </div>
//         {/* Sidebar Items */}
//         <div className="p-2">
//           {sidebarItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveDatabase(item.id)}
//               className={`w-full flex items-center p-3 rounded-lg mb-1 transition-colors font-semibold
//                 ${activeDatabase === item.id 
//                   ? (darkMode ? "bg-gray-700" : "bg-blue-700")
//                   : (darkMode ? "hover:bg-gray-700" : "hover:bg-blue-700 hover:bg-opacity-50")}`}
//             >
//               <item.icon className="w-5 h-5 mr-3" />
//               <span>{item.label}</span>
//               {activeDatabase === item.id && <ChevronRight className="ml-auto w-4 h-4" />}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 ml-64">
//         {/* Top Bar */}
//         <header className={`h-16 flex items-center px-6 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//           <h1 className="text-xl font-semibold flex-1">Hospital Database Manager</h1>
//           <div className="flex items-center gap-4">
//             <ThemeToggleSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
//             <LogoutButton onLogout={handleLogout} />
//           </div>
//         </header>
        
//         {/* Content Area */}
//         <main className="p-6">
//           {activeDatabase ? (
//             <>
//               {activeDatabase === "patients" && <PatientsTable  darkMode={darkMode}/>}
//               {activeDatabase === "doctors" && <DoctorsTable darkMode={darkMode} />}
//               {activeDatabase === "tests" && <TestsTable darkMode={darkMode} />}
//               {activeDatabase === "appointments" && (
//                 <div className="text-center py-10">
//                   <h2 className="text-2xl font-bold mb-4">Appointments</h2>
//                   <p>Appointments management system will be available soon.</p>
//                 </div>
//               )}
//             </>
//           ) : (
//             // Empty state when no database is selected
//             <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
//               <Database className="w-20 h-20 text-gray-300" />
//               <h2 className="mt-6 text-xl font-semibold text-gray-500 dark:text-blue-300">
//                 Select a database from the sidebar
//               </h2>
//               <p className="mt-2 text-sm text-gray-400 dark:text-blue-200">
//                 Choose an option from the left to view and manage data
//               </p>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DatabaseManager;
// pages/DatabaseManager.jsx

import { useState } from "react";
import { Database, Users, Calendar, ChevronRight, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust path as needed
import PatientsTable from "@/components/DBmanager/PatientTable";
import DoctorsTable from "@/components/DBmanager/DoctorTable";
import TestsTable from "@/components/DBmanager/TestTablenew";
import ProfilePage from "@/components/DBmanager/ProfilePage";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";



interface LogoutButtonProps {
  onLogout: () => void;
}

interface HomePageProps {
      darkMode: boolean;
      toggleDarkMode: () => void;
    }  
// Theme Toggle Switch
const LOGOUT_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/auth-staff/logout/da",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/auth-staff/logout/da",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/auth-staff/logout/da",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/auth-staff/logout/da",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/auth-staff/logout/da",
  "http://localhost:5000/api/auth-staff/logout/da"
];


const ThemeToggleSwitch = ({ darkMode, toggleDarkMode }:HomePageProps) => (
  <div
    className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
    onClick={toggleDarkMode}
    title="Toggle theme"
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
);

// Logout Button
const LogoutButton = ({ onLogout }: LogoutButtonProps) => (
  <Button
    variant="destructive"
    className="flex items-center gap-2"
    onClick={onLogout}
    title="Logout"
  >
    <LogOut className="w-4 h-4" />
    Logout
  </Button>
);

// Sidebar items (excluding Home)
const sidebarItems = [
  { icon: Users, label: "Patients", id: "patients" },
  { icon: Users, label: "Doctors", id: "doctors" },
  { icon: Users, label: "Tests Available", id: "tests" },
  // { icon: Calendar, label: "Appointments", id: "appointments" }
];

// Dummy user data (replace with real user data if available)
const user = { id: "D12345", name: "John Doe" };

const DatabaseManager = () => {
  const [activeDatabase, setActiveDatabase] = useState("home");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const navigate = useNavigate()
  
 const handleLogout = async () => {
     try {
       let lastError: any = null;
       let logoutSuccess = false;
       for (const base of LOGOUT_URLS) {
         try {
           const res = await fetch(base, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               userId: localStorage.getItem("administrator_ID") || ""
             }),
           });
           if (!res.ok) {
             console.error(`Logout error from ${base}: ${res.status}`);
             continue;
           }
           logoutSuccess = true;
           break; // Break out if successful
         } catch (err) {
           lastError = err;
           console.error(`Logout error from ${base}:`, err);
         }
       }
       if (!logoutSuccess) {
         throw lastError;
       }
       localStorage.removeItem("administrator_ID");
       toast.success("Logout successful!");
       navigate("/login-staff");
     } catch (error: any) {
       console.error("Logout failed:", error);
       toast.error("Logout failed: " + error.message);
     }
   };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 font-sans ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"}`}>
      {/* Sidebar */}
      <div className={`w-64 fixed left-0 top-0 h-full ${darkMode ? "bg-gray-800" : "bg-blue-800"} text-white`}>
        <img src="/hospital-logo.png" alt="Hospital Logo" className="h-12 w-12" />
        <h1 className="text-3xl font-bold">MediCare Hospital</h1>
        <div className="p-4 border-b border-opacity-20 flex items-center gap-2">
          <h1 className="text-xl font-bold">Hospital DB</h1>
        </div>
        {/* Sidebar Items */}
        <div className="p-2 pb-24"> {/* pb-24 creates space for Home button */}
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveDatabase(item.id)}
              className={`w-full flex items-center p-3 rounded-lg mb-1 transition-colors font-semibold
                ${activeDatabase === item.id 
                  ? (darkMode ? "bg-gray-700" : "bg-blue-700")
                  : (darkMode ? "hover:bg-gray-700" : "hover:bg-blue-700 hover:bg-opacity-50")}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
              {activeDatabase === item.id && <ChevronRight className="ml-auto w-4 h-4" />}
            </button>
          ))}
        </div>
        {/* Home Button at Bottom */}
        <div className="absolute bottom-6 left-0 w-full px-2">
          <button
            onClick={() => setActiveDatabase("home")}
            className={`w-full flex items-center p-3 rounded-lg transition-colors font-semibold
              ${activeDatabase === "home" 
                ? (darkMode ? "bg-gray-700" : "bg-blue-700")
                : (darkMode ? "hover:bg-gray-700" : "hover:bg-blue-700 hover:bg-opacity-50")}`}
          >
            <Database className="w-5 h-5 mr-3" />
            <span>Home</span>
            {activeDatabase === "home" && <ChevronRight className="ml-auto w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className={`h-16 flex items-center px-6 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h1 className="text-xl font-semibold flex-1">Hospital Database Manager</h1>
          <div className="flex items-center gap-4">
            <ThemeToggleSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <LogoutButton onLogout={handleLogout} />
          </div>
        </header>
        
        {/* Content Area */}
        <main className="p-6">
          {activeDatabase === "patients" && <PatientsTable darkMode={darkMode} />}
          {activeDatabase === "doctors" && <DoctorsTable darkMode={darkMode} />}
          {activeDatabase === "tests" && <TestsTable darkMode={darkMode} />}
          {/* {activeDatabase === "appointments" && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-4">Appointments</h2>
              <p>Appointments management system will be available soon.</p>
            </div>
          )} */}
          {activeDatabase === "home" && <ProfilePage user={user} darkMode={darkMode} />}
          {!activeDatabase && (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
              <Database className="w-20 h-20 text-gray-300" />
              <h2 className="mt-6 text-xl font-semibold text-gray-500 dark:text-blue-300">
                Select a database from the sidebar
              </h2>
              <p className="mt-2 text-sm text-gray-400 dark:text-blue-200">
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
