// app/(routes)/front-desk/tests/page.tsx
"use client";

import FrontDeskOpTests from "@/components/frontDeskOperator/frontDeskOpTests";
import { useState } from "react";

const TestsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return <FrontDeskOpTests darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
};

export default TestsPage;
