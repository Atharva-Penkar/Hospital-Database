import { useState } from "react";
import DataEntryOperatorHome from "@/components/dataEntryOperator/dataEntryOperatorHome"; // Import your DataEntryOperatorHome component

const DataEntryOperatorHomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div>
      <DataEntryOperatorHome darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
};

export default DataEntryOperatorHomePage;
