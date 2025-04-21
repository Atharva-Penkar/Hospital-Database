import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '@/assets/images/logo.png';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogOut, Sun, Moon } from "lucide-react";
import { toast } from "sonner";

// --- Types ---
type Doctor = {
  D_ID: number;
  name: string;
  specialization: string;
  mail?: string;
  phone: string;
  shift?: string;
  available: boolean;
};

type Appointment = {
  A_ID: number;
  P_ID: number;
  TimeStamp: string;
  Status: string;
  Symptoms?: string;
  patient: {
    name: string;
    P_ID: number;
  };
};

type AdmittedPatient = {
  admit_id: number;
  P_ID: number;
  admit_time: string;
  R_no: number;
  status: string;
  patient: {
    name: string;
    P_ID: number;
  };
  room: {
    Room_No: number;
    Room_Type: string;
  };
};

// --- All backend base URLs ---
const BASE_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev",
  "http://localhost:5000"
];

const LOGOUT_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/auth-staff/logout/doctor",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/auth-staff/logout/doctor",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/auth-staff/logout/doctor",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/auth-staff/logout/doctor",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/auth-staff/logout/doctor",
  "http://localhost:5000/api/auth-staff/logout/doctor"
];

// --- Helper: try all base URLs in order for a given endpoint ---
async function fetchFromAllBases(bases: string[], endpoint: string, options?: RequestInit) {
  let lastError;
  for (let base of bases) {
    try {
      const res = await fetch(`${base}${endpoint}`, options);
      if (res.ok) return await res.json();
      lastError = new Error(`HTTP error ${res.status} from ${base}${endpoint}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("All fetch attempts failed");
}

const DoctorHome: React.FC = () => {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<Appointment[]>([]);
  const [admittedPatients, setAdmittedPatients] = useState<AdmittedPatient[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "admitted">("pending");


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
              userId: localStorage.getItem("D_ID") || ""
            }),
          });
          if (!res.ok) {
            console.error(`Logout error from ${base}: ${res.status}`);
            continue;
          }
          logoutSuccess = true;
          break; // Successful logout, exit the loop
        } catch (err) {
          lastError = err;
          console.error(`Logout error from ${base}:`, err);
        }
      }
      if (!logoutSuccess) {
        throw lastError;
      }
      localStorage.removeItem("D_ID");
      toast.success("Logout successful!");
      navigate("/login-staff");
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error("Logout failed: " + error.message);
    }
  };

  // Get doctorId from localStorage on mount
  useEffect(() => {
    const id = Number(localStorage.getItem("D_ID"));
    if (id) {
      setDoctorId(id);
    } else {
      setFetchError("No doctor ID found. Please log in again.");
      navigate("/staff-login");
    }
  }, []);

  // Fetch all data in parallel using for-loop fallback logic, only when doctorId is available
  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    setFetchError(null);

    const endpoints = [
      `/api/doctor-info/${doctorId}`,
      `/api/doctor-pending/${doctorId}`,
      `/api/doctor-completed/${doctorId}`,
      `/api/doctor-admitted/${doctorId}`,
    ];

    (async () => {
      try {
        const [doctorRes, pendingRes, completedRes, admittedRes] = await Promise.all(
          endpoints.map(ep => fetchFromAllBases(BASE_URLS, ep))
        );
        setDoctor(doctorRes.doctor);
        setPendingAppointments(pendingRes.appointments || []);
        setCompletedAppointments(completedRes.appointments || []);
        setAdmittedPatients(admittedRes.admitted || []);
      } catch (err: any) {
        setFetchError("Unable to fetch data from any available server.");
      } finally {
        setLoading(false);
      }
    })();
  }, [doctorId]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Request discharge for a patient using all bases
  const handleRequestDischarge = async (admit_id: number) => {
    if (!doctorId) return;
    let dischargeSuccess = false;
    for (let base of BASE_URLS) {
      try {
        const res = await fetch(`${base}/api/doctor-admitted/${doctorId}/discharge/${admit_id}/`, { method: "PUT" });
        if (res.ok) {
          dischargeSuccess = true;
          break;
        }
      } catch { }
    }
    if (dischargeSuccess) {
      setAdmittedPatients((prev) =>
        prev.filter((p) => p.admit_id !== admit_id)
      );
    } else {
      // Optionally show an error toast
    }
  };

  // Navigation for appointment details
  const handleAppointmentClick = (A_ID: number) => {
    localStorage.setItem("appointmentId", String(A_ID));
    if (activeTab === "pending") {
      navigate("/doctor-pending");
    } else if (activeTab === "completed") {
      navigate("/doctor-complete");
    }
    // No navigation for admitted tab
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
          <Button
            variant="destructive"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Doctor Profile */}
        <Card className={`rounded-2xl shadow-md ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Doctor Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            {loading ? (
              <p>Loading...</p>
            ) : fetchError ? (
              <p className="text-red-500">{fetchError}</p>
            ) : doctor ? (
              <>
                <p><strong>Doctor ID:</strong> {doctor.D_ID}</p>
                <p><strong>Name:</strong> {doctor.name}</p>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Email:</strong> {doctor.mail || "N/A"}</p>
                <p><strong>Phone:</strong> {doctor.phone}</p>
                <p><strong>Shift:</strong> {doctor.shift || "N/A"}</p>
                <p><strong>Available:</strong> {doctor.available ? "Yes" : "No"}</p>
              </>
            ) : (
              <p>Doctor not found.</p>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs
          defaultValue="pending"
          className="w-full"
          onValueChange={val => setActiveTab(val as "pending" | "completed" | "admitted")}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Appointments</TabsTrigger>
            <TabsTrigger value="completed">Completed Appointments</TabsTrigger>
            <TabsTrigger value="admitted">Admitted Patients</TabsTrigger>
          </TabsList>

          {/* Pending Appointments */}
          <TabsContent value="pending">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>Pending Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : fetchError ? (
                  <p className="text-red-500">{fetchError}</p>
                ) : pendingAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending appointments.</p>
                ) : (
                  <ul className="divide-y">
                    {pendingAppointments.map((appt) => (
                      <li
                        key={appt.A_ID}
                        className="py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                        onClick={() => handleAppointmentClick(appt.A_ID)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleAppointmentClick(appt.A_ID);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{appt.patient.name} (ID: {appt.patient.P_ID})</div>
                            <div className="text-xs">
                              {new Date(appt.TimeStamp).toLocaleString()}
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">{appt.Status}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Appointments */}
          <TabsContent value="completed">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>Completed Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : fetchError ? (
                  <p className="text-red-500">{fetchError}</p>
                ) : completedAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No completed appointments.</p>
                ) : (
                  <ul className="divide-y">
                    {completedAppointments.map((appt) => (
                      <li
                        key={appt.A_ID}
                        className="py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                        onClick={() => handleAppointmentClick(appt.A_ID)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleAppointmentClick(appt.A_ID);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{appt.patient.name} (ID: {appt.patient.P_ID})</div>
                            <div className="text-xs">
                              {new Date(appt.TimeStamp).toLocaleString()}
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">{appt.Status}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admitted Patients */}
          <TabsContent value="admitted">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>Admitted Patients</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : fetchError ? (
                  <p className="text-red-500">{fetchError}</p>
                ) : admittedPatients.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No admitted patients.</p>
                ) : (
                  <ul className="divide-y">
                    {admittedPatients.map((patient) => (
                      <li key={patient.admit_id} className="py-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="font-semibold">{patient.patient.name} (ID: {patient.patient.P_ID})</div>
                            <div className="text-xs">
                              Room: {patient.room.Room_No} ({patient.room.Room_Type}) &nbsp;|&nbsp; Admitted on: {new Date(patient.admit_time).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleRequestDischarge(patient.admit_id)}
                            >
                              Request Discharge
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorHome;
