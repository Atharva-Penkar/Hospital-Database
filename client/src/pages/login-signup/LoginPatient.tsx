import { useNavigate } from "react-router-dom";
import AuthFormPatient from "../../components/auth/AuthFormPatient"; // Make sure the path is correct
import { toast } from "sonner";

const LoginPatient = () => {
  const navigate = useNavigate();

  const handleAuth = async (
    userId: string,
    password: string,
    role: "patient",
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

      localStorage.setItem("userId", data.user.userId);
      localStorage.setItem("role", "patient");

      toast.success("Login successful!", {
        className: "bg-emerald-500 text-white",
      });

      navigate("/patientHome");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error("Login failed: " + err.message, {
        className: "bg-rose-500 text-white",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthFormPatient onSubmit={handleAuth} />
    </div>
  );
};

export default LoginPatient;
