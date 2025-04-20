"use client";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Sun, Moon } from "lucide-react";

interface AuthFormPatientProps {
  onSubmit: (
    userId: string,
    password: string,
    role: "patient",
    type: "login" | "signup"
  ) => void;
}

const AuthFormPatient: React.FC<AuthFormPatientProps> = ({ onSubmit }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [authType, setAuthType] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (location.pathname === "/signup-patient") {
      setAuthType("signup");
    } else {
      setAuthType("login");
    }
  }, [location.pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(userId, password, "patient", authType);
  };

  const [darkMode, setDarkMode] = useState(false);
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

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"
      } flex flex-col`}
    >
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white dark:bg-zinc-900 shadow">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">MASA Hospital</h1>
        </div>
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
      <main className="w-full flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 w-full max-w-xl mx-auto p-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            {authType === "login" ? "Patient Login" : "Patient Sign Up"}
          </h2>
          <div className="space-y-3">
            <Label htmlFor="userId" className="block text-lg">
              User ID
            </Label>
            <Input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="password" className="block text-lg">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full text-lg py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {authType === "login" ? "Log In" : "Sign Up"}
          </Button>
          <div className="text-md text-center text-gray-600">
            {authType === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => navigate("/signup-patient")}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => navigate("/login-patient")}
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default AuthFormPatient;
