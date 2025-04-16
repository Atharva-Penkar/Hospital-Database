import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

type TestStatus = "PENDING" | "SCHEDULED";

type Test = {
  test_id: number;
  A_ID: number;
  T_ID: number;
  TimeStamp: string;
  Status: TestStatus;
  patientName: string;
  testName: string;
};

const initialTests: Test[] = [
  { test_id: 1, A_ID: 101, T_ID: 1, TimeStamp: "", Status: "PENDING", patientName: "Riya Sharma", testName: "Blood Test" },
  { test_id: 2, A_ID: 102, T_ID: 2, TimeStamp: "", Status: "PENDING", patientName: "Aman Gupta", testName: "X-Ray" },
  { test_id: 3, A_ID: 103, T_ID: 3, TimeStamp: "", Status: "SCHEDULED", patientName: "Neha Mehta", testName: "MRI" },
  { test_id: 4, A_ID: 104, T_ID: 4, TimeStamp: "", Status: "PENDING", patientName: "Rakesh Kumar", testName: "CT Scan" },
  { test_id: 5, A_ID: 105, T_ID: 5, TimeStamp: "2025-04-18T11:30", Status: "SCHEDULED", patientName: "Priya Desai", testName: "ECG" },
];

const FrontDeskOpTests = ({ darkMode }: { darkMode: boolean }) => {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const handleSchedule = () => {
    if (!selectedTest) return;

    const now = new Date().toISOString();
    const updatedTest: Test = {
      ...selectedTest,
      Status: "SCHEDULED",
      TimeStamp: now,
    };

    setTests((prev) =>
      prev.map((t) => (t.test_id === updatedTest.test_id ? updatedTest : t))
    );
    setSelectedTest(null);
  };

  const pendingTests = tests.filter((t) => t.Status === "PENDING");
  const scheduledTests = tests.filter((t) => t.Status === "SCHEDULED");

  return (
    <div className={`min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4 ${darkMode ? "bg-gray-900 text-blue-400" : ""}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/hospital-logo.png" alt="Hospital Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Tests</h1>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pending Tests */}
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">Pending Tests</h2>
          <div className="max-h-72 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {pendingTests.map((t) => (
              <div
                key={t.test_id}
                className="p-2 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setSelectedTest(t)}
              >
                {t.testName} for {t.patientName} (AID: {t.A_ID})
              </div>
            ))}
          </div>
          {selectedTest && (
            <div className="mt-4 border-t pt-4 space-y-2 text-sm">
              <p><strong>Test:</strong> {selectedTest.testName}</p>
              <p><strong>Patient:</strong> {selectedTest.patientName}</p>
              <p><strong>Appointment ID:</strong> {selectedTest.A_ID}</p>
              <Button className="mt-2" onClick={handleSchedule}>
                Schedule Test
              </Button>
            </div>
          )}
        </div>

        {/* Scheduled Tests */}
        <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-2">Scheduled Tests</h2>
          <div className="max-h-72 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {scheduledTests.map((t) => (
              <div key={t.test_id} className="p-2 border-b">
                <p><strong>{t.testName}</strong> for {t.patientName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Scheduled on: {format(new Date(t.TimeStamp), "PPPp")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskOpTests;
