import { useState } from "react";
import logo from '@/assets/images/logo.png';
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

type WardType = "General" | "Maternity" | "ICU" | "";

const initialSeekingPatients: Patient[] = [
  { id: 101, name: "Riya Sharma", sex: "F", dob: "1998-05-23", reason: "High fever" },
  { id: 102, name: "Aman Gupta", sex: "M", dob: "2000-11-12", reason: "Stomach pain" },
  { id: 103, name: "Neha Mehta", sex: "F", dob: "1985-04-03", reason: "Fracture" },
  { id: 104, name: "Anjali Verma", sex: "F", dob: "1990-01-15", reason: "Migraine" },
  { id: 105, name: "Rahul Yadav", sex: "M", dob: "1988-08-22", reason: "Chest pain" },
  { id: 106, name: "Sneha Joshi", sex: "F", dob: "1995-12-30", reason: "Injury" },
  { id: 107, name: "Vikram Rao", sex: "M", dob: "1983-03-19", reason: "Fatigue" },
  { id: 108, name: "Tina Singh", sex: "F", dob: "1997-10-11", reason: "Back pain" },
  { id: 109, name: "Deepak Roy", sex: "M", dob: "1991-06-07", reason: "Vomiting" },
  { id: 110, name: "Pooja Das", sex: "F", dob: "1994-09-29", reason: "Cough" }
];

const initialAdmittedPatients: AdmittedPatient[] = [
  { id: 201, name: "Rakesh Kumar", ward: 5, admissionDateTime: "2025-04-14T10:00" },
  { id: 202, name: "Priya Desai", ward: 12, admissionDateTime: "2025-04-15T14:30" },
  { id: 203, name: "Rohan Shetty", ward: 8, admissionDateTime: "2025-04-13T09:15" },
  { id: 204, name: "Kajal Sinha", ward: 17, admissionDateTime: "2025-04-12T18:45" },
  { id: 205, name: "Nikhil Mehra", ward: 21, admissionDateTime: "2025-04-10T11:20" },
  { id: 206, name: "Meena Patil", ward: 3, admissionDateTime: "2025-04-16T08:10" },
  { id: 207, name: "Suresh Nair", ward: 25, admissionDateTime: "2025-04-13T16:00" },
  { id: 208, name: "Alok Tripathi", ward: 30, admissionDateTime: "2025-04-14T20:00" },
  { id: 209, name: "Geeta Rani", ward: 33, admissionDateTime: "2025-04-11T12:45" },
  { id: 210, name: "Sunil Dube", ward: 37, admissionDateTime: "2025-04-15T07:30" }
];

const TOTAL_ROOMS = 40;

const getWardTypeForRoom = (room: number): WardType => {
  if (room >= 1 && room <= 20) return "General";
  if (room >= 21 && room <= 30) return "Maternity";
  if (room >= 31 && room <= 40) return "ICU";
  return "";
};

const wardTypeRanges: Record<WardType, [number, number]> = {
  General: [1, 20],
  Maternity: [21, 30],
  ICU: [31, 40],
  "": [1, 40]
};

// Track all occupied rooms, including those admitted via this UI
const FrontDeskOpAdmissions = ({
  darkMode,
  toggleDarkMode
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => {
  const [seekingPatients, setSeekingPatients] = useState<Patient[]>(initialSeekingPatients);
  const [admittedPatients, setAdmittedPatients] = useState<AdmittedPatient[]>(initialAdmittedPatients);
  const [selectedSeek, setSelectedSeek] = useState<Patient | null>(null);
  const [selectedDischarge, setSelectedDischarge] = useState<AdmittedPatient | null>(null);
  const [selectedWardType, setSelectedWardType] = useState<WardType>("");

  const [occupiedRooms, setOccupiedRooms] = useState<Record<number, number>>(() => {
    const occ: Record<number, number> = {};
    for (const p of initialAdmittedPatients) {
      occ[p.ward] = p.id;
    }
    return occ;
  });

  const handleAdmit = (ward: number) => {
    if (!selectedSeek) return;
    setOccupiedRooms(prev => ({ ...prev, [ward]: selectedSeek.id }));
    setSeekingPatients(prev => prev.filter((p) => p.id !== selectedSeek.id));
    setSelectedSeek(null);
    setSelectedWardType("");
  };

  const handleDischarge = () => {
    if (!selectedDischarge) return;
    setAdmittedPatients((prev) => prev.filter((p) => p.id !== selectedDischarge.id));
    setOccupiedRooms(prev => {
      const updated = { ...prev };
      const room = selectedDischarge.ward;
      delete updated[room];
      return updated;
    });
    setSelectedDischarge(null);
  };

  return (
    <div className={`min-h-screen p-2 sm:p-4 grid grid-rows-[auto_1fr_auto] gap-2 sm:gap-4 ${darkMode ? "bg-gray-900 text-blue-400" : ""}`}>
      {/* Header */}
      <div className="flex justify-between items-center py-1 sm:py-2">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Hospital Logo" className="h-7 w-7 sm:h-8 sm:w-8" />
          <h1 className="text-base sm:text-lg font-bold">MASA Admissions</h1>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="relative w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
            onClick={toggleDarkMode}
          >
            <div
              className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-5" : "translate-x-1"}`}
            />
            <div className="absolute inset-0 flex justify-between items-center px-1">
              <Sun className="w-3 h-3 text-yellow-500" />
              <Moon className="w-3 h-3 text-blue-400" />
            </div>
          </div>
          <Button variant="destructive" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1">
            <LogOut className="w-3 h-3" /> Logout
          </Button>
        </div>
      </div>

      {/* Upper Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
        {/* Seeking Admissions */}
        <div className={`p-2 sm:p-3 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-sm sm:text-base font-semibold mb-1">Seeking Admission</h2>
          <div className="max-h-40 sm:max-h-48 overflow-y-auto pr-1 space-y-1">
            {seekingPatients.map((p) => (
              <div
                key={p.id}
                className="p-1 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-sm"
                onClick={() => {
                  setSelectedSeek(p);
                  setSelectedDischarge(null);
                  setSelectedWardType("");
                }}
              >
                {p.name} (ID: {p.id})
              </div>
            ))}
          </div>
          {selectedSeek && (
            <div className="mt-2 border-t pt-2 space-y-1 text-xs sm:text-sm">
              <p><strong>Name:</strong> {selectedSeek.name}</p>
              <p><strong>ID:</strong> {selectedSeek.id}</p>
              <p><strong>Sex:</strong> {selectedSeek.sex}</p>
              <p><strong>DOB:</strong> {format(new Date(selectedSeek.dob), "PPP")}</p>
              <p><strong>Reason:</strong> {selectedSeek.reason}</p>
              <div className="mt-1">
                <label className="block text-xs font-medium mb-1">Select Ward Type:</label>
                <select
                  className="w-full p-1 border rounded text-xs"
                  value={selectedWardType}
                  onChange={e => setSelectedWardType(e.target.value as WardType)}
                >
                  <option value="">-- Select --</option>
                  <option value="General">General (1-20)</option>
                  <option value="Maternity">Maternity (21-30)</option>
                  <option value="ICU">ICU (31-40)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Discharge Requests */}
        <div className={`p-2 sm:p-3 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-sm sm:text-base font-semibold mb-1">Discharge Requests</h2>
          <div className="max-h-40 sm:max-h-48 overflow-y-auto pr-1 space-y-1">
            {admittedPatients.map((p) => (
              <div
                key={p.id}
                className="p-1 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-sm"
                onClick={() => {
                  setSelectedDischarge(p);
                  setSelectedSeek(null);
                  setSelectedWardType("");
                }}
              >
                {p.name} (ID: {p.id})
              </div>
            ))}
          </div>
          {selectedDischarge && (
            <div className="mt-2 border-t pt-2 space-y-1 text-xs sm:text-sm">
              <p><strong>Name:</strong> {selectedDischarge.name}</p>
              <p><strong>ID:</strong> {selectedDischarge.id}</p>
              <p><strong>Admitted on:</strong> {format(new Date(selectedDischarge.admissionDateTime), "PPPp")}</p>
              <Button variant="destructive" className="text-xs sm:text-sm px-2 py-1" onClick={handleDischarge}>
                Discharge Patient
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Ward Grid */}
      <div className="grid grid-cols-10 gap-2 mt-2">
        {Array.from({ length: TOTAL_ROOMS }, (_, i) => {
          const roomNumber = i + 1;
          const isOccupied = roomNumber in occupiedRooms;
          const wardType = getWardTypeForRoom(roomNumber);

          const isInSelectedWardType = selectedWardType
            ? roomNumber >= wardTypeRanges[selectedWardType][0] && roomNumber <= wardTypeRanges[selectedWardType][1]
            : false;

          const isClickable =
            !!selectedSeek &&
            !!selectedWardType &&
            isInSelectedWardType &&
            !isOccupied;

          const highlight =
            selectedWardType && isInSelectedWardType
              ? isOccupied
                ? "bg-rose-500 text-white cursor-not-allowed"
                : isClickable
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  : "bg-emerald-400 text-white cursor-default"
              : isOccupied
                ? "bg-rose-500 text-white cursor-not-allowed"
                : "bg-emerald-300 text-white cursor-default opacity-60";

          return (
            <div
              key={roomNumber}
              className={`aspect-square flex items-center justify-center rounded-lg text-center font-semibold transition-colors text-xs sm:text-sm ${highlight}`}
              onClick={() => isClickable && handleAdmit(roomNumber)}
            >
              {isOccupied ? (
                <>
                  {wardType} {roomNumber}
                  <br />
                  PID: {occupiedRooms[roomNumber]}
                </>
              ) : (
                `${wardType} ${roomNumber}`
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FrontDeskOpAdmissions;
