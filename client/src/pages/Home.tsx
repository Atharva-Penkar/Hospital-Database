import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast("Please login first.", {
        className: "bg-yellow-500 text-white",
      });      
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.info("You're already logged out.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Logout error:", data);
        throw new Error(data.message || "Logout failed");
      }

      localStorage.removeItem("userId");
      toast.success("Logged out successfully!", {
        className: "bg-emerald-500 text-white",
      });      
      navigate("/login");
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Try again.", {
        className: "bg-rose-500 text-white",
      });
      
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-2xl gap-4">
      <p>Welcome to the Hospital Management System!</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
