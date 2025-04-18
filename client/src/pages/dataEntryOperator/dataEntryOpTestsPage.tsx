import React, { useEffect, useState } from "react";
import DataEntryOpTests from "@/components/dataEntryOperator/dataEntryOpTests";

const DataEntryOpHomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for user's preferred theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add("dark");
    } else if (savedTheme === 'light') {
      setDarkMode(false);
      document.body.classList.remove("dark");
    } else {
      // Check system preference if no saved preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
        document.body.classList.add("dark");
      }
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

  return <DataEntryOpTests darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
};

export default DataEntryOpHomePage;
