import React, { useEffect, useState } from "react";
import DoctorComplete from "@/components/doctor/doctorComplete";

const DoctorCompletePage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const localTheme = localStorage.getItem("theme");
      if (localTheme === "dark") return true;
      if (localTheme === "light") return false;
      // Fallback to system preference
      return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Sync <body> with darkMode state and persist in localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return <DoctorComplete />;
};

export default DoctorCompletePage;
