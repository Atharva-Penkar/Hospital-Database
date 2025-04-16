import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Sun, Moon } from "lucide-react";

interface Test {
  test_id: number;
  A_ID: number;
  testType: { test_name: string };
  Status: string;
  patient: { name: string; P_ID: number };
  doctor: { name: string };
  timeStamp: string;
  result?: string;
}

const mockPending: Test[] = [
  {
    test_id: 1,
    A_ID: 101,
    testType: { test_name: "Blood Test" },
    Status: "Pending",
    patient: { name: "John Doe", P_ID: 1001 },
    doctor: { name: "Dr. Smith" },
    timeStamp: "2025-04-16T10:30:00",
  },
  {
    test_id: 2,
    A_ID: 102,
    testType: { test_name: "X-Ray" },
    Status: "Pending",
    patient: { name: "Jane Smith", P_ID: 1002 },
    doctor: { name: "Dr. Johnson" },
    timeStamp: "2025-04-16T11:45:00",
  },
];

const mockCompleted: Test[] = [
  {
    test_id: 3,
    A_ID: 103,
    testType: { test_name: "MRI" },
    Status: "Completed",
    patient: { name: "Robert Brown", P_ID: 1003 },
    doctor: { name: "Dr. Williams" },
    timeStamp: "2025-04-15T09:00:00",
    result: "Normal MRI scan.",
  },
];

const DataEntryOperatorTests = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
  const [pendingTests, setPendingTests] = useState<Test[]>([]);
  const [completedTests, setCompletedTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Completed");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setPendingTests(mockPending);
    setCompletedTests(mockCompleted);
  }, []);

  const handleSelectTest = (test: Test) => {
    setSelectedTest(test);
    setResult("");
    setStatus("Completed");
    setMessage(null);
  };

  const handleSaveResult = () => {
    if (!selectedTest || !result.trim()) {
      setMessage({ type: "error", text: "Please enter a result before saving." });
      return;
    }
    const updatedTest: Test = { ...selectedTest, Status: status, result };
    setPendingTests((prev) => prev.filter((t) => t.test_id !== selectedTest.test_id));
    if (status === "Completed") {
      setCompletedTests((prev) => [...prev, updatedTest]);
    }
    setSelectedTest(null);
    setResult("");
    setStatus("Completed");
    setMessage({ type: "success", text: "Test result saved successfully!" });
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"}`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src="/hospital-logo.png" alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Tests Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition" onClick={toggleDarkMode}>
            <div className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-7" : "translate-x-1"}`} />
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
          className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Tests List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Pending Tests</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto pr-2 border">
            {pendingTests.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No pending tests</div>
            ) : (
              pendingTests.map((test) => (
                <div
                  key={test.test_id}
                  onClick={() => handleSelectTest(test)}
                  className={`p-3 border-b cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                    selectedTest?.test_id === test.test_id ? "bg-blue-100 dark:bg-blue-900/30" : ""
                  }`}
                >
                  <div className="font-medium">{test.testType.test_name}</div>
                  <div className="text-sm">
                    {test.patient.name} (ID: {test.patient.P_ID})<br />
                    Doctor: {test.doctor.name}<br />
                    Date: {new Date(test.timeStamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Result Entry */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Enter Result</h2>
          {selectedTest ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <div className="mb-2">
                <span className="font-semibold">Test:</span> {selectedTest.testType.test_name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Patient:</span> {selectedTest.patient.name} (ID: {selectedTest.patient.P_ID})
              </div>
              <div className="mb-2">
                <span className="font-semibold">Doctor:</span> {selectedTest.doctor.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Date:</span> {new Date(selectedTest.timeStamp).toLocaleDateString()}
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1" htmlFor="result">Result</label>
                <textarea
                  id="result"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="Enter test result"
                  rows={4}
                />
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSaveResult} disabled={!result.trim()}>
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
        <div>
          <h2 className="text-xl font-semibold mb-2">Completed Tests</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto pr-2 border">
            {completedTests.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No completed tests</div>
            ) : (
              completedTests.map((test) => (
                <div key={test.test_id} className="p-3 border-b">
                  <div className="font-medium">{test.testType.test_name}</div>
                  <div className="text-sm">
                    {test.patient.name} (ID: {test.patient.P_ID})<br />
                    Doctor: {test.doctor.name}<br />
                    Date: {new Date(test.timeStamp).toLocaleDateString()}<br />
                    <span className="font-semibold">Result:</span> {test.result || "No result"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEntryOperatorTests;
