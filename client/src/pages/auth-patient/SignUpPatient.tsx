import { useNavigate } from "react-router-dom";
import AuthFormPatient from "../../components/auth/AuthFormPatient";
import { toast } from "sonner";

// Try Codespace URL first, then localhost
const BACKEND_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev",
  "http://localhost:5000"
];

const SignUpPatient = () => {
  const navigate = useNavigate();

  const handleAuth = async (
    userId: string,
    password: string,
    role: "patient",
    type: "signup" | "login"
  ) => {
    let lastError: any = null;
    for (const baseUrl of BACKEND_URLS) {
      try {
        const apiUrl = "/api/auth-patient/signup";
        const res = await fetch(baseUrl + apiUrl, {
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

        navigate("/patient-info");
        return; // stop after successful signup
      } catch (err: any) {
        lastError = err;
        console.error(`Signup error with ${baseUrl}:`, err);
      }
    }
    toast.error("Signup failed: " + (lastError?.message || "Unknown error"), {
      className: "bg-rose-500 text-white",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthFormPatient onSubmit={handleAuth} />
    </div>
  );
};

export default SignUpPatient;
