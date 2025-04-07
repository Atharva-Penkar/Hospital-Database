import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface AuthFormProps {
  onSubmit: (
    userId: string,
    password: string,
    role: string,
    type: "login" | "signup"
  ) => void
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit }) => {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("patient")
  const [type, setType] = useState<"login" | "signup">("login")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(userId, password, role, type)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-md mx-auto mt-20 p-8 bg-white border border-gray-200 rounded-2xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {type === "login" ? "Login" : "Sign Up"}
      </h2>

      <div className="space-y-2">
        <Label htmlFor="userId">User ID</Label>
        <Input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>User Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select user role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontdesk">Front Desk Operator</SelectItem>
            <SelectItem value="dataentry">Data Entry Operator</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="admin">Database Administrator</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full text-base py-2">
        {type === "login" ? "Log In" : "Sign Up"}
      </Button>

      <div className="text-sm text-center text-gray-600">
        {type === "login" ? (
          <>
            Don’t have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => setType("signup")}
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
              onClick={() => setType("login")}
            >
              Log In
            </button>
          </>
        )}
      </div>
    </form>
  )
}

export default AuthForm
