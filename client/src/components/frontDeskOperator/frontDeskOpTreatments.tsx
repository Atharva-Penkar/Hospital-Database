"use client";

import { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut } from "lucide-react";
import { format } from "date-fns";

// Updated type definitions based on the JSON returned by the server.
type TreatmentPatient = {
  treatment_id: number;    // Unique treatment id (from t.treatment_id)
  patient_id: number;      // Patient id from t.appointment.patient.P_ID
  name: string;            // From t.appointment.patient.name
  sex: string;             // From t.appointment.patient.Sex
  dob: string;             // From t.appointment.patient.DOB
  treatmentType: string;   // From t.treatment.treatment_name
};

type ScheduledTreatment = {
  treatment_id: number;    // Unique treatment id (from t.treatment_id)
  patient_id: number;      // Patient id from t.appointment.patient.P_ID
  name: string;            // From t.appointment.patient.name
  scheduledAt: string;     // From t.TimeStamp
  treatmentType: string;   // From t.treatment.treatment_name
};

// Backend endpoint URLs. (Update these as necessary)
const REQUESTED_TREATMENTS_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/front-desk-operator/treatments/requested",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/front-desk-operator/treatments/requested",
  "http://localhost:5000/api/front-desk-operator/treatments/requested",
];

const SCHEDULED_TREATMENTS_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/front-desk-operator/treatments/scheduled",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/front-desk-operator/treatments/scheduled",
  "http://localhost:5000/api/front-desk-operator/treatments/scheduled",
];

const SCHEDULE_TREATMENT_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/front-desk-operator/treatments/schedule",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/front-desk-operator/treatments/schedule",
  "http://localhost:5000/api/front-desk-operator/treatments/schedule",
];

const FrontDeskOpTreatments = ({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => {
  // State for fetched treatments from the backend
  const [requestedTreatments, setRequestedTreatments] = useState<TreatmentPatient[]>([]);
  const [scheduledTreatments, setScheduledTreatments] = useState<ScheduledTreatment[]>([]);
  const [loadingRequested, setLoadingRequested] = useState<boolean>(true);
  const [loadingScheduled, setLoadingScheduled] = useState<boolean>(true);

  // Selected treatment from the Requested treatments list.
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentPatient | null>(null);
  // Scheduling inputs: only date and time.
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const isFormComplete = selectedTreatment && selectedDate && selectedTime;

  // Fetch treatments with status Requested.
  useEffect(() => {
    const fetchRequested = async () => {
      setLoadingRequested(true);
      for (const url of REQUESTED_TREATMENTS_URLS) {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.error(`[RequestedTreatments] ${url} returned status ${res.status}`);
            continue;
          }
          const data = await res.json();
          if (!Array.isArray(data.treatments)) {
            throw new Error(`[RequestedTreatments] ${url} did not return an array`);
          }
          const treatments: TreatmentPatient[] = data.treatments.map((t: any) => ({
            treatment_id: t.treatment_id,
            patient_id: t.appointment?.patient?.P_ID,
            name: t.appointment?.patient?.name,
            sex: t.appointment?.patient?.Sex,
            dob: t.appointment?.patient?.DOB,
            treatmentType: t.treatment?.treatment_name,
          }));
          console.log("[RequestedTreatments] Fetched treatments:", treatments);
          setRequestedTreatments(treatments);
          break; // Stop after a successful fetch.
        } catch (err) {
          console.error("[RequestedTreatments] Error fetching from", err);
        }
      }
      setLoadingRequested(false);
    };
    fetchRequested();
  }, []);

  // Fetch treatments with status Scheduled.
  useEffect(() => {
    const fetchScheduled = async () => {
      setLoadingScheduled(true);
      for (const url of SCHEDULED_TREATMENTS_URLS) {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.error(`[ScheduledTreatments] ${url} returned status ${res.status}`);
            continue;
          }
          const data = await res.json();
          if (!Array.isArray(data.treatments)) {
            throw new Error(`[ScheduledTreatments] ${url} did not return an array`);
          }
          const treatments: ScheduledTreatment[] = data.treatments.map((t: any) => ({
            treatment_id: t.treatment_id,
            patient_id: t.appointment?.patient?.P_ID,
            name: t.appointment?.patient?.name,
            scheduledAt: t.TimeStamp,
            treatmentType: t.treatment?.treatment_name,
          }));
          console.log("[ScheduledTreatments] Fetched treatments:", treatments);
          setScheduledTreatments(treatments);
          break;
        } catch (err) {
          console.error("[ScheduledTreatments] Error fetching from", err);
        }
      }
      setLoadingScheduled(false);
    };
    fetchScheduled();
  }, []);

  // Scheduling handler: calls backend to update treatment status and timestamp.
  const handleSchedule = async () => {
    if (!selectedTreatment || !isFormComplete) return;
    const newTime = `${selectedDate}T${selectedTime}:00`;
    console.log("[handleSchedule] Scheduling treatment", selectedTreatment.treatment_id, "with new time", newTime);
    for (const url of SCHEDULE_TREATMENT_URLS) {
      try {
        const res = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test_id: selectedTreatment.treatment_id, newTime }),
        });
        if (!res.ok) {
          console.error(`[handleSchedule] ${url} returned status ${res.status}`);
          continue;
        }
        const data = await res.json();
        console.log("[handleSchedule] Successfully scheduled treatment:", data);
        const newScheduled: ScheduledTreatment = {
          treatment_id: selectedTreatment.treatment_id,
          patient_id: selectedTreatment.patient_id,
          name: selectedTreatment.name,
          scheduledAt: newTime,
          treatmentType: selectedTreatment.treatmentType,
        };
        // Update local state: remove the treatment from "requested" and add it to "scheduled".
        setRequestedTreatments((prev) =>
          prev.filter((t) => t.treatment_id !== selectedTreatment.treatment_id)
        );
        setScheduledTreatments((prev) => [...prev, newScheduled]);
        // Clear scheduling selections.
        setSelectedTreatment(null);
        setSelectedDate("");
        setSelectedTime("");
        return;
      } catch (err) {
        console.error(`[handleSchedule] Error scheduling from ${url}:`, err);
      }
    }
    console.error("[handleSchedule] Failed to schedule treatment from all backends.");
  };

  return (
    <div className={`min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4 ${darkMode ? "bg-gray-900 text-blue-400" : ""}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Treatment Scheduling</h1>
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
          <Button variant="destructive" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>
      {/* Main Content Panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel: Requested Treatments */}
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">Requested Treatments</h2>
          {loadingRequested ? (
            <div className="text-gray-500">Loading...</div>
          ) : requestedTreatments.length === 0 ? (
            <div className="text-gray-500">No requested treatments found.</div>
          ) : (
            <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
              {requestedTreatments.map((p) => (
                <div
                  key={p.treatment_id}
                  className="p-2 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSelectedTreatment(p)}
                >
                  {p.name} (Patient ID: {p.patient_id}) — {p.treatmentType}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Right Panel: Scheduled Treatments */}
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">Scheduled Treatments</h2>
          {loadingScheduled ? (
            <div className="text-gray-500">Loading...</div>
          ) : scheduledTreatments.length === 0 ? (
            <div className="text-gray-500">No scheduled treatments found.</div>
          ) : (
            <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
              {scheduledTreatments.map((p) => (
                <div key={p.treatment_id} className="p-2 border-b">
                  <div>
                    {p.name} (Patient ID: {p.patient_id}) — {p.treatmentType}
                  </div>
                  <div className="text-sm text-gray-500">
                    {p.scheduledAt ? format(new Date(p.scheduledAt), "PPPp") : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Scheduling Panel for Selected Treatment */}
      {selectedTreatment && (
        <div className={`mt-4 p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">
            Schedule Treatment for {selectedTreatment.name}
          </h2>
          <div className="text-sm mb-2">
            <p>
              <strong>Treatment:</strong> {selectedTreatment.treatmentType}
            </p>
            <p>
              <strong>Patient ID:</strong> {selectedTreatment.patient_id}
            </p>
            <p>
              <strong>Sex:</strong> {selectedTreatment.sex}
            </p>
            <p>
              <strong>DOB:</strong>{" "}
              {selectedTreatment.dob ? format(new Date(selectedTreatment.dob), "PPP") : "N/A"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <button
            className={`w-full px-4 py-2 rounded text-white font-medium mt-3 ${
              isFormComplete ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormComplete}
            onClick={handleSchedule}
          >
            Schedule Treatment
          </button>
        </div>
      )}
    </div>
  );
};

export default FrontDeskOpTreatments;
