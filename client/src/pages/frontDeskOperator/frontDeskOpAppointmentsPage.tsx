// app/(routes)/front-desk-operator/frontDeskOpAppointmentsPage.tsx
"use client";

import { useState } from "react";
import FrontDeskOpAppointments from "@/components/frontDeskOperator/frontDeskOpAppointments";

export default function FrontDeskOpAppointmentsPage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return <FrontDeskOpAppointments darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
}
