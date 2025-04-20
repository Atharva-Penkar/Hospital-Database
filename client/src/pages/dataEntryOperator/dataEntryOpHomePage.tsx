// app/(routes)/data-entry-operator/page.tsx
"use client";

import { useState, useEffect } from "react";
import DataEntryOpHome from "@/components/dataEntryOperator/dataEntryOpHome";

const DataEntryOpHomePage = () => {
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

  return <DataEntryOpHome darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
};

export default DataEntryOpHomePage;
