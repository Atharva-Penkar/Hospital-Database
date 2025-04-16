import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import PatientHomePage from "./pages/patient/PatientHomePage";
import PatientInfoFormPage from "./pages/patient/PatientInfoFormPage";
import LoginPatient from "./pages/login-signup/LoginPatient";
import SignUpPatient from "./pages/login-signup/SignUpPatient";
import LoginStaff from "./pages/login-signup/LoginStaff";
import FrontDeskHomePage from "./pages/frontDeskOperator/frontDeskOpDashboardPage";
import FrontDeskOpAppointments from "./pages/frontDeskOperator/frontDeskOpAppointmentsPage";
import FrontDeskOpAdmissions from "./pages/frontDeskOperator/frontDeskOpAdmissionsPage"; 
import FrontDeskOpTestsPage from "./pages/frontDeskOperator/frontDeskOpTestsPage";
import FrontDeskOpTreatmentsPage from "./pages/frontDeskOperator/frontDeskOpTreatmentsPage";
import DataEntryOpHomePage from "./pages/dataEntryOperator/dataEntryOpHomePage";
import DataEntryOpTestsPage from "./pages/dataEntryOperator/dataEntryOpTestsPage";
import DataEntryOpTreatmentsPage from "./pages/dataEntryOperator/dataEntryOpTreatmentsPage";


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
        <Route path="/front-desk-appointments" element={<FrontDeskOpAppointments />} />
        <Route path="/front-desk-admissions" element={<FrontDeskOpAdmissions />} /> 
        <Route path="/front-desk-tests" element={<FrontDeskOpTestsPage />} />
        <Route path="/front-desk-treatments" element={<FrontDeskOpTreatmentsPage />} />
        <Route path="/data-entry-dashboard" element={<DataEntryOpHomePage />} />
        <Route path="/data-entry-tests" element={<DataEntryOpTestsPage />} />
        <Route path="/data-entry-treatments" element={<DataEntryOpTreatmentsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
