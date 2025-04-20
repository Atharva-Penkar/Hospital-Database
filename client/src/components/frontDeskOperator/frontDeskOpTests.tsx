import { useState, useEffect } from "react";
import logo from '@/assets/images/logo.png';
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut } from "lucide-react";
import { format } from "date-fns";

type RequestedTest = {
    id: number;
    name: string;
    reason: string;
    dob: string;
    sex: string;
};

type PendingTest = {
    id: number;
    name: string;
    scheduledAt: string;
    reason: string;
};

const REQUESTED_TESTS_URLS = [
    "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/front-desk-operator/tests/requested",
    "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/front-desk-operator/tests/requested",
    "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/front-desk-operator/tests/requested",
    "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/front-desk-operator/tests/requested",
    "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/front-desk-operator/tests/requested",
    "http://localhost:5000/api/front-desk-operator/tests/requested"
];

const PENDING_TESTS_URLS = [
    "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev/api/front-desk-operator/tests/pending",
    "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev/api/front-desk-operator/tests/pending",
    "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev/api/front-desk-operator/tests/pending",
    "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev/api/front-desk-operator/tests/pending",
    "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev/api/front-desk-operator/tests/pending",
    "http://localhost:5000/api/front-desk-operator/tests/pending"
];

const FrontDeskOpTests = ({
    darkMode,
    toggleDarkMode
}: {
    darkMode: boolean;
    toggleDarkMode: () => void;
}) => {
    const [pendingTests, setPendingTests] = useState<PendingTest[]>([]);
    const [requestedTests, setRequestedTests] = useState<RequestedTest[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<RequestedTest | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");

    const [loadingRequested, setLoadingRequested] = useState<boolean>(true);
    const [loadingPending, setLoadingPending] = useState<boolean>(true);
    const [errorRequested, setErrorRequested] = useState<string | null>(null);
    const [errorPending, setErrorPending] = useState<string | null>(null);

    // Fetch requested tests
    useEffect(() => {
        const fetchRequested = async () => {
            setLoadingRequested(true);
            setErrorRequested(null);
            for (const url of REQUESTED_TESTS_URLS) {
                try {
                    const res = await fetch(url);
                    if (!res.ok) {
                        // Log the HTTP error
                        console.error(`[RequestedTests] ${url} returned status ${res.status}`);
                        continue;
                    }
                    const data = await res.json();
                    if (!Array.isArray(data.tests)) {
                        throw new Error(`[RequestedTests] ${url} did not return an array of tests`);
                    }
                    const tests: RequestedTest[] = data.tests.map((t: any) => ({
                        id: t.appointment?.P_ID || t.patient?.P_ID || t.P_ID || t.id,
                        name: t.patient?.name || t.name,
                        reason: t.test?.test_name || t.reason || t.test_name,
                        dob: t.patient?.DOB || t.dob,
                        sex: t.patient?.Sex || t.sex,
                    }));
                    setRequestedTests(tests);
                    setLoadingRequested(false);
                    return;
                } catch (err: any) {
                    console.error(`[RequestedTests] Error fetching from ${url}:`, err);
                }
            }
            setRequestedTests([]);
            setLoadingRequested(false);
            setErrorRequested("Could not fetch requested tests from any backend.");
        };
        fetchRequested();
    }, []);

    // Fetch pending tests
    useEffect(() => {
        const fetchPending = async () => {
            setLoadingPending(true);
            setErrorPending(null);
            for (const url of PENDING_TESTS_URLS) {
                try {
                    const res = await fetch(url);
                    if (!res.ok) {
                        console.error(`[PendingTests] ${url} returned status ${res.status}`);
                        continue;
                    }
                    const data = await res.json();
                    if (!Array.isArray(data.tests)) {
                        throw new Error(`[PendingTests] ${url} did not return an array of tests`);
                    }
                    const tests: PendingTest[] = data.tests.map((t: any) => ({
                        id: t.appointment?.P_ID || t.patient?.P_ID || t.P_ID || t.id,
                        name: t.patient?.name || t.name,
                        scheduledAt: t.TimeStamp || t.scheduledAt,
                        reason: t.test?.test_name || t.reason || t.test_name,
                    }));
                    setPendingTests(tests);
                    setLoadingPending(false);
                    return;
                } catch (err: any) {
                    console.error(`[PendingTests] Error fetching from ${url}:`, err);
                }
            }
            setPendingTests([]);
            setLoadingPending(false);
            setErrorPending("Could not fetch pending tests from any backend.");
        };
        fetchPending();
    }, []);

    const handleSchedule = () => {
        // Scheduling logic will be added later
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
                {/* Requested Tests */}
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className="text-xl font-semibold mb-2">Requested Tests</h2>
                    {loadingRequested ? (
                        <div className="text-gray-500">Loading...</div>
                    ) : errorRequested ? (
                        <div className="text-red-500">{errorRequested}</div>
                    ) : (
                        <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
                            {requestedTests.length === 0 ? (
                                <div className="text-gray-500">No requested tests found.</div>
                            ) : (
                                requestedTests.map((p) => (
                                    <div
                                        key={p.id}
                                        className="p-2 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => setSelectedPatient(p)}
                                    >
                                        {p.name} (ID: {p.id}) — {p.reason}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {selectedPatient && (
                        <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                            <p><strong>Name:</strong> {selectedPatient.name}</p>
                            <p><strong>ID:</strong> {selectedPatient.id}</p>
                            <p><strong>Sex:</strong> {selectedPatient.sex}</p>
                            <p><strong>DOB:</strong> {selectedPatient.dob ? format(new Date(selectedPatient.dob), "PPP") : "N/A"}</p>
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
                {/* Pending Tests */}
                <div className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className="text-xl font-semibold mb-2">Pending Tests</h2>
                    {loadingPending ? (
                        <div className="text-gray-500">Loading...</div>
                    ) : errorPending ? (
                        <div className="text-red-500">{errorPending}</div>
                    ) : (
                        <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
                            {pendingTests.length === 0 ? (
                                <div className="text-gray-500">No pending tests found.</div>
                            ) : (
                                pendingTests.map((s) => (
                                    <div key={s.id} className="p-2 border-b">
                                        <div>{s.name} (ID: {s.id})</div>
                                        <div className="text-sm text-gray-500">{s.scheduledAt ? format(new Date(s.scheduledAt), "PPPp") : "N/A"}</div>
                                        <div className="text-sm text-gray-500">{s.reason}</div>
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

export default FrontDeskOpTests;
