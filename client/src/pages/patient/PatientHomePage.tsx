import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PatientHomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="w-full py-6 text-lg"
          onClick={() => navigate("/appointments")}
        >
          View Appointments
        </Button>
        <Button
          variant="outline"
          className="w-full py-6 text-lg"
          onClick={() => navigate("/history")}
        >
          Medical History
        </Button>
        <Button
          className="w-full py-6 text-lg bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => navigate("/request-appointment")}
        >
          Request Appointment
        </Button>
      </div>

      <div className="rounded-xl shadow p-6 bg-white border text-sm grid grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

export default PatientHomePage;
