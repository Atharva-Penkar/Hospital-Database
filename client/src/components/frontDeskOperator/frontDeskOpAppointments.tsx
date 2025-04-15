import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
];

const sampleRequests = [
  { id: 301, name: "Rohan Mehta", P_ID: 103, DOB: "1999-06-23", Sex: "M", phone: "9876543210", symptoms: "Chest pain and shortness of breath" },
];

const FrontDeskOpAppointments = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
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
      doctorId: doctors[selectedSpecialization].indexOf(selectedDoctor) + 1, // Just an example for doctorId
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

      {/* Scheduled Appointments */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Scheduled Appointments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scheduledAppointments.map((appt, idx) => (
            <Card key={idx} className="p-4">
              <CardContent>
                <p><strong>Patient:</strong> {appt.patientName} (ID: {appt.patientId})</p>
                <p><strong>Doctor:</strong> {appt.doctorName} (ID: {appt.doctorId})</p>
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.time}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Appointment Requests */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Appointment Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {appointmentRequests.map((req) => (
            <Card key={req.id} className="p-4 cursor-pointer" onClick={() => setSelectedRequest(req)}>
              <CardContent>
                <p><strong>Name:</strong> {req.name} (ID: {req.P_ID})</p>
                <p><strong>Symptoms:</strong> {req.symptoms}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedRequest && (
          <div className="p-4 border rounded-lg max-w-xl mx-auto bg-white dark:bg-gray-800">
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
                <input
                  type="date"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <input
                  type="time"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
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
      </div>
    </div>
  );
};

export default FrontDeskOpAppointments;
