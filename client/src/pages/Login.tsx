import AuthForm from "../components/auth/AuthForm"

const Login = () => {
  const handleAuth = (
    email: string,
    password: string,
    role: string,
    type: "login" | "signup"
  ) => {
    console.log(`${type.toUpperCase()} as ${role}:`, { email, password })
    // Replace with API logic
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm onSubmit={handleAuth} />
    </div>
  )
}

export default Login
