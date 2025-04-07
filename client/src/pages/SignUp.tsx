import React from "react"
import AuthForm from "../components/auth/AuthForm"

const SignUp = () => {
  const handleAuth = (
    email: string,
    password: string,
    role: string,
    type: "login" | "signup"
  ) => {
    console.log(`SIGNUP as ${role}:`, { email, password })
    // Replace with your signup API logic here
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm onSubmit={handleAuth} />
    </div>
  )
}

export default SignUp
