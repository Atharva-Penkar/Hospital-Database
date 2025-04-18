import React, { useEffect, useState } from "react";
import DataEntryOpHome from "@/components/dataEntryOperator/dataEntryOpHome";

const DataEntryOpHomePage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Keep <body> in sync with darkMode state
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return <DataEntryOpHome />;
};

export default DataEntryOpHomePage;
