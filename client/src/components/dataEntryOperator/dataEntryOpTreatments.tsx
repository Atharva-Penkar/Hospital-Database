import React, { useEffect, useState } from "react";
import logo from '@/assets/images/logo.png';
import { Button } from "@/components/ui/button";
import { LogOut, Sun, Moon } from "lucide-react";

interface Treatment {
  treatment_id: number;
  A_ID: number;
  treatmentType: { treatment_name: string };
  Status: string;
  patient: { name: string; P_ID: number };
  doctor: { name: string };
  timeStamp: string;
  outcome?: string;
}

const mockPendingTreatments: Treatment[] = [
  {
    treatment_id: 1,
    A_ID: 201,
    treatmentType: { treatment_name: "Physiotherapy" },
    Status: "Pending",
    patient: { name: "Emily Brown", P_ID: 2001 },
    doctor: { name: "Dr. Anderson" },
    timeStamp: "2025-04-16T08:00:00",
  },
  {
    treatment_id: 2,
    A_ID: 202,
    treatmentType: { treatment_name: "Chemotherapy" },
    Status: "Pending",
    patient: { name: "Chris Davis", P_ID: 2002 },
    doctor: { name: "Dr. Johnson" },
    timeStamp: "2025-04-16T09:00:00",
  },
  {
    treatment_id: 3,
    A_ID: 203,
    treatmentType: { treatment_name: "Dialysis" },
    Status: "Pending",
    patient: { name: "Laura Hall", P_ID: 2003 },
    doctor: { name: "Dr. Williams" },
    timeStamp: "2025-04-16T10:00:00",
  },
  {
    treatment_id: 4,
    A_ID: 204,
    treatmentType: { treatment_name: "Radiation Therapy" },
    Status: "Pending",
    patient: { name: "Anna Clark", P_ID: 2004 },
    doctor: { name: "Dr. Davis" },
    timeStamp: "2025-04-16T11:00:00",
  },
  {
    treatment_id: 5,
    A_ID: 205,
    treatmentType: { treatment_name: "Surgery" },
    Status: "Pending",
    patient: { name: "Tom Brown", P_ID: 2005 },
    doctor: { name: "Dr. Brown" },
    timeStamp: "2025-04-16T12:00:00",
  },
];

const mockCompletedTreatments: Treatment[] = [
  {
    treatment_id: 21,
    A_ID: 221,
    treatmentType: { treatment_name: "Physiotherapy" },
    Status: "Completed",
    patient: { name: "John Taylor", P_ID: 2021 },
    doctor: { name: "Dr. Patel" },
    timeStamp: "2025-04-15T08:00:00",
    outcome: "Patient improved, mobility increased.",
  },
  {
    treatment_id: 22,
    A_ID: 222,
    treatmentType: { treatment_name: "Chemotherapy" },
    Status: "Completed",
    patient: { name: "Robert Moore", P_ID: 2022 },
    doctor: { name: "Dr. Davis" },
    timeStamp: "2025-04-15T09:00:00",
    outcome: "Treatment completed, patient stable.",
  },
  {
    treatment_id: 23,
    A_ID: 223,
    treatmentType: { treatment_name: "Dialysis" },
    Status: "Completed",
    patient: { name: "Laura Doe", P_ID: 2023 },
    doctor: { name: "Dr. Williams" },
    timeStamp: "2025-04-15T10:00:00",
    outcome: "No complications, patient discharged.",
  },
];

const DataEntryOpTreatments = ({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => {
  const [pendingTreatments, setPendingTreatments] = useState<Treatment[]>([]);
  const [completedTreatments, setCompletedTreatments] = useState<Treatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [outcome, setOutcome] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setPendingTreatments(mockPendingTreatments);
    setCompletedTreatments(mockCompletedTreatments);
  }, []);

  const handleSelectTreatment = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setOutcome("");
    setMessage(null);
  };

  const handleSaveOutcome = () => {
    if (!selectedTreatment || !outcome.trim()) {
      setMessage({ type: "error", text: "Please enter an outcome before saving." });
      return;
    }
    const updatedTreatment: Treatment = { ...selectedTreatment, Status: "Completed", outcome };
    setPendingTreatments((prev) => prev.filter((t) => t.treatment_id !== selectedTreatment.treatment_id));
    setCompletedTreatments((prev) => [...prev, updatedTreatment]);
    setSelectedTreatment(null);
    setOutcome("");
    setMessage({ type: "success", text: "Treatment outcome saved successfully!" });
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"
        }`}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Treatments Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
            onClick={toggleDarkMode}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-7" : "translate-x-1"
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

      {/* Alert Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded ${message.type === "success"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Treatments List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Pending Treatments</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto pr-2 border">
            {pendingTreatments.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No pending treatments</div>
            ) : (
              pendingTreatments.map((treatment) => (
                <div
                  key={treatment.treatment_id}
                  onClick={() => handleSelectTreatment(treatment)}
                  className={`p-3 border-b cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 ${selectedTreatment?.treatment_id === treatment.treatment_id
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : ""
                    }`}
                >
                  <div className="font-medium">{treatment.treatmentType.treatment_name}</div>
                  <div className="text-sm">
                    {treatment.patient.name} (ID: {treatment.patient.P_ID})
                    <br />
                    Doctor: {treatment.doctor.name}
                    <br />
                    Date: {new Date(treatment.timeStamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Outcome Entry */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Enter Outcome</h2>
          {selectedTreatment ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <div className="mb-2">
                <span className="font-semibold">Treatment:</span> {selectedTreatment.treatmentType.treatment_name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Patient:</span> {selectedTreatment.patient.name} (ID: {selectedTreatment.patient.P_ID})
              </div>
              <div className="mb-2">
                <span className="font-semibold">Doctor:</span> {selectedTreatment.doctor.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Date:</span> {new Date(selectedTreatment.timeStamp).toLocaleDateString()}
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1" htmlFor="outcome">
                  Outcome
                </label>
                <textarea
                  id="outcome"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="Enter treatment outcome"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveOutcome} disabled={!outcome.trim()}>
                  Save Outcome
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => setSelectedTreatment(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border text-center text-gray-500">
              Select a pending treatment to enter outcome
            </div>
          )}
        </div>

        {/* Completed Treatments List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Completed Treatments</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto pr-2 border">
            {completedTreatments.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No completed treatments</div>
            ) : (
              completedTreatments.map((treatment) => (
                <div key={treatment.treatment_id} className="p-3 border-b">
                  <div className="font-medium">{treatment.treatmentType.treatment_name}</div>
                  <div className="text-sm">
                    {treatment.patient.name} (ID: {treatment.patient.P_ID})
                    <br />
                    Doctor: {treatment.doctor.name}
                    <br />
                    Date: {new Date(treatment.timeStamp).toLocaleDateString()}
                    <br />
                    <span className="font-semibold">Outcome:</span> {treatment.outcome || "No outcome"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEntryOpTreatments;
