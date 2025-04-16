"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut } from "lucide-react";
import { format } from "date-fns";

type TreatmentPatient = {
  id: number;
  name: string;
  sex: string;
  dob: string;
  treatmentType: string;
};

type ScheduledTreatment = {
  id: number;
  name: string;
  scheduledAt: string;
  dosage: string;
  duration: string;
  treatmentType: string;
};

const initialPendingTreatments: TreatmentPatient[] = [
  { id: 601, name: "Ravi Joshi", sex: "M", dob: "1990-03-15", treatmentType: "Physiotherapy" },
  { id: 602, name: "Priya Menon", sex: "F", dob: "1985-07-30", treatmentType: "Chemotherapy" },
  { id: 603, name: "Akhil Sinha", sex: "M", dob: "1978-11-21", treatmentType: "Radiation Therapy" },
  { id: 604, name: "Lata Kapoor", sex: "F", dob: "1992-01-05", treatmentType: "Dialysis" },
  { id: 605, name: "Sohail Khan", sex: "M", dob: "1986-09-19", treatmentType: "Immunotherapy" },
];

const initialScheduledTreatments: ScheduledTreatment[] = [
  {
    id: 701,
    name: "Anita Sharma",
    scheduledAt: "2025-04-18T08:00",
    dosage: "101",
    duration: "3",
    treatmentType: "Chemotherapy",
  },
];

const dosageOptions = ["000", "001", "010", "011", "100", "101", "110", "111"];
const durationOptions = ["1", "2", "3", "4", "5"];

const FrontDeskOpTreatments = ({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => {
  const [pendingTreatments, setPendingTreatments] = useState<TreatmentPatient[]>(initialPendingTreatments);
  const [scheduledTreatments, setScheduledTreatments] = useState<ScheduledTreatment[]>(initialScheduledTreatments);
  const [selectedPatient, setSelectedPatient] = useState<TreatmentPatient | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDosage, setSelectedDosage] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");

  const handleSchedule = () => {
    if (!selectedPatient || !selectedDate || !selectedTime || !selectedDosage || !selectedDuration) return;
    const scheduledAt = `${selectedDate}T${selectedTime}`;

    const newScheduled: ScheduledTreatment = {
      id: selectedPatient.id,
      name: selectedPatient.name,
      scheduledAt,
      dosage: selectedDosage,
      duration: selectedDuration,
      treatmentType: selectedPatient.treatmentType,
    };

    setScheduledTreatments((prev) => [...prev, newScheduled]);
    setPendingTreatments((prev) => prev.filter((p) => p.id !== selectedPatient.id));
    setSelectedPatient(null);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedDosage("");
    setSelectedDuration("");
  };

  const isFormComplete =
    selectedPatient && selectedDate && selectedTime && selectedDosage && selectedDuration;

  return (
    <div
      className={`min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4 ${
        darkMode ? "bg-gray-900 text-blue-400" : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/hospital-logo.png" alt="Hospital Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Treatment Scheduling</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <div
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
            onClick={toggleDarkMode}
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

          <Button variant="destructive" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pending Treatments */}
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">Pending Treatments</h2>
          <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
            {pendingTreatments.map((p) => (
              <div
                key={p.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setSelectedPatient(p)}
              >
                {p.name} (ID: {p.id})
              </div>
            ))}
          </div>

          {selectedPatient && (
            <div className="mt-4 border-t pt-4 space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>ID:</strong> {selectedPatient.id}</p>
              <p><strong>Sex:</strong> {selectedPatient.sex}</p>
              <p><strong>DOB:</strong> {format(new Date(selectedPatient.dob), "PPP")}</p>
              <p><strong>Treatment:</strong> {selectedPatient.treatmentType}</p>

              {/* Scheduling Inputs */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded px-2 py-1 w-full dark:text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="border rounded px-2 py-1 w-full dark:text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dosage</label>
                  <select
                    value={selectedDosage}
                    onChange={(e) => setSelectedDosage(e.target.value)}
                    className="border rounded px-2 py-1 w-full dark:text-black"
                  >
                    <option value="">Select</option>
                    {dosageOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (days)</label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="border rounded px-2 py-1 w-full dark:text-black"
                  >
                    <option value="">Select</option>
                    {durationOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className={`w-full px-4 py-2 rounded text-white font-medium mt-3 ${
                  isFormComplete
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isFormComplete}
                onClick={handleSchedule}
              >
                Schedule Treatment
              </button>
            </div>
          )}
        </div>

        {/* Scheduled Treatments */}
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">Scheduled Treatments</h2>
          <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
            {scheduledTreatments.map((p) => (
              <div key={p.id} className="p-2 border-b">
                <strong>{p.name}</strong> — {format(new Date(p.scheduledAt), "PPPp")} — {p.treatmentType} — Dosage: {p.dosage} — Duration: {p.duration} days
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskOpTreatments;
