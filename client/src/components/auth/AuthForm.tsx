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
      className="space-y-8 w-full max-w-lg mx-auto mt-24 p-10 bg-white border border-gray-200 rounded-2xl shadow-2xl"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        {type === "login" ? "Login" : "Sign Up"}
      </h2>

      <div className="space-y-3">
        <Label htmlFor="userId" className="text-lg">User ID</Label>
        <Input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="text-base"
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
          className="text-base"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-lg">User Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="text-base">
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

      <Button type="submit" className="w-full text-lg py-3">
        {type === "login" ? "Log In" : "Sign Up"}
      </Button>

      <div className="text-md text-center text-gray-600">
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
