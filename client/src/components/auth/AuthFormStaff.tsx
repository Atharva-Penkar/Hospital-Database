import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

interface AuthFormProps {
  onSubmit: (
    userId: string,
    password: string,
    role: string
  ) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor"); // Default role

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form:", { userId, password, role });
    onSubmit(userId, password, role);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 w-full max-w-lg mx-auto mt-24 p-10 bg-white border border-gray-200 rounded-2xl shadow-2xl"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Staff Login
      </h2>

      <div className="space-y-3">
        <Label htmlFor="userId" className="text-lg">User ID</Label>
        <Input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="password" className="text-lg">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-3">
        <Label className="text-lg">User Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select user role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="frontdesk">Front Desk Operator</SelectItem>
            <SelectItem value="dataentry">Data Entry Operator</SelectItem>
            <SelectItem value="admin">System Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full text-lg py-3">
        Log In
      </Button>
    </form>
  );
};

export default AuthForm;
