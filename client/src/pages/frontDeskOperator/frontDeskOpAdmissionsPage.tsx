// app/(routes)/front-desk-operator/frontDeskOpAppointmentsPage.tsx
"use client";

import { useState } from "react";
import FrontDeskOpAdmissions from "@/components/frontDeskOperator/frontDeskOpAdmissions";

export default function FrontDeskOpAppointmentsPage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return <FrontDeskOpAdmissions darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
}
