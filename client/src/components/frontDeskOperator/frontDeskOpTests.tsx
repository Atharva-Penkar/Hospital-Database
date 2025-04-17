import { useState } from "react";
import logo from '@/assets/images/logo.png';
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut } from "lucide-react";
import { format } from "date-fns";

type Test = {
    id: number;
    name: string;
    reason: string;
    dob: string;
    sex: string;
};

type ScheduledTest = {
    id: number;
    name: string;
    scheduledAt: string;
    reason: string;  // Added reason field to the ScheduledTest type
};

const initialPendingTests: Test[] = [
    { id: 301, name: "Riya Sharma", sex: "F", dob: "1998-05-23", reason: "Blood Test" },
    { id: 302, name: "Aman Gupta", sex: "M", dob: "2000-11-12", reason: "X-Ray" },
    { id: 303, name: "Neha Mehta", sex: "F", dob: "1985-04-03", reason: "MRI" },
    { id: 304, name: "Sita Kumari", sex: "F", dob: "1995-02-21", reason: "ECG" },
    { id: 305, name: "Rajesh Kumar", sex: "M", dob: "1988-07-13", reason: "CT Scan" },
    { id: 306, name: "Ayesha Khan", sex: "F", dob: "1992-09-18", reason: "Blood Pressure Check" },
    { id: 307, name: "Vikas Sharma", sex: "M", dob: "1984-11-30", reason: "Ultrasound" },
    { id: 308, name: "Ravi Gupta", sex: "M", dob: "1999-03-02", reason: "MRI" },
    { id: 309, name: "Pooja Mehta", sex: "F", dob: "2002-01-15", reason: "X-Ray" },
    { id: 310, name: "Vijay Singh", sex: "M", dob: "1987-05-29", reason: "Blood Test" }
];

const initialScheduledTests: ScheduledTest[] = [
    { id: 401, name: "Sunil Dube", scheduledAt: "2025-04-18T09:30", reason: "Blood Test" },
    { id: 402, name: "Tina Singh", scheduledAt: "2025-04-18T11:15", reason: "X-Ray" },
    { id: 403, name: "Ajay Patel", scheduledAt: "2025-04-19T10:00", reason: "MRI" },
    { id: 404, name: "Maya Verma", scheduledAt: "2025-04-19T12:30", reason: "ECG" },
    { id: 405, name: "Krishna Yadav", scheduledAt: "2025-04-20T08:00", reason: "CT Scan" },
    { id: 406, name: "Simran Rathi", scheduledAt: "2025-04-20T14:00", reason: "Blood Pressure Check" },
    { id: 407, name: "Anjali Rai", scheduledAt: "2025-04-21T09:15", reason: "Ultrasound" },
    { id: 408, name: "Arvind Kumar", scheduledAt: "2025-04-21T13:30", reason: "MRI" },
    { id: 409, name: "Pooja Bhatt", scheduledAt: "2025-04-22T15:45", reason: "X-Ray" },
    { id: 410, name: "Manoj Sharma", scheduledAt: "2025-04-23T10:30", reason: "Blood Test" }
];

const FrontDeskOpTests = ({
    darkMode,
    toggleDarkMode
}: {
    darkMode: boolean;
    toggleDarkMode: () => void;
}) => {
    const [pendingTests, setPendingTests] = useState<Test[]>(initialPendingTests);
    const [scheduledTests, setScheduledTests] = useState<ScheduledTest[]>(initialScheduledTests);
    const [selectedPatient, setSelectedPatient] = useState<Test | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");

    const handleSchedule = () => {
        if (!selectedPatient || !selectedDate || !selectedTime) return;
        const scheduledAt = `${selectedDate}T${selectedTime}`;

        const newScheduled: ScheduledTest = {
            id: selectedPatient.id,
            name: selectedPatient.name,
            scheduledAt,
            reason: selectedPatient.reason // Added reason here
        };

        setScheduledTests((prev) => [...prev, newScheduled]);
        setPendingTests((prev) => prev.filter((p) => p.id !== selectedPatient.id));
        setSelectedPatient(null);
        setSelectedDate("");
        setSelectedTime("");
    };

    const isFormComplete = selectedPatient && selectedDate && selectedTime;

    return (
        <div className={`min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4 ${darkMode ? "bg-gray-900 text-blue-400" : ""}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Hospital Logo" className="h-12 w-12" />
                    <h1 className="text-2xl font-bold">Tests Scheduling</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Dark Mode Toggle */}
                    <div
                        className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
                        onClick={toggleDarkMode}
                    >
                        <div
                            className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-7" : "translate-x-1"
                                }`}
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

            {/* Main Content */}
            <div className="grid grid-cols-2 gap-6">
                {/* Pending Tests */}
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className="text-xl font-semibold mb-2">Pending Tests</h2>
                    <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
                        {pendingTests.map((p) => (
                            <div
                                key={p.id}
                                className="p-2 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => setSelectedPatient(p)}
                            >
                                {p.name} (ID: {p.id}) — {p.reason}
                            </div>
                        ))}
                    </div>

                    {selectedPatient && (
                        <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                            <p><strong>Name:</strong> {selectedPatient.name}</p>
                            <p><strong>ID:</strong> {selectedPatient.id}</p>
                            <p><strong>Sex:</strong> {selectedPatient.sex}</p>
                            <p><strong>DOB:</strong> {format(new Date(selectedPatient.dob), "PPP")}</p>
                            <p><strong>Test:</strong> {selectedPatient.reason}</p>

                            <div className="flex gap-4 mt-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Select Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="border rounded px-2 py-1 w-full dark:text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Select Time</label>
                                    <input
                                        type="time"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="border rounded px-2 py-1 w-full dark:text-black"
                                    />
                                </div>
                            </div>

                            <Button
                                disabled={!isFormComplete}
                                onClick={handleSchedule}
                                className={`w-full mt-4 ${isFormComplete ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                Schedule Test
                            </Button>
                        </div>
                    )}
                </div>

                {/* Scheduled Tests */}
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className="text-xl font-semibold mb-2">Scheduled Tests</h2>
                    <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
                        {scheduledTests.map((s) => (
                            <div key={s.id} className="p-2 border-b">
                                <div>{s.name} (ID: {s.id})</div>
                                <div className="text-sm text-gray-500">{format(new Date(s.scheduledAt), "PPPp")}</div>
                                <div className="text-sm text-gray-500">{s.reason}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrontDeskOpTests;
