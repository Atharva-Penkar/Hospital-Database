import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";

const Login = () => {
  const navigate = useNavigate();

  const handleAuth = async (
    userId: string,
    password: string,
    role: string,
    type: "login" | "signup"
  ) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      console.log("Login response:", data);
      navigate("/home");
    } catch (err: any) {
      console.error("Login error:", err);
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm onSubmit={handleAuth} />
    </div>
  );
};

export default Login;
