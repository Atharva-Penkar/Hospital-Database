import { useEffect, useState } from "react";
import DataEntryOperatorHome from "@/components/dataEntryOperator/dataEntryOperatorHome";

const DataEntryOperatorHomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <DataEntryOperatorHome
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode((prev) => !prev)}
    />
  );
};

export default DataEntryOperatorHomePage;
