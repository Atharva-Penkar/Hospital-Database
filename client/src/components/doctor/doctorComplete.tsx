import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut, Sun, Moon } from "lucide-react";

// Mock data
const mockPatient = {
  name: "John Doe",
  age: 42,
  sex: "M",
  P_ID: 1001,
  medicalHistory: [
    "Type 2 Diabetes (2018)",
    "Allergy: Penicillin",
    "Hypertension (2021)"
  ]
};

const mockAppointment = {
  date: "2025-04-17",
  time: "10:30",
  symptoms: "Fever, headache, body ache",
  notes: "Patient reports symptoms for last 3 days.",
  diagnosis: "Common Cold",
  admit: false,
  prescribedTests: [
    { name: "Blood Test", status: "Completed", result: "Normal CBC, no infection." },
    { name: "X-Ray", status: "Pending" },
    { name: "ECG", status: "Cancelled" }
  ],
  prescribedTreatments: [
    { name: "Paracetamol", dosage: "101", duration: "5" },
    { name: "Antihistamine", dosage: "111", duration: "3" }
  ]
};

const dosageLabels: Record<string, string> = {
  "100": "Morning only",
  "010": "Afternoon only",
  "001": "Night only",
  "110": "Morning & Afternoon",
  "101": "Morning & Night",
  "011": "Afternoon & Night",
  "111": "All three times"
};

const DoctorComplete: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

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

      {/* Patient Info & Medical History */}
      <Card className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-2">
              <div><b>Name:</b> {mockPatient.name}</div>
              <div><b>Patient ID:</b> {mockPatient.P_ID}</div>
              <div><b>Age:</b> {mockPatient.age}</div>
              <div><b>Sex:</b> {mockPatient.sex}</div>
            </div>
            <div className="flex-1">
              <b>Medical History:</b>
              <ul className="list-disc ml-6">
                {mockPatient.medicalHistory.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
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
              <div><b>Date:</b> {mockAppointment.date}</div>
              <div><b>Time:</b> {mockAppointment.time}</div>
              <div><b>Symptoms:</b> {mockAppointment.symptoms}</div>
              <div><b>Notes:</b> {mockAppointment.notes}</div>
              <div><b>Diagnosis:</b> {mockAppointment.diagnosis}</div>
              <div><b>Admit:</b> {mockAppointment.admit ? "Yes" : "No"}</div>
            </CardContent>
          </Card>

          {/* Prescribed Treatments */}
          <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
            <CardHeader>
              <CardTitle>Prescribed Treatments</CardTitle>
            </CardHeader>
            <CardContent>
              {mockAppointment.prescribedTreatments.length === 0 ? (
                <div>No treatments prescribed.</div>
              ) : (
                <ul>
                  {mockAppointment.prescribedTreatments.map((t, i) => (
                    <li key={i} className="mb-2">
                      <b>{t.name}</b> | Dosage: {dosageLabels[t.dosage] || t.dosage} | Duration: {t.duration} days
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
              {mockAppointment.prescribedTests.length === 0 ? (
                <div>No tests prescribed.</div>
              ) : (
                <ul>
                  {mockAppointment.prescribedTests.map((test, i) => (
                    <li key={i} className="mb-3">
                      <b>{test.name}</b> <br />
                      Status:{" "}
                      <span
                        className={
                          test.status === "Completed"
                            ? "text-green-600"
                            : test.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {test.status}
                      </span>
                      {test.status === "Completed" && test.result && (
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
    </div>
  );
};

export default DoctorComplete;
