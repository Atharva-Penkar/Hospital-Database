// src/pages/Login.tsx
import { useNavigate } from "react-router-dom"
import AuthForm from "../components/auth/AuthForm"

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = ({ email, password }: { email: string; password: string }) => {
    console.log("Logging in with:", email, password)
    // Add real login logic here
    navigate("/dashboard") // redirect after login
  }

  return <AuthForm type="login" onSubmit={handleLogin} />
}
