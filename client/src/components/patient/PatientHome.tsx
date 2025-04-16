import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// TypeScript type for patient (simplified)
type Patient = {
  P_ID: number;
  name: string;
  address: string;
  DOB: string;
  sex: string;
  mail: string;
  phone_no: string;
  emergency_phone_no: string;
  allergies: { name: string }[];
  admissions: any[]; // Can be typed more strictly
};

const PatientHome = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Log userId and appointment data
      const userId = localStorage.getItem("userId");
      console.log("User ID from localStorage:", userId);
      if (!userId) throw new Error("User ID not found");
  
      // Log the appointment data being sent
      console.log("Appointment data:", appointmentData);
  
      // Ensure the TimeStamp is properly formatted
      const TimeStamp = new Date(`${appointmentData.date}T${appointmentData.time}:00`).toISOString();
      console.log("Formatted TimeStamp:", TimeStamp);
  
      const res = await fetch("http://localhost:5000/api/appointments/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          P_ID: Number(userId),
          D_ID: 0,
          TimeStamp,
          Symptoms: appointmentData.message || null,
        }),
      });
  
      // Log response details
      const contentType = res.headers.get("content-type");
      console.log("Response content-type:", contentType);
  
      const data = contentType?.includes("application/json") ? await res.json() : null;
      console.log("Response body:", data);
  
      // Log the status of the response
      console.log("Response status:", res.status);
  
      if (!res.ok) throw new Error(data?.message || "Failed to request appointment");
  
      // Log success message
      toast.success("Appointment requested successfully!");
      setAppointmentData({ date: "", time: "", message: "" });
    } catch (err: any) {
      // Log error details
      console.error("Error occurred:", err);
      toast.error(`Failed: ${err.message}`);
    }
  };
  

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Retrieve the JWT token from localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Call the backend API to log out the user
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send the JWT token in Authorization header
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Logout failed");

      // Handle successful logout
      toast.success("Logged out successfully");

      // Clear the token from localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      navigate("/login-patient");
    } catch (err: any) {
      toast.error(`Logout failed: ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");

        const res = await fetch(`http://localhost:5000/api/patient/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch patient");

        const data = await res.json();
        setPatient(data.patient);
      } catch (err) {
        console.error("Error fetching patient:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      {/* Patient Profile */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Patient Profile</CardTitle>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="text-sm"
          >
            Logout
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          {loading ? (
            <p>Loading...</p>
          ) : patient ? (
            <>
              <p><strong>User ID:</strong> {patient.P_ID}</p>
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Address:</strong> {patient.address}</p>
              <p><strong>DOB:</strong> {patient.DOB.slice(0, 10)}</p>
              <p><strong>Sex:</strong> {patient.sex}</p>
              <p><strong>Email:</strong> {patient.mail}</p>
              <p><strong>Phone:</strong> {patient.phone_no}</p>
              <p><strong>Emergency Contact:</strong> {patient.emergency_phone_no}</p>
              <p><strong>Admissions:</strong> {patient.admissions.length}</p>
              <p><strong>Allergies:</strong> {patient.allergies.map(a => a.name).join(", ") || "None"}</p>
            </>
          ) : (
            <p>Patient not found.</p>
          )}
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="request">Request Appointment</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <Card className="rounded-xl shadow">
            <CardHeader>
              <CardTitle>Previous Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No appointments found.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="rounded-xl shadow">
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No medical history available.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request">
          <Card className="rounded-xl shadow">
            <CardHeader>
              <CardTitle>Request Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="mb-2 block">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    name="date"
                    value={appointmentData.date}
                    onChange={handleChange}
                    className="p-2 border rounded"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="mb-2 block">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    name="time"
                    value={appointmentData.time}
                    onChange={handleChange}
                    className="p-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="message" className="mb-2 block">Symptoms / Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={appointmentData.message}
                  onChange={handleChange}
                  placeholder="Briefly describe your symptoms or concerns"
                  className="p-2 border rounded"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit Appointment Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientHome;
