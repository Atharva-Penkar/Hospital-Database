import { useState, useEffect } from "react";
import logo from '@/assets/images/logo.png';
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Patient = {
  id: number;
  name: string;
  sex: string;
  dob: string;
  reason: string;
  admit_id?: number;
};

type AdmittedPatient = {
  id: number; // patient ID
  name: string;
  ward: number;
  admissionDateTime: string;
  admit_id: number; // <-- add this
};

type WardType = "General" | "Maternity" | "ICU" | "";

type Room = {
  Room_No: number;
  Room_Type: WardType;
  Available: boolean;
  Admit: Array<{
    admit_id: number;
    P_ID: number;
    status: string;
    discharge_time: string | null;
  }>;
};

const TOTAL_ROOMS = 40;

const ADMIT_REQUESTED_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/front-desk-operator/admissions/admit-requests",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/front-desk-operator/admissions/admit-requests",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/front-desk-operator/admissions/admit-requests",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/front-desk-operator/admissions/admit-requests",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/front-desk-operator/admissions/admit-requests",
  "http://localhost:5000/api/front-desk-operator/admissions/admit-requests"
];

const DISCHARGE_REQUESTED_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/front-desk-operator/admissions/discharge-requests",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/front-desk-operator/admissions/discharge-requests",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/front-desk-operator/admissions/discharge-requests",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/front-desk-operator/admissions/discharge-requests",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/front-desk-operator/admissions/discharge-requests",
  "http://localhost:5000/api/front-desk-operator/admissions/discharge-requests"
];

const ROOMS_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/front-desk-operator/admissions/rooms",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/front-desk-operator/admissions/rooms",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/front-desk-operator/admissions/rooms",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/front-desk-operator/admissions/rooms",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/front-desk-operator/admissions/rooms",
  "http://localhost:5000/api/front-desk-operator/admissions/rooms"
];

const ADMIT_PATIENT_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/front-desk-operator/admissions/admit",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/front-desk-operator/admissions/admit",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/front-desk-operator/admissions/admit",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/front-desk-operator/admissions/admit",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/front-desk-operator/admissions/admit",
  "http://localhost:5000/api/front-desk-operator/admissions/admit"
];

const DISCHARGE_PATIENT_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/front-desk-operator/admissions/discharge",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/front-desk-operator/admissions/discharge",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/front-desk-operator/admissions/discharge",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/front-desk-operator/admissions/discharge",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/front-desk-operator/admissions/discharge",
  "http://localhost:5000/api/front-desk-operator/admissions/discharge"
];

const LOGOUT_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/auth-staff/logout/fdo",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/auth-staff/logout/fdo",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/auth-staff/logout/fdo",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/auth-staff/logout/fdo",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/auth-staff/logout/fdo",
  "http://localhost:5000/api/auth-staff/logout/fdo"
];

const FrontDeskOpAdmissions = ({
  darkMode,
  toggleDarkMode
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => {
  const [seekingPatients, setSeekingPatients] = useState<Patient[]>([]);
  const [admittedPatients, setAdmittedPatients] = useState<AdmittedPatient[]>([]);
  const [selectedSeek, setSelectedSeek] = useState<Patient | null>(null);
  const [selectedDischarge, setSelectedDischarge] = useState<AdmittedPatient | null>(null);
  const [selectedWardType, setSelectedWardType] = useState<WardType>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      let lastError: any = null;
      let logoutSuccess = false;
      for (const base of LOGOUT_URLS) {
        try {
          const res = await fetch(base, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: localStorage.getItem("operator_ID") || ""
            }),
          });
          if (!res.ok) {
            console.error(`Logout error from ${base}: ${res.status}`);
            continue;
          }
          logoutSuccess = true;
          break; // Break out if successful
        } catch (err) {
          lastError = err;
          console.error(`Logout error from ${base}:`, err);
        }
      }
      if (!logoutSuccess) {
        throw lastError;
      }
      localStorage.removeItem("operator_ID");
      toast.success("Logout successful!");
      navigate("/login-staff");
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error("Logout failed: " + error.message);
    }
  };

  // Fetch seeking admissions
  const fetchSeekingPatients = async () => {
    for (const url of ADMIT_REQUESTED_URLS) {
      try {
        const res = await fetch(url + "/");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        const patients: Patient[] = Array.isArray(data.admits)
          ? data.admits.map((admit: any) => ({
            id: admit.patient?.P_ID ?? admit.P_ID,
            name: admit.patient?.name ?? "Unknown",
            sex: admit.patient?.Sex ?? "N/A",
            dob: admit.patient?.DOB ?? "",
            reason: admit.appointment?.Symptoms ?? "N/A",
            admit_id: admit.admit_id
          }))
          : [];
        setSeekingPatients(patients);
        break;
      } catch (err) {
        if (url === ADMIT_REQUESTED_URLS[ADMIT_REQUESTED_URLS.length - 1]) {
          setSeekingPatients([]);
        }
      }
    }
  };

  // Fetch discharge requested admissions, now includes room number
  const fetchAdmittedPatients = async () => {
    for (const url of DISCHARGE_REQUESTED_URLS) {
      try {
        const res = await fetch(url + "/");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        const patients: AdmittedPatient[] = Array.isArray(data.admits)
          ? data.admits.map((admit: any) => ({
            id: admit.patient?.P_ID ?? admit.P_ID,
            name: admit.patient?.name ?? "Unknown",
            ward: admit.room?.Room_No ?? admit.R_no ?? 0,
            admissionDateTime: admit.admit_time ?? "",
            admit_id: admit.admit_id, // <-- add this
          }))
          : [];
        setAdmittedPatients(patients);
        break;
      } catch (err) {
        if (url === DISCHARGE_REQUESTED_URLS[DISCHARGE_REQUESTED_URLS.length - 1]) {
          setAdmittedPatients([]);
        }
      }
    }
  };

  // Fetch all rooms with their Admit relation
  const fetchRooms = async () => {
    setLoadingRooms(true);
    for (const url of ROOMS_URLS) {
      try {
        const res = await fetch(url + "/");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        // Map backend result to expected frontend Room shape
        const roomsData: Room[] = Array.isArray(data.rooms)
          ? data.rooms.map((room: any) => ({
            ...room,
            Admit: room.admittedPatientId
              ? [{ P_ID: room.admittedPatientId, admit_id: 0, status: "Admitted", discharge_time: null }]
              : []
          }))
          : [];
        setRooms(roomsData);
        setLoadingRooms(false);
        break;
      } catch (err) {
        if (url === ROOMS_URLS[ROOMS_URLS.length - 1]) {
          setRooms([]);
          setLoadingRooms(false);
        }
      }
    }
  };


  useEffect(() => {
    fetchSeekingPatients();
    fetchAdmittedPatients();
    fetchRooms();
  }, []);

  // Helper: Find the P_ID of the currently admitted patient in a room
  const getCurrentPID = (room: Room) => {
    const currentAdmit = Array.isArray(room.Admit)
      ? room.Admit.find((a) => !a.discharge_time)
      : undefined;
    return currentAdmit ? currentAdmit.P_ID : null;
  };

  // Helper: Determine if a room is occupied (now uses only Available)
  const isRoomOccupied = (room: Room) => {
    return !room.Available;
  };

  // Handler: Admit patient to a room (uses admitPatientToRoom controller)
  const handleAdmit = async (roomNumber: number) => {
    if (!selectedSeek || !selectedSeek.admit_id) return;
    let admitSuccess = false;
    for (const url of ADMIT_PATIENT_URLS) {
      try {
        const res = await fetch(`${url}/${selectedSeek.admit_id}/Room/${roomNumber}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error(`Failed to admit: ${res.status}`);
        admitSuccess = true;
        break;
      } catch (err) { }
    }
    if (admitSuccess) {
      await fetchRooms();
      await fetchSeekingPatients();
      setSelectedSeek(null);
      setSelectedWardType("");
    }
  };

  // Handler: Discharge patient from room (uses dischargePatientFromRoom controller)
  const handleDischarge = async () => {
    if (!selectedDischarge) return;
    let dischargeSuccess = false;
    for (const url of DISCHARGE_PATIENT_URLS) {
      try {
        const res = await fetch(`${url}/${selectedDischarge.admit_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error(`Failed to discharge: ${res.status}`);
        dischargeSuccess = true;
        break;
      } catch (err) {}
    }
    if (dischargeSuccess) {
      await fetchRooms();
      await fetchAdmittedPatients();
      setSelectedDischarge(null);
    }
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
            <div className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-5" : "translate-x-1"}`} />
            <div className="absolute inset-0 flex justify-between items-center px-1">
              <Sun className="w-3 h-3 text-yellow-500" />
              <Moon className="w-3 h-3 text-blue-400" />
            </div>
          </div>
          <Button variant="destructive" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1" onClick={handleLogout}>
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
            {seekingPatients.length === 0 ? (
              <div className="text-xs text-gray-400">No patients seeking admission.</div>
            ) : (
              seekingPatients.map((p) => (
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
              ))
            )}
          </div>
          {selectedSeek && (
            <div className="mt-2 border-t pt-2 space-y-1 text-xs sm:text-sm">
              <p><strong>Name:</strong> {selectedSeek.name}</p>
              <p><strong>ID:</strong> {selectedSeek.id}</p>
              <p><strong>Sex:</strong> {selectedSeek.sex}</p>
              <p><strong>DOB:</strong> {selectedSeek.dob ? format(new Date(selectedSeek.dob), "PPP") : "N/A"}</p>
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
                  <option value="ICU">ICU (21-30)</option>
                  <option value="Maternity">Maternity (31-40)</option>
                </select>
              </div>
            </div>
          )}
        </div>
        {/* Discharge Requests */}
        <div className={`p-2 sm:p-3 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-sm sm:text-base font-semibold mb-1">Discharge Requests</h2>
          <div className="max-h-40 sm:max-h-48 overflow-y-auto pr-1 space-y-1">
            {admittedPatients.length === 0 ? (
              <div className="text-xs text-gray-400">No discharge requests.</div>
            ) : (
              admittedPatients.map((p) => (
                <div
                  key={p.id}
                  className="p-1 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-sm"
                  onClick={() => {
                    setSelectedDischarge(p);
                    setSelectedSeek(null);
                    setSelectedWardType("");
                  }}
                >
                  {p.name} (ID: {p.id}) <b>Room: {p.ward}</b>
                </div>
              ))
            )}
          </div>
          {selectedDischarge && (
            <div className="mt-2 border-t pt-2 space-y-1 text-xs sm:text-sm">
              <p><strong>Name:</strong> {selectedDischarge.name}</p>
              <p><strong>ID:</strong> {selectedDischarge.id}</p>
              <p><strong>Room:</strong> {selectedDischarge.ward}</p>
              <p><strong>Admitted on:</strong> {selectedDischarge.admissionDateTime ? format(new Date(selectedDischarge.admissionDateTime), "PPPp") : "N/A"}</p>
              <Button
                variant="destructive"
                className="text-xs sm:text-sm px-2 py-1 hover:bg-red-700 transition"
                onClick={handleDischarge}
              >
                Discharge Patient
              </Button>

            </div>
          )}
        </div>
      </div>
      {/* Bottom Section - Ward Grid */}
      <div className="grid grid-cols-10 gap-2 mt-2">
        {loadingRooms ? (
          Array.from({ length: TOTAL_ROOMS }, (_, i) => (
            <div
              key={i + 1}
              className="aspect-square flex items-center justify-center rounded-lg text-center font-semibold transition-colors text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 text-gray-400"
            >
              Loading...
            </div>
          ))
        ) : (
          Array.from({ length: TOTAL_ROOMS }, (_, i) => {
            const roomNumber = i + 1;
            const room = rooms.find(r => r.Room_No === roomNumber);
            const isInSelectedWardType = selectedWardType
              ? room && room.Room_Type === selectedWardType
              : false;
            const isOccupied = room ? isRoomOccupied(room) : false;
            const pid = room && isOccupied ? getCurrentPID(room) : null;
            const isClickable =
              !!selectedSeek &&
              !!selectedWardType &&
              isInSelectedWardType &&
              !isOccupied &&
              room?.Available;

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
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-center font-semibold transition-colors text-xs sm:text-sm ${highlight}`}
                onClick={() => isClickable && handleAdmit(roomNumber)}
              >
                <span className="block font-bold">
                  {room ? `${room.Room_Type} ${room.Room_No}` : `Room ${roomNumber}`}
                </span>
                <span className="block">
                  PID: {pid ? pid : "None"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FrontDeskOpAdmissions;
