import React, { useEffect, useState } from "react";
import DoctorComplete from "@/components/doctor/doctorComplete";

const DoctorCompletePage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Optionally set initial dark mode based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  // Keep <body> in sync with darkMode state
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return <DoctorComplete />;
};

export default DoctorCompletePage;
