import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientInfoForm from "../../components/patient/PatientInfoForm";

const PatientInfoFormPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [navigate, userId]);

  if (!userId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PatientInfoForm userId={userId} />
    </div>
  );
};

export default PatientInfoFormPage;
