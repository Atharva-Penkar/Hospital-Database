import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import { format } from "date-fns";

const specializations = ["General Medicine", "Pediatrics", "Cardiology", "Gastroenterology"] as const;
type Specialization = typeof specializations[number];

const doctors: Record<Specialization, string[]> = {
  "General Medicine": ["Dr. Anil Kumar", "Dr. Sneha Rao"],
  Pediatrics: ["Dr. Meena Shah"],
  Cardiology: ["Dr. Rajat Bhargava"],
  Gastroenterology: ["Dr. Kavita Menon"],
};

const sampleScheduled = [
  { patientName: "Aryan Patel", patientId: 101, doctorName: "Dr. Sneha Rao", doctorId: 201, date: "2025-04-20", time: "10:00" },
  { patientName: "Priya Sharma", patientId: 102, doctorName: "Dr. Rajat Bhargava", doctorId: 202, date: "2025-04-21", time: "11:30" },
  { patientName: "Aman Gupta", patientId: 103, doctorName: "Dr. Kavita Menon", doctorId: 203, date: "2025-04-22", time: "09:30" },
  { patientName: "Kritika Singh", patientId: 104, doctorName: "Dr. Meena Shah", doctorId: 204, date: "2025-04-23", time: "14:00" },
  { patientName: "Dev Sharma", patientId: 105, doctorName: "Dr. Anil Kumar", doctorId: 205, date: "2025-04-24", time: "15:45" },
  { patientName: "Sneha Desai", patientId: 106, doctorName: "Dr. Rajat Bhargava", doctorId: 206, date: "2025-04-25", time: "12:15" },
  { patientName: "Vikram Iyer", patientId: 107, doctorName: "Dr. Kavita Menon", doctorId: 207, date: "2025-04-26", time: "11:00" },
  { patientName: "Nidhi Rathi", patientId: 108, doctorName: "Dr. Meena Shah", doctorId: 208, date: "2025-04-27", time: "16:00" },
  { patientName: "Abhay Joshi", patientId: 109, doctorName: "Dr. Sneha Rao", doctorId: 209, date: "2025-04-28", time: "13:30" },
  { patientName: "Meera Nair", patientId: 110, doctorName: "Dr. Anil Kumar", doctorId: 210, date: "2025-04-29", time: "10:45" },
  { patientName: "Harshita Bansal", patientId: 111, doctorName: "Dr. Rajat Bhargava", doctorId: 211, date: "2025-04-30", time: "09:15" },
  { patientName: "Rajat Verma", patientId: 112, doctorName: "Dr. Kavita Menon", doctorId: 212, date: "2025-05-01", time: "14:30" },
];

const sampleRequests = [
  { id: 301, name: "Rohan Mehta", P_ID: 113, DOB: "1999-06-23", Sex: "M", phone: "9876543210", symptoms: "Chest pain and shortness of breath" },
  { id: 302, name: "Ananya Ghosh", P_ID: 114, DOB: "2001-03-15", Sex: "F", phone: "9988776655", symptoms: "Fever and cough" },
  { id: 303, name: "Sarthak Jain", P_ID: 115, DOB: "2002-07-01", Sex: "M", phone: "9871234567", symptoms: "Headache and nausea" },
  { id: 304, name: "Ishita Singh", P_ID: 116, DOB: "2003-05-17", Sex: "F", phone: "9801234567", symptoms: "Joint pain" },
  { id: 305, name: "Ritika Sharma", P_ID: 117, DOB: "2000-11-29", Sex: "F", phone: "9734567890", symptoms: "Back pain" },
  { id: 306, name: "Yash Patel", P_ID: 118, DOB: "1998-08-22", Sex: "M", phone: "9623456781", symptoms: "Fatigue and dizziness" },
  { id: 307, name: "Karan Soni", P_ID: 119, DOB: "1997-02-18", Sex: "M", phone: "9523456782", symptoms: "Shortness of breath" },
  { id: 308, name: "Tanya Rao", P_ID: 120, DOB: "1996-12-05", Sex: "F", phone: "9423456783", symptoms: "Abdominal pain" },
  { id: 309, name: "Arjun Nair", P_ID: 121, DOB: "2004-09-10", Sex: "M", phone: "9323456784", symptoms: "Skin rash" },
  { id: 310, name: "Neha Joshi", P_ID: 122, DOB: "1995-04-01", Sex: "F", phone: "9223456785", symptoms: "Eye irritation" },
  { id: 311, name: "Manav Kapoor", P_ID: 123, DOB: "1993-06-30", Sex: "M", phone: "9123456786", symptoms: "Swelling in leg" },
  { id: 312, name: "Simran Kaur", P_ID: 124, DOB: "2000-10-25", Sex: "F", phone: "9023456787", symptoms: "Throat pain" },
];

const FrontDeskOpAppointments = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization>("" as Specialization);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [scheduledAppointments, setScheduledAppointments] = useState(sampleScheduled);
  const [appointmentRequests, setAppointmentRequests] = useState(sampleRequests);

  const isFormComplete = selectedRequest && selectedSpecialization && selectedDoctor && date && time;

  const handleScheduleAppointment = () => {
    const newScheduledAppointment = {
      patientName: selectedRequest.name,
      patientId: selectedRequest.P_ID,
      doctorName: selectedDoctor,
      doctorId: doctors[selectedSpecialization].indexOf(selectedDoctor) + 1,
      date,
      time,
    };

    setScheduledAppointments((prev) => [...prev, newScheduledAppointment]);
    setAppointmentRequests((prev) => prev.filter((req) => req.id !== selectedRequest.id));
    setSelectedRequest(null);
    setSelectedSpecialization("" as Specialization);
    setSelectedDoctor("");
    setDate("");
    setTime("");
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"}`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src="/hospital-logo.png" alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Appointments</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition" onClick={toggleDarkMode}>
            <div className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-7" : "translate-x-1"}`} />
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

      {/* Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Requests */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Appointment Requests</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-gray-700">
            {appointmentRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => {
                  setSelectedRequest(req);
                  setSelectedAppointment(null);
                }}
                className="p-2 border-b cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {req.name} (ID: {req.P_ID})
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Selected Request / Scheduled Appointment Detail */}
        <div>
          {selectedRequest && (
            <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-2">Patient Details</h3>
              <p><strong>Name:</strong> {selectedRequest.name}</p>
              <p><strong>ID:</strong> {selectedRequest.P_ID}</p>
              <p><strong>Sex:</strong> {selectedRequest.Sex}</p>
              <p><strong>DOB:</strong> {format(new Date(selectedRequest.DOB), "PPP")}</p>
              <p><strong>Symptoms:</strong> {selectedRequest.symptoms}</p>

              <div className="mt-4 space-y-4">
                <div>
                  <label>Specialization:</label>
                  <select
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    value={selectedSpecialization}
                    onChange={(e) => {
                      setSelectedSpecialization(e.target.value as Specialization);
                      setSelectedDoctor("");
                    }}
                  >
                    <option value="">Select specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {selectedSpecialization && (
                  <div>
                    <label>Doctor:</label>
                    <select
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                      <option value="">Select doctor</option>
                      {doctors[selectedSpecialization].map((doc) => (
                        <option key={doc} value={doc}>{doc}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-4">
                  <input type="date" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={date} onChange={(e) => setDate(e.target.value)} />
                  <input type="time" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>

                <Button
                  className={`w-full ${isFormComplete ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                  disabled={!isFormComplete}
                  onClick={handleScheduleAppointment}
                >
                  Schedule Appointment
                </Button>
              </div>
            </div>
          )}

          {selectedAppointment && (
            <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-2">Scheduled Appointment</h3>
              <p><strong>Patient:</strong> {selectedAppointment.patientName} (ID: {selectedAppointment.patientId})</p>
              <p><strong>Doctor:</strong> {selectedAppointment.doctorName} (ID: {selectedAppointment.doctorId})</p>
              <p><strong>Date:</strong> {selectedAppointment.date}</p>
              <p><strong>Time:</strong> {selectedAppointment.time}</p>
            </div>
          )}
        </div>

        {/* Right: Scheduled Appointments */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Scheduled Appointments</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-gray-700">
            {scheduledAppointments.map((appt, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedAppointment(appt);
                  setSelectedRequest(null);
                }}
                className="p-2 border-b cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {appt.patientName} with {appt.doctorName}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskOpAppointments;
