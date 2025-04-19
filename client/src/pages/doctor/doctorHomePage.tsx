import React, { useEffect, useState } from "react";
import DoctorHome from "@/components/doctor/doctorHome";

const DoctorHomePage: React.FC = () => {
  const [darkMode] = useState(false);

  // Set or remove the dark class on the body based on darkMode state
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return <DoctorHome />;
};

export default DoctorHomePage;
