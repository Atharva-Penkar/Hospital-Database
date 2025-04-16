import { useEffect, useState } from "react";
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
];

const FrontDeskOpAppointments = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization>("" as Specialization);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [scheduledAppointments, setScheduledAppointments] = useState(sampleScheduled);
  const [appointmentRequests, setAppointmentRequests] = useState<any[]>([]);

  const isFormComplete = selectedRequest && selectedSpecialization && selectedDoctor && date && time;

  // Fixing the Fetching Appointments Twice Issue
  useEffect(() => {
    const fetchAppointmentRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/appointments/requested");
        if (!response.ok) throw new Error("Failed to fetch appointment requests");
        const data = await response.json();

        if (Array.isArray(data.appointments)) {
          setAppointmentRequests(data.appointments);  // Accessing 'appointments' properly
        } else {
          console.error("Expected array under 'appointments' but got:", data);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointmentRequests();
  }, []); // Empty dependency array ensures that it only runs once when the component mounts

  const handleScheduleAppointment = () => {
    const newScheduledAppointment = {
      patientName: selectedRequest.name,
      patientId: selectedRequest.P_ID,
      doctorName: selectedDoctor,
      doctorId: doctors[selectedSpecialization].indexOf(selectedDoctor) + 1,
      date,
      time,
    };

    // Update scheduled appointments state properly
    setScheduledAppointments((prev) => [...prev, newScheduledAppointment]);

    // Remove the selected request from appointment requests
    setAppointmentRequests((prev) => prev.filter((req) => req.P_ID !== selectedRequest.P_ID));

    // Reset form
    setSelectedRequest(null);
    setSelectedSpecialization("" as Specialization);
    setSelectedDoctor("");
    setDate("");
    setTime("");
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"}`}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Appointment Requests</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-gray-700">
            {appointmentRequests.length > 0 ? (
              appointmentRequests.map((req) => (
                <div
                  key={req.P_ID}
                  onClick={() => {
                    setSelectedRequest(req);
                    setSelectedAppointment(null);
                  }}
                  className="p-2 border-b cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {req.name} (ID: {req.P_ID})
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500 dark:text-gray-400">No appointment requests</div>
            )}
          </div>
        </div>

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
            <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 mt-6">
              <h3 className="text-xl font-bold mb-2">Scheduled Appointment</h3>
              <p><strong>Patient Name:</strong> {selectedAppointment.patientName}</p>
              <p><strong>Doctor:</strong> {selectedAppointment.doctorName}</p>
              <p><strong>Date:</strong> {selectedAppointment.date}</p>
              <p><strong>Time:</strong> {selectedAppointment.time}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Scheduled Appointments</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-gray-700">
            {scheduledAppointments.length > 0 ? (
              scheduledAppointments.map((appointment, index) => (
                <div key={index} className="p-2 border-b">
                  {appointment.patientName} (Dr. {appointment.doctorName}) on {appointment.date} at {appointment.time}
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500 dark:text-gray-400">No scheduled appointments</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskOpAppointments;
