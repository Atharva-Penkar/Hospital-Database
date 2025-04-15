import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

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

  // Set form type based on URL
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 w-full max-w-lg mx-auto mt-24 p-10 bg-white border border-gray-200 rounded-2xl shadow-2xl"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        {authType === "login" ? "Patient Login" : "Patient Sign Up"}
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

      <Button type="submit" className="w-full text-lg py-3">
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
  );
};

export default AuthFormPatient;
