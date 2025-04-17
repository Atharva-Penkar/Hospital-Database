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

// TypeScript type for patient
type Patient = {
  P_ID: number;
  name: string;
  address: string;
  DOB: string;
  sex: string;
  mail: string;
  phone_no: string;
  emergency_phone_no: string;
  allergies: { name: string }[];
  admissions: any[];
};

const PatientHome = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    message: "",
  });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add("dark");
    } else if (savedTheme === 'light') {
      setDarkMode(false);
      document.body.classList.remove("dark");
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const TimeStamp = new Date(
        `${appointmentData.date}T${appointmentData.time}:00`
      ).toISOString();

      const res = await fetch("http://localhost:5000/api/appointments/request", {
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

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const res = await fetch("http://localhost:5000/api/auth-patient/logout", {
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

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");

        const res = await fetch(`http://localhost:5000/api/patient/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch patient");

        const data = await res.json();
        setPatient(data.patient);
      } catch (err) {
        console.error("Error fetching patient:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

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
            <LogOut className="w-4 h-4" />
            Logout
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
            {loading ? (
              <p>Loading...</p>
            ) : patient ? (
              <>
                <p><strong>User ID:</strong> {patient.P_ID}</p>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Address:</strong> {patient.address}</p>
                <p><strong>DOB:</strong> {format(new Date(patient.DOB), "MM/dd/yyyy")}</p>
                <p><strong>Sex:</strong> {patient.sex}</p>
                <p><strong>Email:</strong> {patient.mail}</p>
                <p><strong>Phone:</strong> {patient.phone_no}</p>
                <p><strong>Emergency Contact:</strong> {patient.emergency_phone_no}</p>
                <p><strong>Admissions:</strong> {patient.admissions.length}</p>
                <p><strong>Allergies:</strong> {patient.allergies.map(a => a.name).join(", ") || "None"}</p>
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

          <TabsContent value="appointments">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>Previous Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No appointments found.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No medical history available.</p>
              </CardContent>
            </Card>
          </TabsContent>

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
