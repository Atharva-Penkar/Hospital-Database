import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientHome from "@/components/patient/PatientHome"; // ✅ Correct import path

const PatientHomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    //navigate to login if userId is not available
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  return <PatientHome />;
};

export default PatientHomePage;
