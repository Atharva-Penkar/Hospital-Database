import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();

  const handleAuth = async (
    userId: string,
    password: string,
    role: string,
    type: "login" | "signup"
  ) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("userId", data.user.userId);

      toast.success("Signup successful!", {
        className: "bg-emerald-500 text-white",
      });
      // After a successful signup
      if (role === "patient") {
        navigate("/patient-info");
      } else {
        navigate("/home");
      }

    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error("Signup failed: " + err.message, {
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

export default SignUp;
