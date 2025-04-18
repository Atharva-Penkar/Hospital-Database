import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Sun, Moon } from "lucide-react";

// Mock data for dropdowns
const DIAGNOSIS_OPTIONS = [
  "Hypertension",
  "Diabetes",
  "Common Cold",
  "Asthma",
  "Migraine",
];

const TEST_OPTIONS = [
  "Blood Test",
  "X-Ray",
  "MRI",
  "ECG",
  "Urine Test",
];

const TREATMENT_OPTIONS = [
  "Paracetamol",
  "Insulin",
  "Antibiotics",
  "Inhaler",
  "Antihistamine",
];

const DOSAGE_OPTIONS = [
  { value: "100", label: "Morning only" },
  { value: "010", label: "Afternoon only" },
  { value: "001", label: "Night only" },
  { value: "110", label: "Morning & Afternoon" },
  { value: "101", label: "Morning & Night" },
  { value: "011", label: "Afternoon & Night" },
  { value: "111", label: "All three times" },
];

// Mock patient and appointment data
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
  date: "2025-04-18",
  time: "09:30",
  symptoms: "Fever, headache, body ache",
  notes: "Patient reports symptoms for last 3 days."
};

const DoctorPending = () => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Form state
  const [diagnosis, setDiagnosis] = useState("");
  const [tests, setTests] = useState<string[]>([]);
  const [treatments, setTreatments] = useState<
    { name: string; dosage: string; duration: string }[]
  >([]);
  const [admit, setAdmit] = useState(false);

  // For treatment selection
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [selectedDosage, setSelectedDosage] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAddTreatment = () => {
    if (selectedTreatment && selectedDosage && selectedDuration) {
      setTreatments((prev) => [
        ...prev,
        {
          name: selectedTreatment,
          dosage: selectedDosage,
          duration: selectedDuration,
        },
      ]);
      setSelectedTreatment("");
      setSelectedDosage("");
      setSelectedDuration("");
    }
  };

  const handleRemoveTreatment = (idx: number) => {
    setTreatments((prev) => prev.filter((_, i) => i !== idx));
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
          {/* Toggle Switch */}
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

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Appointment Request Details & Actions */}
        <div className="flex-1 space-y-6">
          <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
            <CardHeader>
              <CardTitle>Appointment Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div><b>Date:</b> {mockAppointment.date}</div>
              <div><b>Time:</b> {mockAppointment.time}</div>
              <div><b>Symptoms:</b> {mockAppointment.symptoms}</div>
              <div><b>Notes:</b> {mockAppointment.notes}</div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
            <CardHeader>
              <CardTitle>Doctor Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Diagnosis */}
              <div className="mb-4">
                <label className="font-semibold block mb-1">Diagnosis</label>
                <select
                  className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                >
                  <option value="">Select diagnosis</option>
                  {DIAGNOSIS_OPTIONS.map((diag) => (
                    <option key={diag} value={diag}>{diag}</option>
                  ))}
                </select>
              </div>

              {/* Tests */}
              <div className="mb-4">
                <label className="font-semibold block mb-1">Tests to Prescribe</label>
                <select
                  multiple
                  className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                  value={tests}
                  onChange={e =>
                    setTests(Array.from(e.target.selectedOptions, o => o.value))
                  }
                >
                  {TEST_OPTIONS.map((test) => (
                    <option key={test} value={test}>{test}</option>
                  ))}
                </select>
                <div className="text-xs mt-1 text-gray-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</div>
              </div>

              {/* Treatments */}
              <div className="mb-4">
                <label className="font-semibold block mb-1">Treatments to Prescribe</label>
                <div className="flex flex-col md:flex-row gap-2 mb-2">
                  <select
                    className="flex-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                    value={selectedTreatment}
                    onChange={e => setSelectedTreatment(e.target.value)}
                  >
                    <option value="">Select treatment</option>
                    {TREATMENT_OPTIONS.map((treat) => (
                      <option key={treat} value={treat}>{treat}</option>
                    ))}
                  </select>
                  <select
                    className="flex-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                    value={selectedDosage}
                    onChange={e => setSelectedDosage(e.target.value)}
                  >
                    <option value="">Dosage</option>
                    {DOSAGE_OPTIONS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    placeholder="Duration (days)"
                    className="flex-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                    value={selectedDuration}
                    onChange={e => setSelectedDuration(e.target.value)}
                  />
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleAddTreatment}
                    disabled={!selectedTreatment || !selectedDosage || !selectedDuration}
                  >
                    Add
                  </Button>
                </div>
                {/* List of added treatments */}
                <ul>
                  {treatments.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm mb-1">
                      <span>
                        {t.name} | Dosage: {t.dosage} | Duration: {t.duration} days
                      </span>
                      <Button size="sm" variant="outline" onClick={() => handleRemoveTreatment(idx)}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Admit */}
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="admit"
                  checked={admit}
                  onChange={e => setAdmit(e.target.checked)}
                  className="h-5 w-5"
                />
                <label htmlFor="admit" className="font-semibold">Admit Patient</label>
              </div>

              {/* Submit Button */}
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-4">
                Submit Doctor's Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorPending;
