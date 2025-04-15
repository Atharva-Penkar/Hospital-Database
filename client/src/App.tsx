import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import PatientHomePage from "./pages/patient/PatientHomePage";
import PatientInfoFormPage from "./pages/patient/PatientInfoFormPage";
import LoginPatient from "./pages/login-signup/LoginPatient";
import SignUpPatient from "./pages/login-signup/SignUpPatient";
import LoginStaff from "./pages/login-signup/LoginStaff";
import FrontDeskHomePage from "./pages/frontDeskOperator/frontDeskOpDashboardPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login-patient" replace />} />
        <Route path="/login-staff" element={<LoginStaff />} />
        <Route path="/login-patient" element={<LoginPatient />} />
        <Route path="/signup-patient" element={<SignUpPatient />} />
        <Route path="/patient-info" element={<PatientInfoFormPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/patientHome" element={<PatientHomePage />} />

        <Route path="/front-desk-dashboard" element={<FrontDeskHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
