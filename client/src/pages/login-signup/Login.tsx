import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
import { toast } from "sonner";

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

      // ✅ Save user ID and role in localStorage
      localStorage.setItem("userId", data.user.userId);
      localStorage.setItem("role", role);

      toast.success("Login successful!", {
        className: "bg-emerald-500 text-white",
      });

      // ✅ Navigate based on role
      if (role === "patient") {
        navigate("/patientHome");
      } else {
        navigate("/home");
      }

    } catch (err: any) {
      console.error("Login error:", err);
      toast.error("Login failed: " + err.message, {
        className: "bg-rose-500 text-white",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm onSubmit={handleAuth} />
    </div>
  );
};

export default Login;
