import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this import
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { toast } from "sonner";

interface PatientInfoFormProps {
  userId: string;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({ userId }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [DOB, setDOB] = useState("");
  const [sex, setSex] = useState("M");
  const [mail, setMail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [emergencyPhoneNo, setEmergencyPhoneNo] = useState("");

  const navigate = useNavigate(); // ✅ Add this hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/api/patient-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          P_ID: userId,
          name,
          address,
          DOB,
          sex,
          mail,
          phone_no: phoneNo,
          emergency_phone_no: emergencyPhoneNo,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit info");

      toast.success("Patient info saved successfully!", {
        className: "bg-emerald-500 text-white",
      });

      // ✅ Navigate to patient home after success
      navigate("/patientHome");

    } catch (err: any) {
      toast.error("Submission error: " + err.message, {
        className: "bg-rose-500 text-white",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-2xl mx-auto mt-20 bg-white p-10 shadow-lg rounded-xl"
    >
      <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>

      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="DOB">Date of Birth</Label>
        <Input id="DOB" type="date" value={DOB} onChange={(e) => setDOB(e.target.value)} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="sex">Sex</Label>
        <Select value={sex} onValueChange={setSex}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="M">Male</SelectItem>
            <SelectItem value="F">Female</SelectItem>
            <SelectItem value="O">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="mail">Email</Label>
        <Input id="mail" type="email" value={mail} onChange={(e) => setMail(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="phoneNo">Phone Number</Label>
        <Input
          id="phoneNo"
          type="tel"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="emergencyPhoneNo">Emergency Phone Number</Label>
        <Input
          id="emergencyPhoneNo"
          type="tel"
          value={emergencyPhoneNo}
          onChange={(e) => setEmergencyPhoneNo(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full text-lg py-3">
        Submit Info
      </Button>
    </form>
  );
};

export default PatientInfoForm;
