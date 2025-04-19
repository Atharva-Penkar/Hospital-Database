import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut, Sun, Moon } from "lucide-react";

const DoctorPending: React.FC = () => {
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("appointmentId");
    setAppointmentId(id);
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      setError(null);
      const urls = [
        "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev",
        "http://127.0.0.1:5000"
      ];
      let lastError: any = null;
      for (let base of urls) {
        try {
          const res = await fetch(`${base}/api/appointment-details/${appointmentId}`);
          if (res.ok) {
            const data = await res.json();
            setAppointment(data.appointment);
            setLoading(false);
            return;
          } else {
            lastError = new Error(`HTTP error ${res.status} from ${base}`);
          }
        } catch (err) {
          lastError = err;
        }
      }
      setError(lastError?.message || "Error fetching appointment details");
      setLoading(false);
    };
    if (appointmentId) fetchAppointment();
  }, [appointmentId]);

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
            onClick={() => setDarkMode((prev) => !prev)}
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

      {/* Loading/Error */}
      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}

      {/* Show only after loading and if appointment exists */}
      {!loading && appointment && (
        <Card className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardHeader>
            <CardTitle>Pending Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div><b>Patient Name:</b> {appointment.patient?.name}</div>
              <div><b>Patient ID:</b> {appointment.P_ID}</div>
              <div><b>Date:</b> {appointment.TimeStamp ? new Date(appointment.TimeStamp).toLocaleDateString() : ""}</div>
              <div><b>Time:</b> {appointment.TimeStamp ? new Date(appointment.TimeStamp).toLocaleTimeString() : ""}</div>
              <div><b>Symptoms:</b> {appointment.Symptoms || "N/A"}</div>
              {/* Add more fields as needed */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorPending;
