"use client";
import HospitalHome from "@/components/hospitalHome/landingComponent";
import { useState } from "react";

export default function HospitalHomePage() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const localTheme = localStorage.getItem("theme");
      return localTheme === "dark";
    }
    return false; // Default to light mode
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
      }
      return next;
    });
  };

  return (
    <HospitalHome darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  );
}
