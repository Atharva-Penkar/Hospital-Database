import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const SignUpFormPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    DOB: "",
    Sex: "M",
    mail: "",
    phone_no: "",
    emergency_phone_no: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/patient/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Signup failed");
        return;
      }

      const data = await response.json();
      toast.success("Patient signup successful!");
      console.log("Created patient:", data);
      // optionally redirect or reset form
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Patient Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="DOB">Date of Birth</Label>
              <Input id="DOB" type="date" name="DOB" value={formData.DOB} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="Sex">Sex</Label>
              <select
                id="Sex"
                name="Sex"
                value={formData.Sex}
                onChange={handleChange}
                className="w-full h-10 px-3 border rounded-md"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="mail">Email</Label>
              <Input id="mail" name="mail" type="email" value={formData.mail} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="phone_no">Phone Number</Label>
              <Input id="phone_no" name="phone_no" value={formData.phone_no} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="emergency_phone_no">Emergency Phone</Label>
              <Input
                id="emergency_phone_no"
                name="emergency_phone_no"
                value={formData.emergency_phone_no}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="bg-blue-600 text-white w-full hover:bg-blue-700 mt-4"
          >
            Sign Up
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpFormPage;
