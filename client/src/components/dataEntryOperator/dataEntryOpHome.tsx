import React, { useEffect, useState } from "react";
import logo from '@/assets/images/logo.png';
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
    testType: { test_name: "Ultrasound" },
    Status: "Pending",
    patient: { name: "Emily Brown", P_ID: 1001 },
    doctor: { name: "Dr. Anderson" },
    timeStamp: "2025-04-16T08:00:00",
  },
  {
    test_id: 2,
    A_ID: 102,
    testType: { test_name: "Blood Test" },
    Status: "Pending",
    patient: { name: "Chris Davis", P_ID: 1002 },
    doctor: { name: "Dr. Johnson" },
    timeStamp: "2025-04-16T08:45:00",
  },
  {
    test_id: 3,
    A_ID: 103,
    testType: { test_name: "Urine Test" },
    Status: "Pending",
    patient: { name: "Laura Hall", P_ID: 1003 },
    doctor: { name: "Dr. Williams" },
    timeStamp: "2025-04-16T09:30:00",
  },
  {
    test_id: 4,
    A_ID: 104,
    testType: { test_name: "Stool Test" },
    Status: "Pending",
    patient: { name: "Anna Clark", P_ID: 1004 },
    doctor: { name: "Dr. Davis" },
    timeStamp: "2025-04-16T10:15:00",
  },
  {
    test_id: 5,
    A_ID: 105,
    testType: { test_name: "MRI" },
    Status: "Pending",
    patient: { name: "Tom Brown", P_ID: 1005 },
    doctor: { name: "Dr. Brown" },
    timeStamp: "2025-04-16T11:00:00",
  },
  {
    test_id: 6,
    A_ID: 106,
    testType: { test_name: "Blood Test" },
    Status: "Pending",
    patient: { name: "Sophia Clark", P_ID: 1006 },
    doctor: { name: "Dr. Patel" },
    timeStamp: "2025-04-16T11:45:00",
  },
  {
    test_id: 7,
    A_ID: 107,
    testType: { test_name: "Liver Function" },
    Status: "Pending",
    patient: { name: "Tom Allen", P_ID: 1007 },
    doctor: { name: "Dr. Patel" },
    timeStamp: "2025-04-16T12:30:00",
  },
  {
    test_id: 8,
    A_ID: 108,
    testType: { test_name: "Thyroid Panel" },
    Status: "Pending",
    patient: { name: "Olivia Taylor", P_ID: 1008 },
    doctor: { name: "Dr. Patel" },
    timeStamp: "2025-04-16T13:15:00",
  },
  {
    test_id: 9,
    A_ID: 109,
    testType: { test_name: "ECG" },
    Status: "Pending",
    patient: { name: "James Moore", P_ID: 1009 },
    doctor: { name: "Dr. Taylor" },
    timeStamp: "2025-04-16T14:00:00",
  },
  {
    test_id: 10,
    A_ID: 110,
    testType: { test_name: "Urine Test" },
    Status: "Pending",
    patient: { name: "Olivia Smith", P_ID: 1010 },
    doctor: { name: "Dr. Gupta" },
    timeStamp: "2025-04-16T14:45:00",
  },
  {
    test_id: 11,
    A_ID: 111,
    testType: { test_name: "Ultrasound" },
    Status: "Pending",
    patient: { name: "Olivia Smith", P_ID: 1011 },
    doctor: { name: "Dr. Taylor" },
    timeStamp: "2025-04-16T15:30:00",
  },
  {
    test_id: 12,
    A_ID: 112,
    testType: { test_name: "Blood Test" },
    Status: "Pending",
    patient: { name: "John Doe", P_ID: 1012 },
    doctor: { name: "Dr. Patel" },
    timeStamp: "2025-04-16T16:15:00",
  }
];

const mockCompleted: Test[] = [
  {
    test_id: 21,
    A_ID: 121,
    testType: { test_name: "CT Scan" },
    Status: "Completed",
    patient: { name: "John Taylor", P_ID: 1021 },
    doctor: { name: "Dr. Patel" },
    timeStamp: "2025-04-15T08:00:00",
    result: "Result for test 21 is normal.",
  },
  {
    test_id: 22,
    A_ID: 122,
    testType: { test_name: "X-Ray" },
    Status: "Completed",
    patient: { name: "Robert Moore", P_ID: 1022 },
    doctor: { name: "Dr. Davis" },
    timeStamp: "2025-04-15T07:30:00",
    result: "Result for test 22 is normal.",
  },
  {
    test_id: 23,
    A_ID: 123,
    testType: { test_name: "CT Scan" },
    Status: "Completed",
    patient: { name: "Laura Doe", P_ID: 1023 },
    doctor: { name: "Dr. Williams" },
    timeStamp: "2025-04-15T07:00:00",
    result: "Result for test 23 is normal.",
  },
  {
    test_id: 24,
    A_ID: 124,
    testType: { test_name: "Allergy Test" },
    Status: "Completed",
    patient: { name: "Tom Wilson", P_ID: 1024 },
    doctor: { name: "Dr. Patel" },
    timeStamp: "2025-04-15T06:30:00",
    result: "Result for test 24 is normal.",
  },
  {
    test_id: 25,
    A_ID: 125,
    testType: { test_name: "Thyroid Panel" },
    Status: "Completed",
    patient: { name: "Anna Clark", P_ID: 1025 },
    doctor: { name: "Dr. Davis" },
    timeStamp: "2025-04-15T06:00:00",
    result: "Result for test 25 is normal.",
  },
  {
    test_id: 26,
    A_ID: 126,
    testType: { test_name: "Glucose" },
    Status: "Completed",
    patient: { name: "Sophia Wilson", P_ID: 1026 },
    doctor: { name: "Dr. Patel" },
    timeStamp: "2025-04-15T05:30:00",
    result: "Result for test 26 is normal.",
  },
  {
    test_id: 27,
    A_ID: 127,
    testType: { test_name: "CBC" },
    Status: "Completed",
    patient: { name: "David Taylor", P_ID: 1027 },
    doctor: { name: "Dr. Smith" },
    timeStamp: "2025-04-15T05:00:00",
    result: "Result for test 27 is normal.",
  },
  {
    test_id: 28,
    A_ID: 128,
    testType: { test_name: "Lipid Profile" },
    Status: "Completed",
    patient: { name: "Jane Davis", P_ID: 1028 },
    doctor: { name: "Dr. Smith" },
    timeStamp: "2025-04-15T04:30:00",
    result: "Result for test 28 is normal.",
  },
  {
    test_id: 29,
    A_ID: 129,
    testType: { test_name: "Kidney Function" },
    Status: "Completed",
    patient: { name: "Anna Hall", P_ID: 1029 },
    doctor: { name: "Dr. Smith" },
    timeStamp: "2025-04-15T04:00:00",
    result: "Result for test 29 is normal.",
  },
  {
    test_id: 30,
    A_ID: 130,
    testType: { test_name: "Ultrasound" },
    Status: "Completed",
    patient: { name: "David Taylor", P_ID: 1030 },
    doctor: { name: "Dr. Gupta" },
    timeStamp: "2025-04-15T03:30:00",
    result: "Result for test 30 is normal.",
  }
];

const DataEntryOpHome: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [pendingTests, setPendingTests] = useState<Test[]>([]);
  const [completedTests, setCompletedTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [result, setResult] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setPendingTests(mockPending);
    setCompletedTests(mockCompleted);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSelectTest = (test: Test) => {
    setSelectedTest(test);
    setResult("");
    setMessage(null);
  };

  const handleSaveResult = () => {
    if (!selectedTest || !result.trim()) {
      setMessage({ type: "error", text: "Please enter a result before saving." });
      return;
    }
    const updatedTest: Test = { ...selectedTest, Status: "Completed", result };
    setPendingTests((prev) => prev.filter((t) => t.test_id !== selectedTest.test_id));
    setCompletedTests((prev) => [...prev, updatedTest]);
    setSelectedTest(null);
    setResult("");
    setMessage({ type: "success", text: "Test result saved successfully!" });
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-blue-400" : "bg-gray-100 text-black"}`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Hospital Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Test Results Entry</h1>
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
          <Button variant="destructive" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
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
                  className={`p-3 border-b cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 ${selectedTest?.test_id === test.test_id
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : ""
                    }`}
                >
                  <div className="font-medium">{test.testType.test_name}</div>
                  <div className="text-sm">
                    {test.patient.name} (ID: {test.patient.P_ID})
                    <br />
                    Doctor: {test.doctor.name}
                    <br />
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
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveResult} disabled={!result.trim()}>
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
                    {test.patient.name} (ID: {test.patient.P_ID})
                    <br />
                    Doctor: {test.doctor.name}
                    <br />
                    Date: {new Date(test.timeStamp).toLocaleDateString()}
                    <br />
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

export default DataEntryOpHome;
