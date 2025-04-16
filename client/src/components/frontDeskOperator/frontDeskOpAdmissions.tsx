import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import { format } from "date-fns";

type Patient = {
  id: number;
  name: string;
  sex: string;
  dob: string;
  reason: string;
};

type AdmittedPatient = {
  id: number;
  name: string;
  ward: number;
  admissionDateTime: string;
};

const initialSeekingPatients: Patient[] = [
  { id: 101, name: "Riya Sharma", sex: "F", dob: "1998-05-23", reason: "High fever" },
  { id: 102, name: "Aman Gupta", sex: "M", dob: "2000-11-12", reason: "Stomach pain" },
  { id: 103, name: "Neha Mehta", sex: "F", dob: "1985-04-03", reason: "Fracture" },
];

const initialAdmittedPatients: AdmittedPatient[] = [
  { id: 201, name: "Rakesh Kumar", ward: 5, admissionDateTime: "2025-04-14T10:00" },
  { id: 202, name: "Priya Desai", ward: 12, admissionDateTime: "2025-04-15T14:30" },
];

const TOTAL_ROOMS = 40;

const FrontDeskOpAdmissions = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
  const [seekingPatients, setSeekingPatients] = useState<Patient[]>(initialSeekingPatients);
  const [admittedPatients, setAdmittedPatients] = useState<AdmittedPatient[]>(initialAdmittedPatients);
  const [selectedSeek, setSelectedSeek] = useState<Patient | null>(null);
  const [selectedDischarge, setSelectedDischarge] = useState<AdmittedPatient | null>(null);

  const getOccupiedRooms = () => {
    return admittedPatients.reduce((acc, p) => {
      acc[p.ward] = p.id;
      return acc;
    }, {} as Record<number, number>);
  };

  const handleAdmit = (ward: number) => {
    if (!selectedSeek) return;

    const now = new Date().toISOString();
    const newAdmitted: AdmittedPatient = {
      id: selectedSeek.id,
      name: selectedSeek.name,
      ward,
      admissionDateTime: now,
    };

    setAdmittedPatients((prev) => [...prev, newAdmitted]);
    setSeekingPatients((prev) => prev.filter((p) => p.id !== selectedSeek.id));
    setSelectedSeek(null);
  };

  const handleDischarge = () => {
    if (!selectedDischarge) return;
    setAdmittedPatients((prev) => prev.filter((p) => p.id !== selectedDischarge.id));
    setSelectedDischarge(null);
  };

  const occupiedRooms = getOccupiedRooms();

  return (
    <div className={`min-h-screen p-4 grid grid-rows-[auto_1fr_auto] gap-4 ${darkMode ? "bg-gray-900 text-blue-400" : ""}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/hospital-logo.png" alt="Hospital Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Admissions</h1>
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

      {/* Upper Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Seeking Admissions */}
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">Seeking Admission</h2>
          <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
            {seekingPatients.map((p) => (
              <div
                key={p.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setSelectedSeek(p);
                  setSelectedDischarge(null);
                }}
              >
                {p.name} (ID: {p.id})
              </div>
            ))}
          </div>
          {selectedSeek && (
            <div className="mt-4 border-t pt-4 space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedSeek.name}</p>
              <p><strong>ID:</strong> {selectedSeek.id}</p>
              <p><strong>Sex:</strong> {selectedSeek.sex}</p>
              <p><strong>DOB:</strong> {format(new Date(selectedSeek.dob), "PPP")}</p>
              <p><strong>Reason:</strong> {selectedSeek.reason}</p>
              <p><strong>Select an available ward:</strong></p>
            </div>
          )}
        </div>

        {/* Discharge Requests */}
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">Discharge Requests</h2>
          <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
            {admittedPatients.map((p) => (
              <div
                key={p.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setSelectedDischarge(p);
                  setSelectedSeek(null);
                }}
              >
                {p.name} (ID: {p.id})
              </div>
            ))}
          </div>
          {selectedDischarge && (
            <div className="mt-4 border-t pt-4 space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedDischarge.name}</p>
              <p><strong>ID:</strong> {selectedDischarge.id}</p>
              <p><strong>Admitted on:</strong> {format(new Date(selectedDischarge.admissionDateTime), "PPPp")}</p>
              <Button variant="destructive" onClick={handleDischarge}>
                Discharge Patient
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Ward Grid */}
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: TOTAL_ROOMS }, (_, i) => {
          const roomNumber = i + 1;
          const isOccupied = roomNumber in occupiedRooms;
          const isClickable = !isOccupied && !!selectedSeek;

          return (
            <div
              key={roomNumber}
              className={`aspect-square flex items-center justify-center rounded-lg text-center font-semibold transition-colors 
                ${isOccupied
                  ? "bg-rose-500 text-white cursor-not-allowed"
                  : isClickable
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                    : "bg-emerald-300 text-white cursor-default"}`}
              onClick={() => isClickable && handleAdmit(roomNumber)}
            >
              {isOccupied ? (
                <>
                  Room {roomNumber}
                  <br />
                  PID: {occupiedRooms[roomNumber]}
                </>
              ) : (
                `Room ${roomNumber}`
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FrontDeskOpAdmissions;
