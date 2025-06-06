import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut, Sun, Moon, X } from "lucide-react";
import { toast } from "sonner";

const DOSAGE_OPTIONS = [
  { value: "YNN", label: "Morning only" },
  { value: "NYN", label: "Afternoon only" },
  { value: "NNY", label: "Night only" },
  { value: "YYN", label: "Morning & Afternoon" },
  { value: "YNY", label: "Morning & Night" },
  { value: "NYY", label: "Afternoon & Night" },
  { value: "YYY", label: "All three times" },
];

// All backend bases for robust fetch
const BASES = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev",
  "http://localhost:5000"
];

const LOGOUT_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/auth-staff/logout/doctor",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/auth-staff/logout/doctor",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/auth-staff/logout/doctor",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/auth-staff/logout/doctor",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/auth-staff/logout/doctor",
  "http://localhost:5000/api/auth-staff/logout/doctor"
];

const DoctorPending: React.FC = () => {
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("appointmentId");
    setAppointmentId(id);
  }, []);

  const handleLogout = async () => {
    try {
      let lastError: any = null;
      let logoutSuccess = false;
      for (const base of LOGOUT_URLS) {
        try {
          const res = await fetch(base, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: localStorage.getItem("D_ID") || ""
            }),
          });
          if (!res.ok) {
            console.error(`Logout error from ${base}: ${res.status}`);
            continue;
          }
          logoutSuccess = true;
          break; // Successful logout, exit the loop
        } catch (err) {
          lastError = err;
          console.error(`Logout error from ${base}:`, err);
        }
      }
      if (!logoutSuccess) {
        throw lastError;
      }
      localStorage.removeItem("D_ID");
      toast.success("Logout successful!");
      navigate("/login-staff");
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error("Logout failed: " + error.message);
    }
  };

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data fetched from backend
  const [appointment, setAppointment] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [diagnosisOptions, setDiagnosisOptions] = useState<string[]>([]);
  const [testOptions, setTestOptions] = useState<string[]>([]);
  const [treatmentOptions, setTreatmentOptions] = useState<string[]>([]);

  // Form state for doctor's inputs
  const [diagnosis, setDiagnosis] = useState("");
  const [tests, setTests] = useState<string[]>([]);
  const [treatments, setTreatments] = useState<
    { name: string; dosage: string; duration: string }[]
  >([]);
  const [admit, setAdmit] = useState(false);

  // For treatment selection
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [selectedDosage, setSelectedDosage] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  // For single-select tests dropdown
  const [availableTests, setAvailableTests] = useState<string[]>([]);
  const [selectedTest, setSelectedTest] = useState("");

  // Keep availableTests in sync with testOptions and tests
  useEffect(() => {
    setAvailableTests(testOptions.filter((t) => !tests.includes(t)));
  }, [testOptions, tests]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch appointment details
        let appointmentData = null;
        let lastError = null;
        for (let base of BASES) {
          try {
            const appointmentRes = await fetch(`${base}/api/appointment-details/${appointmentId}`);
            if (appointmentRes.ok) {
              appointmentData = await appointmentRes.json();
              break;
            } else {
              lastError = new Error(`HTTP error ${appointmentRes.status} from ${base}`);
            }
          } catch (err) {
            lastError = err;
          }
        }
        if (!appointmentData) throw lastError || new Error("Failed to fetch appointment details");
        setAppointment(appointmentData.appointment);

        // Fetch patient details (for medical history, allergies, etc.)
        if (appointmentData.appointment?.P_ID) {
          let patientData = null;
          for (let base of BASES) {
            try {
              const patientRes = await fetch(`${base}/api/patient/${appointmentData.appointment.P_ID}`);
              if (patientRes.ok) {
                patientData = await patientRes.json();
                break;
              }
            } catch { }
          }
          if (patientData) setPatient(patientData.patient);
        }

        // Fetch available diagnoses
        let diagnosisData = null;
        for (let base of BASES) {
          try {
            const diagnosisRes = await fetch(`${base}/api/diagnoses`);
            if (diagnosisRes.ok) {
              diagnosisData = await diagnosisRes.json();
              break;
            }
          } catch { }
        }
        setDiagnosisOptions(diagnosisData?.diagnoses?.map((d: any) => d.diagnosis_Name) || []);

        // Fetch available tests
        let testData = null;
        for (let base of BASES) {
          try {
            const testRes = await fetch(`${base}/api/tests-available`);
            if (testRes.ok) {
              testData = await testRes.json();
              break;
            }
          } catch { }
        }
        setTestOptions(testData?.tests?.map((t: any) => t.test_name) || []);

        // Fetch available treatments
        let treatmentData = null;
        for (let base of BASES) {
          try {
            const treatmentRes = await fetch(`${base}/api/treatments-available`);
            if (treatmentRes.ok) {
              treatmentData = await treatmentRes.json();
              break;
            }
          } catch { }
        }
        setTreatmentOptions(treatmentData?.treatments?.map((t: any) => t.treatment_name) || []);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    if (appointmentId) fetchAll();
  }, [appointmentId]);

  const handleAddTreatment = () => {
    if (selectedTreatment && selectedDosage && selectedDuration) {
      setTreatments((prev) => [
        ...prev,
        {
          name: selectedTreatment,
          dosage: selectedDosage,
          duration: selectedDuration,
        },
      ]);
      setSelectedTreatment("");
      setSelectedDosage("");
      setSelectedDuration("");
    }
  };

  const handleRemoveTreatment = (idx: number) => {
    setTreatments((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- Tests: Add selected test ---
  const handleAddTest = () => {
    if (selectedTest && !tests.includes(selectedTest)) {
      setTests((prev) => [...prev, selectedTest]);
      setSelectedTest("");
    }
  };

  // --- Tests: Remove a chosen test ---
  const handleRemoveTest = (test: string) => {
    setTests((prev) => prev.filter((t) => t !== test));
  };

  // --- Submit request to complete the appointment ---
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. POST to add appointment details
      let postSuccess = false;
      let lastPostError = null;
      for (let base of BASES) {
        try {
          const res = await fetch(`${base}/api/appointment-details/add/${appointmentId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              diagnosis,
              tests,
              treatments,
              admit,
            }),
          });
          if (res.ok) {
            postSuccess = true;
            break;
          } else {
            lastPostError = new Error(`POST failed with status ${res.status} from ${base}`);
          }
        } catch (err) {
          lastPostError = err;
        }
      }
      if (!postSuccess) throw lastPostError || new Error("Failed to add appointment details");

      // 2. PUT to set appointment as finished
      let putSuccess = false;
      let lastPutError = null;
      for (let base of BASES) {
        try {
          const res = await fetch(`${base}/api/appointment-details/set/${appointmentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          if (res.ok) {
            putSuccess = true;
            break;
          } else {
            lastPutError = new Error(`PUT failed with status ${res.status} from ${base}`);
          }
        } catch (err) {
          lastPutError = err;
        }
      }
      if (!putSuccess) throw lastPutError || new Error("Failed to finish appointment");

      // Success!
      navigate("/doctor-home");
    } catch (err: any) {
      setError(err.message || "Error submitting doctor's orders");
    } finally {
      setLoading(false);
    }
  };

  // --- Button enable/disable logic ---
  const canSubmit =
    !!diagnosis ||
    tests.length > 0 ||
    treatments.length > 0 ||
    admit;

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"}`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Hospital Logo" className="h-16 w-16" />
          <h1 className="text-3xl font-bold">MASA Hospital</h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-7" : "translate-x-1"}`}
            />
            <div className="absolute inset-0 flex justify-between items-center px-1.5">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Moon className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <Button
            variant="destructive"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}

      {/* Patient Info & Medical History */}
      {!loading && appointment && patient && (
        <Card className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-2">
                <div><b>Name:</b> {patient.name}</div>
                <div><b>Patient ID:</b> {patient.P_ID}</div>
                <div><b>DOB:</b> {patient.DOB ? new Date(patient.DOB).toLocaleDateString() : "N/A"}</div>
                <div><b>Sex:</b> {patient.Sex}</div>
                <div><b>Phone:</b> {patient.phone_no}</div>
                <div><b>Emergency Contact:</b> {patient.emergency_phone_no}</div>
              </div>
              <div className="flex-1">
                <b>Medical History:</b>
                <ul className="list-disc ml-6">
                  {patient.medicalHistory?.length
                    ? patient.medicalHistory.map((mh: any, i: number) =>
                      <li key={i}>{mh.disease?.Disease_Name || "Unknown"}</li>
                    )
                    : <li>None</li>
                  }
                </ul>
                <b>Allergies:</b>
                <ul className="list-disc ml-6">
                  {patient.allergies?.length
                    ? patient.allergies.map((a: any, i: number) =>
                      <li key={i}>{a.name || "Unknown"}</li>
                    )
                    : <li>None</li>
                  }
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {!loading && appointment && (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Appointment Request Details & Actions */}
          <div className="flex-1 space-y-6">
            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle>Appointment Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div><b>Date:</b> {appointment.TimeStamp ? new Date(appointment.TimeStamp).toLocaleDateString() : ""}</div>
                <div><b>Time:</b> {appointment.TimeStamp ? new Date(appointment.TimeStamp).toLocaleTimeString() : ""}</div>
                <div><b>Symptoms:</b> {appointment.Symptoms || "N/A"}</div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle>Doctor Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Diagnosis */}
                <div className="mb-4">
                  <label className="font-semibold block mb-1">Diagnosis</label>
                  <select
                    className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                  >
                    <option value="">Select diagnosis</option>
                    {diagnosisOptions.map((diag) => (
                      <option key={diag} value={diag}>{diag}</option>
                    ))}
                  </select>
                </div>

                {/* Tests */}
                <div className="mb-4">
                  <label className="font-semibold block mb-1">Tests to Prescribe</label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                      value={selectedTest}
                      onChange={e => setSelectedTest(e.target.value)}
                    >
                      <option value="">Select test</option>
                      {availableTests.map((test) => (
                        <option key={test} value={test}>{test}</option>
                      ))}
                    </select>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleAddTest}
                      disabled={!selectedTest}
                    >
                      Add
                    </Button>
                  </div>
                  {/* Tests Chosen */}
                  {tests.length > 0 && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">Tests Chosen:</div>
                      <div className="flex flex-wrap gap-2">
                        {tests.map((test) => (
                          <span key={test} className="inline-flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
                            {test}
                            <button
                              className="ml-1 text-blue-800 hover:text-red-600 focus:outline-none"
                              onClick={() => handleRemoveTest(test)}
                              aria-label="Remove test"
                              type="button"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Treatments */}
                <div className="mb-4">
                  <label className="font-semibold block mb-1">Treatments to Prescribe</label>
                  <div className="flex flex-col md:flex-row gap-2 mb-2">
                    <select
                      className="flex-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                      value={selectedTreatment}
                      onChange={e => setSelectedTreatment(e.target.value)}
                    >
                      <option value="">Select treatment</option>
                      {treatmentOptions.map((treat) => (
                        <option key={treat} value={treat}>{treat}</option>
                      ))}
                    </select>
                    <select
                      className="flex-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                      value={selectedDosage}
                      onChange={e => setSelectedDosage(e.target.value)}
                    >
                      <option value="">Dosage</option>
                      {DOSAGE_OPTIONS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      placeholder="Duration (days)"
                      className="flex-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                      value={selectedDuration}
                      onChange={e => setSelectedDuration(e.target.value)}
                    />
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleAddTreatment}
                      disabled={!selectedTreatment || !selectedDosage || !selectedDuration}
                    >
                      Add
                    </Button>
                  </div>
                  {/* List of added treatments */}
                  <ul>
                    {treatments.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm mb-1">
                        <span>
                          {t.name} | Dosage: {t.dosage} | Duration: {t.duration} days
                        </span>
                        <Button size="sm" variant="outline" onClick={() => handleRemoveTreatment(idx)}>
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Admit */}
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="admit"
                    checked={admit}
                    onChange={e => setAdmit(e.target.checked)}
                    className="h-5 w-5"
                  />
                  <label htmlFor="admit" className="font-semibold">Admit Patient</label>
                </div>

                {/* Submit Button */}
                <Button
                  className={`w-full mt-4 ${canSubmit
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                >
                  Mark as complete
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPending;
