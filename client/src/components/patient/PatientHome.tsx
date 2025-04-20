import { useEffect, useState } from "react";
import logo from '@/assets/images/logo.png';
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Sun, Moon } from "lucide-react";

// BACKEND_URLS remains the same.
const BACKEND_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev",
  "http://localhost:5000"
];

type Patient = {
  P_ID: number;
  name: string;
  address: string;
  DOB: string;
  Sex: string; // Returned as "Sex" (capitalized)
  mail: string;
  phone_no: string;
  emergency_phone_no: string;
  admissions: any[];
  allergies: { allergy_name: string }[];
};

type Appointment = {
  A_ID: number;
  TimeStamp: string;
  Status: "Requested" | "Scheduled" | "Finished";
  Symptoms?: string;
};

// New type for Medical History – each record has an id and a related disease.
type MedicalHistoryRecord = {
  history_id: number;
  disease: {
    Disease_Name: string;
    Description?: string;
  };
};

// Fallback function to try multiple backend URLs.
const fetchFromFallbackURLs = async (path: string, options?: RequestInit) => {
  let lastError: any = null;
  for (const baseUrl of BACKEND_URLS) {
    try {
      const res = await fetch(baseUrl + path, options);
      if (!res.ok) {
        console.error(`Error from ${baseUrl + path}: status ${res.status}`);
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      console.error(`Error fetching from ${baseUrl + path}:`, err);
    }
  }
  throw lastError;
};

// Status to color mapping for appointments.
const statusColors: { [key: string]: string } = {
  Requested: "text-red-600",
  Scheduled: "text-yellow-600",
  Finished: "text-green-600",
};

const PatientHome = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  
  // Appointment-related state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(true);

  // Medical History state
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryRecord[]>([]);
  const [loadingMedicalHistory, setLoadingMedicalHistory] = useState<boolean>(true);
  
  // Appointment submission state (for the Request Appointment tab)
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    message: "",
  });
  
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode effect on mount using localStorage.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    } else if (savedTheme === "light") {
      setDarkMode(false);
      document.body.classList.remove("dark");
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch patient details.
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");
        const res = await fetchFromFallbackURLs(`/api/patient/${userId}`);
        const data = await res.json();
        console.log("Fetched patient:", data.patient);
        setPatient(data.patient);
      } catch (err) {
        console.error("Error fetching patient:", err);
      } finally {
        setLoadingPatient(false);
      }
    };
    fetchPatient();
  }, []);

  // Fetch appointments once patient data is available.
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patient) return;
      setLoadingAppointments(true);
      try {
        const res = await fetchFromFallbackURLs(`/api/appointments/patient/${patient.P_ID}`);
        const data = await res.json();
        if (Array.isArray(data.appointments)) {
          console.log("Fetched appointments:", data.appointments);
          setAppointments(data.appointments);
        } else {
          throw new Error("Invalid appointments data");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        toast.error("Failed to fetch appointments");
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, [patient]);

  // Fetch medical history once patient data is available.
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!patient) return;
      setLoadingMedicalHistory(true);
      try {
        // Assuming the endpoint uses a query parameter for P_ID.
        const res = await fetchFromFallbackURLs(`/api/patient/medical-history/P_ID=${patient.P_ID}`);
        const data = await res.json();
        if (Array.isArray(data.medicalHistory)) {
          console.log("Fetched medical history:", data.medicalHistory);
          setMedicalHistory(data.medicalHistory);
        } else {
          throw new Error("Invalid medical history data");
        }
      } catch (err) {
        console.error("Error fetching medical history:", err);
        toast.error("Failed to fetch medical history");
      } finally {
        setLoadingMedicalHistory(false);
      }
    };
    fetchMedicalHistory();
  }, [patient]);

  // Appointment submission handler.
  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");
      const TimeStamp = new Date(`${appointmentData.date}T${appointmentData.time}:00`).toISOString();
      const res = await fetchFromFallbackURLs("/api/appointments/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          P_ID: Number(userId),
          D_ID: 0,
          TimeStamp,
          Symptoms: appointmentData.message || null,
        }),
      });
      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("application/json") ? await res.json() : null;
      if (!res.ok) throw new Error(data?.message || "Failed to request appointment");
      toast.success("Appointment requested successfully!");
      setAppointmentData({ date: "", time: "", message: "" });
    } catch (err: any) {
      console.error("Error occurred:", err);
      toast.error(`Failed: ${err.message}`);
    }
  };

  // Logout handler.
  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");
      const res = await fetchFromFallbackURLs("/api/auth-patient/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to log out");
      localStorage.removeItem("userId");
      toast.success("Logged out successfully");
      navigate("/login-patient");
    } catch (err: any) {
      toast.error(`Logout failed: ${err.message}`);
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

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Patient Profile */}
        <Card className={`rounded-2xl shadow-md ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Patient Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            {loadingPatient ? (
              <p>Loading...</p>
            ) : patient ? (
              <>
                <p><strong>User ID:</strong> {patient.P_ID}</p>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Address:</strong> {patient.address}</p>
                <p><strong>DOB:</strong> {format(new Date(patient.DOB), "MM/dd/yyyy")}</p>
                <p><strong>Sex:</strong> {patient.Sex}</p>
                <p><strong>Email:</strong> {patient.mail}</p>
                <p><strong>Phone:</strong> {patient.phone_no}</p>
                <p><strong>Emergency Contact:</strong> {patient.emergency_phone_no}</p>
                <p><strong>Admissions:</strong> {patient.admissions.length}</p>
                <p>
                  <strong>Allergies:</strong>{" "}
                  {patient.allergies && patient.allergies.length > 0
                    ? patient.allergies.map((a) => a.allergy_name).join(", ")
                    : "None"}
                </p>
              </>
            ) : (
              <p>Patient not found.</p>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="request">Request Appointment</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAppointments ? (
                  <p>Loading appointments...</p>
                ) : appointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No appointments found.</p>
                ) : (
                  <ul className="space-y-2">
                    {appointments.map((appt) => (
                      <li key={appt.A_ID} className={statusColors[appt.Status] || "text-base"}>
                        {format(new Date(appt.TimeStamp), "PPP p")} - {appt.Status}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical History Tab */}
          <TabsContent value="history">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMedicalHistory ? (
                  <p>Loading medical history...</p>
                ) : medicalHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No medical history available.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-2">
                    {medicalHistory.map((record) => (
                      <li key={record.history_id}>
                        <strong>{record.disease.Disease_Name}</strong>: {record.disease.Description || "No description"}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Request Appointment Tab */}
          <TabsContent value="request">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>Request Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="mb-2 block">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      name="date"
                      value={appointmentData.date}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="mb-2 block">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      name="time"
                      value={appointmentData.time}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="mb-2 block">Symptoms / Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={appointmentData.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your symptoms or concerns"
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Submit Appointment Request
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientHome;
