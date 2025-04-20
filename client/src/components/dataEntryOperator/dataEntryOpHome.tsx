import { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut } from "lucide-react";
import { format } from "date-fns";

// Backend endpoint bases for robust multi-backend fetches
const PENDING_TESTS_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/tests-pending",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/tests-pending",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/tests-pending",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/tests-pending",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/tests-pending",
  "http://localhost:5000/api/tests-pending"
];

const COMPLETED_TESTS_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/tests-completed",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/tests-completed",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/tests-completed",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/tests-completed",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/tests-completed",
  "http://localhost:5000/api/tests-completed"
];

const SET_RESULT_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/tests-finish",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/tests-finish",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/tests-finish",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/tests-finish",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/tests-finish",
  "http://localhost:5000/api/tests-finish"
];

// Types
type Test = {
  test_id: number;
  test_name: string;
  Status: string;
  TimeStamp: string;
  Result?: string;
  patient?: { name: string; P_ID: number };
  doctor?: { name: string; D_ID: number };
};

const DataEntryOpHome = ({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => {
  const [pendingTests, setPendingTests] = useState<Test[]>([]);
  const [completedTests, setCompletedTests] = useState<Test[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(true);
  const [errorPending, setErrorPending] = useState<string | null>(null);
  const [errorCompleted, setErrorCompleted] = useState<string | null>(null);

  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [result, setResult] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch pending tests
  useEffect(() => {
    const fetchPending = async () => {
      setLoadingPending(true);
      setErrorPending(null);
      for (const url of PENDING_TESTS_URLS) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          if (!Array.isArray(data.tests)) continue;
          setPendingTests(data.tests);
          setLoadingPending(false);
          return;
        } catch (err) {}
      }
      setPendingTests([]);
      setLoadingPending(false);
      setErrorPending("Could not fetch pending tests from any backend.");
    };
    fetchPending();
  }, []);

  // Fetch completed tests
  useEffect(() => {
    const fetchCompleted = async () => {
      setLoadingCompleted(true);
      setErrorCompleted(null);
      for (const url of COMPLETED_TESTS_URLS) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          if (!Array.isArray(data.tests)) continue;
          setCompletedTests(data.tests);
          setLoadingCompleted(false);
          return;
        } catch (err) {}
      }
      setCompletedTests([]);
      setLoadingCompleted(false);
      setErrorCompleted("Could not fetch completed tests from any backend.");
    };
    fetchCompleted();
  }, []);

  // Save test result
  const handleSaveResult = async () => {
    if (!selectedTest || !result.trim()) {
      setMessage({ type: "error", text: "Please enter a result before saving." });
      return;
    }
    setSaving(true);
    setMessage(null);
    let success = false;
    let lastError: any = null;
    for (const url of SET_RESULT_URLS) {
      try {
        const res = await fetch(`${url}/${selectedTest.test_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result }),
        });
        if (res.ok) {
          success = true;
          break;
        } else {
          lastError = new Error(`HTTP error ${res.status} from ${url}`);
        }
      } catch (err) {
        lastError = err;
      }
    }
    if (!success) {
      setMessage({ type: "error", text: lastError?.message || "Failed to save result. Please try again." });
      setSaving(false);
      return;
    }
    // Move test from pending to completed
    setPendingTests((prev) => prev.filter((t) => t.test_id !== selectedTest.test_id));
    setCompletedTests((prev) => [
      {
        ...selectedTest,
        Status: "Completed",
        Result: result,
        TimeStamp: new Date().toISOString(),
      },
      ...prev,
    ]);
    setSelectedTest(null);
    setResult("");
    setMessage({ type: "success", text: "Test result saved successfully!" });
    setSaving(false);
  };

  return (
    <div className={`min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4 ${darkMode ? "bg-gray-900 text-blue-400" : ""}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Test Results Entry</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <div
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
            onClick={toggleDarkMode}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-7" : "translate-x-1"}`}
            />
            <div className="absolute inset-0 flex justify-between items-center px-1.5">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Moon className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <Button variant="destructive" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded ${message.type === "success"
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-800"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pending Tests List */}
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">Pending Tests</h2>
          {loadingPending ? (
            <div className="text-gray-500">Loading...</div>
          ) : errorPending ? (
            <div className="text-red-500">{errorPending}</div>
          ) : (
            <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
              {pendingTests.length === 0 ? (
                <div className="text-gray-500">No pending tests found.</div>
              ) : (
                pendingTests.map((t) => (
                  <div
                    key={t.test_id}
                    className={`p-2 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedTest?.test_id === t.test_id ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}
                    onClick={() => setSelectedTest(t)}
                  >
                    <div>{t.patient?.name} (Patient ID: {t.patient?.P_ID}) — {t.test_name}</div>
                    <div className="text-sm text-gray-500">
                      {t.TimeStamp ? format(new Date(t.TimeStamp), "PPPp") : "N/A"}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Result Entry */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Enter Result</h2>
          {selectedTest ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <div className="mb-2">
                <span className="font-semibold">Test:</span> {selectedTest.test_name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Patient:</span> {selectedTest.patient?.name} (ID: {selectedTest.patient?.P_ID})
              </div>
              <div className="mb-2">
                <span className="font-semibold">Doctor:</span> {selectedTest.doctor?.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Date:</span> {selectedTest.TimeStamp ? format(new Date(selectedTest.TimeStamp), "PPPp") : "N/A"}
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1" htmlFor="result">
                  Result
                </label>
                <textarea
                  id="result"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="Enter test result"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveResult} disabled={!result.trim() || saving}>
                  Save Result
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => setSelectedTest(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border text-center text-gray-500">
              Select a pending test to enter result
            </div>
          )}
        </div>

        {/* Completed Tests List */}
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">Completed Tests</h2>
          {loadingCompleted ? (
            <div className="text-gray-500">Loading...</div>
          ) : errorCompleted ? (
            <div className="text-red-500">{errorCompleted}</div>
          ) : (
            <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
              {completedTests.length === 0 ? (
                <div className="text-gray-500">No completed tests found.</div>
              ) : (
                completedTests.map((t) => (
                  <div key={t.test_id} className="p-2 border-b">
                    <div>{t.patient?.name} (Patient ID: {t.patient?.P_ID}) — {t.test_name}</div>
                    <div className="text-sm text-gray-500">
                      {t.TimeStamp ? format(new Date(t.TimeStamp), "PPPp") : "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-semibold">Result:</span> {t.Result || "No result"}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataEntryOpHome;
