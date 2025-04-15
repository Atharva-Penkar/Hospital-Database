import { useEffect, useState } from "react";
import HomePage from "@/components/frontDeskOperator/frontDeskOpDashboard";

const FrontDeskHomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return <HomePage darkMode={darkMode} toggleDarkMode={() => setDarkMode((prev) => !prev)} />;
};

export default FrontDeskHomePage;
