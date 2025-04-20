import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import PatientHomePage from "./pages/patient/PatientHomePage";
import PatientInfoFormPage from "./pages/patient/PatientInfoFormPage";
import LoginPatient from "./pages/login-signup/LoginPatient";
import SignUpPatient from "./pages/login-signup/SignUpPatient";
import FrontDeskHomePage from "./pages/frontDeskOperator/frontDeskOpDashboardPage";
import FrontDeskOpAppointments from "./pages/frontDeskOperator/frontDeskOpAppointmentsPage";
import FrontDeskOpAdmissions from "./pages/frontDeskOperator/frontDeskOpAdmissionsPage";
import FrontDeskOpTestsPage from "./pages/frontDeskOperator/frontDeskOpTestsPage";
import FrontDeskOpTreatmentsPage from "./pages/frontDeskOperator/frontDeskOpTreatmentsPage";
import DataEntryOpHomePage from "./pages/dataEntryOperator/dataEntryOpHomePage";
import DoctorHomePage from "./pages/doctor/doctorHomePage";
import DoctorPendingPage from "./pages/doctor/doctorPendingPage"
import DoctorCompletePage from "./pages/doctor/doctorCompletePage";
import DatabaseManager from "./pages/dbmanager/dashboard";
import StaffLoginPage from "./pages/auth-staff/LoginStaff";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login-patient" replace />} />
        <Route path="/login-patient" element={<LoginPatient />} />

        <Route path="/login-staff" element={<StaffLoginPage />} />

        <Route path="/signup-patient" element={<SignUpPatient />} />
        <Route path="/patient-info" element={<PatientInfoFormPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/patientHome" element={<PatientHomePage />} />
        <Route path="/front-desk-dashboard" element={<FrontDeskHomePage />} />
        <Route path="/front-desk-appointments" element={<FrontDeskOpAppointments />} />
        <Route path="/front-desk-appointments" element={<FrontDeskOpAppointments />} />
        <Route path="/front-desk-admissions" element={<FrontDeskOpAdmissions />} />
        <Route path="/front-desk-tests" element={<FrontDeskOpTestsPage />} />
        <Route path="/front-desk-treatments" element={<FrontDeskOpTreatmentsPage />} />
        <Route path="/data-entry-home" element={<DataEntryOpHomePage />} />
        <Route path="/doctor-home" element={<DoctorHomePage />} />
        <Route path="/doctor-pending" element={<DoctorPendingPage />} />
        <Route path="/doctor-complete" element={<DoctorCompletePage />} />
        <Route path="/database-manager" element={<DatabaseManager />} />
      </Routes>
    </Router>
  );
}

export default App;
