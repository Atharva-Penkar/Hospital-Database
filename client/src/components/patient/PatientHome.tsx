import { useState } from "react";
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

const PatientHome = () => {
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

  const handleSubmit = () => {
    // TODO: Hook up to backend
    console.log("Appointment requested:", appointmentData);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Patient Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>PID:</strong> P123456</p>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Address:</strong> 123 Main St</p>
          <p><strong>DOB:</strong> 1990-01-01</p>
          <p><strong>Sex:</strong> Male</p>
          <p><strong>Email:</strong> john@example.com</p>
          <p><strong>Phone:</strong> 9876543210</p>
          <p><strong>Alt Phone:</strong> 1122334455</p>
          <p><strong>Emergency Contact:</strong> 9988776655</p>
          <p><strong>Admissions:</strong> 2</p>
          <p><strong>Allergies:</strong> Penicillin</p>
        </CardContent>
      </Card>

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" name="date" value={appointmentData.date} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input type="time" name="time" value={appointmentData.time} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Symptoms / Message</Label>
                <Textarea
                  name="message"
                  rows={4}
                  value={appointmentData.message}
                  onChange={handleChange}
                  placeholder="Briefly describe your symptoms or concerns"
                />
              </div>
              <Button onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700">
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
