import React, { useEffect, useState } from "react";
import logo from '@/assets/images/logo.png';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogOut, Sun, Moon } from "lucide-react";

type Doctor = {
  D_ID: number;
  name: string;
  department: string;
  email: string;
  phone_no: string;
};

type Appointment = {
  appointment_id: number;
  patient_name: string;
  patient_id: number;
  time: string;
  status: "Pending" | "Completed";
};

type AdmittedPatient = {
  admission_id: number;
  patient_name: string;
  patient_id: number;
  ward: string;
  admitted_on: string;
};

const mockDoctor: Doctor = {
  D_ID: 1234,
  name: "Dr. Gregory House",
  department: "Diagnostics",
  email: "house@masahospital.com",
  phone_no: "1234567890",
};

const mockPendingAppointments: Appointment[] = [
  {
    appointment_id: 1,
    patient_name: "John Doe",
    patient_id: 1001,
    time: "2025-04-20 10:00:00",
    status: "Pending",
  },
  {
    appointment_id: 2,
    patient_name: "Jane Smith",
    patient_id: 1002,
    time: "2025-04-20 11:30:00",
    status: "Pending",
  },
];

const mockCompletedAppointments: Appointment[] = [
  {
    appointment_id: 3,
    patient_name: "Michael Scott",
    patient_id: 1003,
    time: "2025-04-19 09:00:00",
    status: "Completed",
  },
];

const mockAdmittedPatients: AdmittedPatient[] = [
  {
    admission_id: 1,
    patient_name: "Pam Beesly",
    patient_id: 1004,
    ward: "Ward A",
    admitted_on: "2025-04-18 14:00:00",
  },
  {
    admission_id: 2,
    patient_name: "Jim Halpert",
    patient_id: 1005,
    ward: "Ward B",
    admitted_on: "2025-04-17 16:30:00",
  },
];

const DoctorHome: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<Appointment[]>([]);
  const [admittedPatients, setAdmittedPatients] = useState<AdmittedPatient[]>([]);

  useEffect(() => {
    setDoctor(mockDoctor);
    setPendingAppointments(mockPendingAppointments);
    setCompletedAppointments(mockCompletedAppointments);
    setAdmittedPatients(mockAdmittedPatients);
  }, []);

  useEffect(() => {
    // Optional: Set initial dark mode based on system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Remove the patient from admitted list on discharge
  const handleRequestDischarge = (admission_id: number) => {
    setAdmittedPatients((prev) =>
      prev.filter((p) => p.admission_id !== admission_id)
    );
  };

  // Navigation for appointment details (stub, does nothing here)
  const goToAppointment = (appointment_id: number) => {
    alert(`Go to appointment details for ID: ${appointment_id}`);
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
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Doctor Profile */}
        <Card className={`rounded-2xl shadow-md ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Doctor Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            {doctor ? (
              <>
                <p><strong>Doctor ID:</strong> {doctor.D_ID}</p>
                <p><strong>Name:</strong> {doctor.name}</p>
                <p><strong>Department:</strong> {doctor.department}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Phone:</strong> {doctor.phone_no}</p>
              </>
            ) : (
              <p>Loading doctor info...</p>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Appointments</TabsTrigger>
            <TabsTrigger value="completed">Completed Appointments</TabsTrigger>
            <TabsTrigger value="admitted">Admitted Patients</TabsTrigger>
          </TabsList>

          {/* Pending Appointments */}
          <TabsContent value="pending">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>Pending Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending appointments.</p>
                ) : (
                  <ul className="divide-y">
                    {pendingAppointments.map((appt) => (
                      <li
                        key={appt.appointment_id}
                        className="py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                        onClick={() => goToAppointment(appt.appointment_id)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") {
                            goToAppointment(appt.appointment_id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{appt.patient_name} (ID: {appt.patient_id})</div>
                            <div className="text-xs">
                              {new Date(appt.time).toLocaleString()}
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">Scheduled</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Appointments */}
          <TabsContent value="completed">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>Completed Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {completedAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No completed appointments.</p>
                ) : (
                  <ul className="divide-y">
                    {completedAppointments.map((appt) => (
                      <li
                        key={appt.appointment_id}
                        className="py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                        onClick={() => goToAppointment(appt.appointment_id)}
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") {
                            goToAppointment(appt.appointment_id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{appt.patient_name} (ID: {appt.patient_id})</div>
                            <div className="text-xs">
                              {new Date(appt.time).toLocaleString()}
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">Completed</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admitted Patients */}
          <TabsContent value="admitted">
            <Card className={`rounded-xl shadow ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle>Admitted Patients</CardTitle>
              </CardHeader>
              <CardContent>
                {admittedPatients.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No admitted patients.</p>
                ) : (
                  <ul className="divide-y">
                    {admittedPatients.map((patient) => (
                      <li key={patient.admission_id} className="py-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="font-semibold">{patient.patient_name} (ID: {patient.patient_id})</div>
                            <div className="text-xs">
                              Ward: {patient.ward} &nbsp;|&nbsp; Admitted on: {new Date(patient.admitted_on).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleRequestDischarge(patient.admission_id)}
                            >
                              Request Discharge
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorHome;
