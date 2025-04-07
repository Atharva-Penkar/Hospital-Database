// src/pages/Signup.tsx
import { useNavigate } from "react-router-dom"
import AuthForm from "../components/auth/AuthForm"

export default function Signup() {
  const navigate = useNavigate()

  const handleSignup = ({ email, password }: { email: string; password: string }) => {
    console.log("Signing up with:", email, password)
    // Replace this with actual signup logic (e.g., Supabase Auth)
    navigate("/dashboard") // Redirect after successful signup
  }

  return <AuthForm type="signup" onSubmit={handleSignup} />
}
