import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthFormStaff";
import { toast } from "sonner";

const LoginStaff = () => {
  const navigate = useNavigate();

  const handleAuth = async (
    userId: string,
    password: string,
    role: string,
  ) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save user ID and role in localStorage
      localStorage.setItem("userId", data.user.userId);
      localStorage.setItem("role", role);

      toast.success("Login successful!", {
        className: "bg-emerald-500 text-white",
      });

      // Navigate based on role
      switch (role) {
        case "doctor":
          navigate("/doctor-dashboard");
          break;
        case "frontdesk":
          navigate("/frontdesk-dashboard");
          break;
        case "dataentry":
          navigate("/dataentry-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
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

export default LoginStaff;
