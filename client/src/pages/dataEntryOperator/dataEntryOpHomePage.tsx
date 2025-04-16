import { useEffect, useState } from "react";
import DataEntryOpHome from "@/components/dataEntryOperator/dataEntryOpHome";

const DataEntryOpHomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <DataEntryOpHome
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode((prev) => !prev)}
    />
  );
};

export default DataEntryOpHomePage;
