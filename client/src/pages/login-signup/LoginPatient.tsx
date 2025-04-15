import { useNavigate } from "react-router-dom";
import AuthFormPatient from "../../components/auth/AuthFormPatient";
import { toast } from "sonner";

const LoginPatient = () => {
  const navigate = useNavigate();

  const handleAuth = async (
    userId: string,
    password: string,
    role: "patient", // You can keep this for future use if needed
    type: "login" | "signup"
  ) => {
    try {
      // Decide the API URL based on the type (login or signup)
      const apiUrl = type === "login" ? "/api/auth/login" : "/api/auth/signup";

      const res = await fetch("http://127.0.0.1:5000" + apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Store JWT token in localStorage after login
      localStorage.setItem("token", data.token); // Save the JWT token

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
