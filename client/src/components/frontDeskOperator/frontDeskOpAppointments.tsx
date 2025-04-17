import { useEffect, useState } from "react";
import logo from '@/assets/images/logo.png';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { LogOut, Moon, Sun } from "lucide-react";
import { format } from "date-fns";

const specializations = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Gastroenterology",
] as const;
type Specialization = typeof specializations[number];

const doctors: Record<Specialization, string[]> = {
  "General Medicine": ["Dr. Anil Kumar", "Dr. Sneha Rao"],
  Pediatrics: ["Dr. Meena Shah"],
  Cardiology: ["Dr. Rajat Bhargava"],
  Gastroenterology: ["Dr. Kavita Menon"],
};

interface AppointmentRequest {
  P_ID: number;
  name: string;
  Sex: string;
  DOB: string;
  symptoms: string;
  requestedAt: string;
}

interface ScheduledAppointment {
  patientName: string;
  patientId: number;
  doctorName: string;
  doctorId: number;
  specialization: string;
  date: string;
  time: string;
}

const FrontDeskOpAppointments = ({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => {
  const [selectedRequest, setSelectedRequest] =
    useState<AppointmentRequest | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<ScheduledAppointment | null>(null);
  const [selectedScheduledAppointment, setSelectedScheduledAppointment] =
    useState<ScheduledAppointment | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<Specialization | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [scheduledAppointments, setScheduledAppointments] = useState<
    ScheduledAppointment[]
  >([]);
  const [appointmentRequests, setAppointmentRequests] = useState<
    AppointmentRequest[]
  >([]);

  const isFormComplete =
    selectedRequest && selectedSpecialization && selectedDoctor && date && time;

  const isValidDate = (date: string) => {
    if (!date) return false;
    const parsed = Date.parse(date);
    return !isNaN(parsed);
  };

  // Fetch appointment requests (Requested status)
  useEffect(() => {
    const fetchAppointmentRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/appointments/requested"
        );
        if (!response.ok)
          throw new Error("Failed to fetch appointment requests");
        const data = await response.json();

        if (Array.isArray(data.appointments)) {
          const transformed = data.appointments.map((item: any) => ({
            P_ID: item.patient.P_ID,
            name: item.patient.name,
            Sex: item.patient.Sex,
            DOB: item.patient.DOB,
            symptoms: item.Symptoms,
            requestedAt: item.TimeStamp,
          }));
          setAppointmentRequests(transformed);
        } else {
          console.error("Expected array under 'appointments' but got:", data);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointmentRequests();
  }, []);

  // Fetch scheduled appointments (Scheduled status)
  useEffect(() => {
    const fetchScheduledAppointments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/appointments/scheduled"
        );
        if (!response.ok)
          throw new Error("Failed to fetch scheduled appointments");
        const data = await response.json();

        if (Array.isArray(data.appointments)) {
          const transformed = data.appointments.map((item: any) => ({
            patientName: item.patient?.name ?? "Unknown",
            patientId: item.patient?.P_ID ?? 0,
            doctorName: item.doctor?.name ?? "Unknown",
            doctorId: item.doctor?.D_ID ?? 0,
            specialization: item.doctor?.specialization ?? "Unknown",
            date: item.TimeStamp ? item.TimeStamp.slice(0, 10) : "",
            time: item.TimeStamp ? item.TimeStamp.slice(11, 16) : "",
          }));
          setScheduledAppointments(transformed);
        } else {
          console.error("Expected array under 'appointments' but got:", data);
        }
      } catch (err) {
        console.error("Error fetching scheduled appointments:", err);
      }
    };

    fetchScheduledAppointments();
  }, []);

  const handleScheduleAppointment = () => {
    if (!selectedSpecialization || !selectedRequest) return;

    const newScheduledAppointment: ScheduledAppointment = {
      patientName: selectedRequest.name,
      patientId: selectedRequest.P_ID,
      doctorName: selectedDoctor,
      doctorId: doctors[selectedSpecialization].indexOf(selectedDoctor) + 1, // Placeholder
      specialization: selectedSpecialization,
      date,
      time,
    };
    setScheduledAppointments((prev) => [...prev, newScheduledAppointment]);
    setAppointmentRequests((prev) =>
      prev.filter((req) => req.P_ID !== selectedRequest.P_ID)
    );
    setSelectedAppointment(newScheduledAppointment);

    setSelectedRequest(null);
    setSelectedSpecialization(null);
    setSelectedDoctor("");
    setDate("");
    setTime("");
  };

  const clearSelections = () => {
    setSelectedRequest(null);
    setSelectedAppointment(null);
    setSelectedScheduledAppointment(null);
    setSelectedSpecialization(null);
    setSelectedDoctor("");
    setDate("");
    setTime("");
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Appointments</h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Appointment Requests</CardTitle>
          </CardHeader>
          <CardContent className="bg-card text-card-foreground">
            <div className="h-96 overflow-y-auto pr-2">
              {appointmentRequests.length > 0 ? (
                appointmentRequests.map((req) => {
                  const formattedDate =
                    req.requestedAt && isValidDate(req.requestedAt)
                      ? format(new Date(req.requestedAt), "PPpp")
                      : "Booked time not provided";
                  return (
                    <Card
                      key={req.P_ID}
                      className="mb-2 cursor-pointer hover:bg-muted bg-card text-card-foreground"
                      onClick={() => {
                        clearSelections();
                        setSelectedRequest(req);
                      }}
                    >
                      <CardContent className="py-2 px-4 bg-card text-card-foreground">
                        <div className="font-medium">
                          {req.name} (ID: {req.P_ID})
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formattedDate}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="p-4 text-gray-500 dark:text-gray-400">
                  No appointment requests
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Middle Panel */}
        <div>
          {/* Scheduled Appointment Details */}
          {selectedScheduledAppointment && (
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Scheduled Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="bg-card text-card-foreground">
                <p>
                  <strong>Patient Name:</strong>{" "}
                  {selectedScheduledAppointment.patientName}
                </p>
                <p>
                  <strong>Patient ID:</strong>{" "}
                  {selectedScheduledAppointment.patientId}
                </p>
                <p>
                  <strong>Doctor:</strong>{" "}
                  {selectedScheduledAppointment.doctorName}
                </p>
                <p>
                  <strong>Specialization:</strong>{" "}
                  {selectedScheduledAppointment.specialization}
                </p>
                <p>
                  <strong>Date:</strong> {selectedScheduledAppointment.date}
                </p>
                <p>
                  <strong>Time:</strong> {selectedScheduledAppointment.time}
                </p>
                <Button className="mt-4" onClick={clearSelections}>
                  Close
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Requested Appointment Details & Scheduling */}
          {!selectedScheduledAppointment && selectedRequest && (
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>
                  Selected Patient:{" "}
                  <span className="text-blue-600 dark:text-blue-300">
                    {selectedRequest.name}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-card text-card-foreground">
                <p>
                  <strong>Name:</strong> {selectedRequest.name}
                </p>
                <p>
                  <strong>ID:</strong> {selectedRequest.P_ID}
                </p>
                <p>
                  <strong>Sex:</strong> {selectedRequest.Sex}
                </p>
                <p>
                  <strong>DOB:</strong>{" "}
                  {isValidDate(selectedRequest.DOB)
                    ? format(new Date(selectedRequest.DOB), "PPP")
                    : "Invalid Date"}
                </p>
                <p>
                  <strong>Symptoms:</strong> {selectedRequest.symptoms}
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      Specialization:
                    </label>
                    <Select
                      value={selectedSpecialization || ""}
                      onValueChange={(value) => {
                        setSelectedSpecialization(value as Specialization);
                        setSelectedDoctor("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedSpecialization && (
                    <div>
                      <label className="block mb-1 font-medium">Doctor:</label>
                      <Select
                        value={selectedDoctor}
                        onValueChange={setSelectedDoctor}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors[selectedSpecialization].map((doc) => (
                            <SelectItem key={doc} value={doc}>
                              {doc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>

                  <Button
                    className="w-full"
                    disabled={!isFormComplete}
                    onClick={handleScheduleAppointment}
                  >
                    Schedule Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Confirmation for newly scheduled appointment */}
          {!selectedScheduledAppointment && selectedAppointment && (
            <Card className="mt-6 bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Scheduled Appointment</CardTitle>
              </CardHeader>
              <CardContent className="bg-card text-card-foreground">
                <p>
                  <strong>Patient Name:</strong> {selectedAppointment.patientName}
                </p>
                <p>
                  <strong>Doctor:</strong> {selectedAppointment.doctorName}
                </p>
                <p>
                  <strong>Specialization:</strong> {selectedAppointment.specialization}
                </p>
                <p>
                  <strong>Date:</strong> {selectedAppointment.date}
                </p>
                <p>
                  <strong>Time:</strong> {selectedAppointment.time}
                </p>
                <Button className="mt-4" onClick={clearSelections}>
                  Close
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        {/* Right Panel */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Scheduled Appointments</CardTitle>
          </CardHeader>
          <CardContent className="bg-card text-card-foreground">
            <div className="h-96 overflow-y-auto pr-2">
              {scheduledAppointments.length > 0 ? (
                scheduledAppointments.map((appointment, index) => (
                  <Card
                    key={index}
                    className="mb-2 cursor-pointer hover:bg-muted bg-card text-card-foreground"
                    onClick={() => {
                      clearSelections();
                      setSelectedScheduledAppointment(appointment);
                    }}
                  >
                    <CardContent className="py-2 px-4 bg-card text-card-foreground">
                      {appointment.patientName} (Dr. {appointment.doctorName}) on{" "}
                      {appointment.date} at {appointment.time}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-4 text-gray-500 dark:text-gray-400">
                  No scheduled appointments
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FrontDeskOpAppointments;
