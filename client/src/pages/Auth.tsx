import AuthForm from "../components/auth/AuthForm"

const Auth = () => {
  const handleAuth = async (
    userId: string,
    password: string,
    role: string,
    type: "login" | "signup"
  ) => {
    const endpoint =
      type === "signup"
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login"

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password, role }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Auth failed")

      console.log(`${type.toUpperCase()} successful:`, data.user)
      // Optionally: localStorage.setItem("user", JSON.stringify(data.user))
      // or redirect to /dashboard
    } catch (err: any) {
      console.error(`${type.toUpperCase()} error:`, err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm onSubmit={handleAuth} />
    </div>
  )
}

export default Auth
