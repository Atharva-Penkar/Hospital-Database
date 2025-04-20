// src/gate-components/StaffLoginForm.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const StaffLoginForm = () => {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !formData.password || !formData.role) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      toast.success("Login successful!");
      // redirect based on role if needed
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 w-full max-w-lg mx-auto mt-24 p-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
        Staff Login
      </h2>

      <div className="space-y-3">
        <Label htmlFor="userId" className="text-lg">User ID</Label>
        <Input
          id="userId"
          name="userId"
          type="text"
          value={formData.userId}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="password" className="text-lg">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="role" className="text-lg">Role</Label>
        <Select onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="front-desk-operator">Front Desk Operator</SelectItem>
            <SelectItem value="data-entry-operator">Data Entry Operator</SelectItem>
            <SelectItem value="database-administrator">Database Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full text-lg py-3">
        Login
      </Button>
    </form>
  );
};
