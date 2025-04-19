import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut, Sun, Moon } from "lucide-react";

const dosageLabels: Record<string, string> = {
  "NNN": "None",
  "YNN": "Morning only",
  "NYN": "Afternoon only",
  "NNY": "Night only",
  "YYN": "Morning & Afternoon",
  "YNY": "Morning & Night",
  "NYY": "Afternoon & Night",
  "YYY": "All three times"
};

const DoctorComplete: React.FC = () => {
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("appointmentId");
    setAppointmentId(id);
    // Use appointmentId in your fetch logic
  }, []);
  
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
        <>
          {/* Patient Info & Medical History */}
          <Card className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-2">
                  <div><b>Name:</b> {appointment.patient?.name}</div>
                  <div><b>Patient ID:</b> {appointment.P_ID}</div>
                  {/* Add age/sex if available in your backend response */}
                </div>
                {/* If you want to show medical history, you can add another fetch or expand your backend */}
              </div>
            </CardContent>
          </Card>

          {/* Appointment Summary */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
                <CardHeader>
                  <CardTitle>Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div><b>Date:</b> {appointment.TimeStamp ? new Date(appointment.TimeStamp).toLocaleDateString() : ""}</div>
                  <div><b>Time:</b> {appointment.TimeStamp ? new Date(appointment.TimeStamp).toLocaleTimeString() : ""}</div>
                  <div><b>Symptoms:</b> {appointment.Symptoms || "N/A"}</div>
                  <div>
                    <b>Diagnosis:</b>{" "}
                    {appointment.diagnosis?.length
                      ? appointment.diagnosis.map((d: any) => d.diagnosis_Name).join(", ")
                      : "N/A"}
                  </div>
                  <div><b>Doctor:</b> {appointment.doctor?.name}</div>
                  <div><b>Admit:</b> {appointment.admit ? "Yes" : "No"}</div>
                </CardContent>
              </Card>

              {/* Prescribed Treatments */}
              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
                <CardHeader>
                  <CardTitle>Prescribed Treatments</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointment.Treatment?.length === 0 ? (
                    <div>No treatments prescribed.</div>
                  ) : (
                    <ul>
                      {appointment.Treatment.map((t: any, i: number) => (
                        <li key={i} className="mb-2">
                          <b>{t.treatment?.treatment_name}</b> | Dosage: {dosageLabels[t.dosage] || t.dosage} | Duration: {t.duration} days
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Prescribed Tests & Results */}
            <div className="flex-1">
              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
                <CardHeader>
                  <CardTitle>Prescribed Tests & Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointment.tests?.length === 0 ? (
                    <div>No tests prescribed.</div>
                  ) : (
                    <ul>
                      {appointment.tests.map((test: any, i: number) => (
                        <li key={i} className="mb-3">
                          <b>{test.test?.test_name}</b> <br />
                          Status:{" "}
                          <span
                            className={
                              test.Status === "Completed"
                                ? "text-green-600"
                                : test.Status === "Pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }
                          >
                            {test.Status}
                          </span>
                          {test.Status === "Completed" && test.result && (
                            <div>
                              <b>Result:</b> {test.result}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorComplete;
