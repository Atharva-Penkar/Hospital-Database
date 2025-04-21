"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
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
import { Sun, Moon } from "lucide-react";

const STAFF_ROLES = [
  { value: "doctor", label: "Doctor" },
  { value: "front-desk-operator", label: "Front Desk Operator" },
  { value: "data-entry-operator", label: "Data Entry Operator" },
  { value: "database-administrator", label: "Database Administrator" },
];

// All backend bases for robust login
const STAFF_LOGIN_BASES = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev",
  "http://localhost:5000"
];

export const AuthFormStaff = () => {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    role: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // On mount, set theme based on localStorage or system preference – apply to root (<html>)
  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (
      localTheme === "dark" ||
      (!localTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
  };

  // Common handler for navigation and localStorage
  const handleLoginSuccess = (user: any, role: string) => {
    if (role === "doctor") {
      // Set D_ID in localStorage and navigate
      localStorage.setItem("D_ID", String(user.userId ?? user.D_ID ?? user.id));
      navigate("/doctor-home");
    } else if (role === "front-desk-operator") {
      localStorage.setItem("operator_ID", String(user.userId ?? user.id));
      navigate("/front-desk-dashboard");
    } else if (role === "data-entry-operator") {
      localStorage.setItem("operator_ID", String(user.userId ?? user.id));
      navigate("/data-entry-home");
    } else if (role === "database-administrator") {
      localStorage.setItem("administrator_ID", String(user.userId ?? user.id));
      navigate("/database-manager");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.password || !formData.role) {
      toast.error("Please fill all fields");
      return;
    }
    let lastError: any = null;
    for (const base of STAFF_LOGIN_BASES) {
      try {
        const res = await fetch(`${base}/api/auth/staff/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            userId: isNaN(Number(formData.userId)) ? formData.userId : Number(formData.userId)
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        toast.success("Login successful!");
        handleLoginSuccess(data.user, formData.role);
        return;
      } catch (err: any) {
        lastError = err;
      }
    }
    toast.error(lastError?.message || "Login failed");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"
      } flex flex-col`}
    >
      {/* Full-width Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white dark:bg-zinc-900 shadow">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            MASA Hospital
          </h1>
        </div>
        {/* Dark Mode Toggle Switch */}
        <div
          className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label="Toggle dark mode"
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
      </header>

      {/* Centered Login Form */}
      <main className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 w-full max-w-xl mx-auto p-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Staff Login
          </h2>

          <div className="space-y-2">
            <Label htmlFor="userId" className="block text-base">
              User ID
            </Label>
            <Input
              id="userId"
              name="userId"
              type="text"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="block text-base">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="block text-base">
              Role
            </Label>
            <Select onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Login
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AuthFormStaff;
