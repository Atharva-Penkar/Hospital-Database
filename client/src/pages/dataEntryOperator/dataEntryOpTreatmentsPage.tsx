import React, { useEffect, useState } from "react";
import DataEntryOpTreatments from "@/components/dataEntryOperator/dataEntryOpTreatments";

const DataEntryOpTreatmentsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Optionally persist theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add("dark");
    } else if (savedTheme === 'light') {
      setDarkMode(false);
      document.body.classList.remove("dark");
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <DataEntryOpTreatments
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
    />
  );
};

export default DataEntryOpTreatmentsPage;
