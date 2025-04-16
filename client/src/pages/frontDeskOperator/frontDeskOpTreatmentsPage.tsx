// app/frontDeskOperator/frontDeskOpTreatmentsPage.tsx

"use client";

import { useState, useEffect } from "react";
import FrontDeskOpTreatments from "@/components/frontDeskOperator/frontDeskOpTreatments";

const FrontDeskOpTreatmentsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return <FrontDeskOpTreatments darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
};

export default FrontDeskOpTreatmentsPage;
