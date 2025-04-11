import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import HomePage from "./pages/Home";
import PatientHomePage from "./pages/patient/PatientHomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/patientHome" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/patientHome" element={<PatientHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
