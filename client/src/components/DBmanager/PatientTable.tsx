import React, { useState } from 'react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contactNumber: string;
  status: 'Active' | 'Discharged' | 'Critical';
}

// Accept darkMode as a prop!
interface PatientsTableProps {
  darkMode: boolean;
}

const samplePatients: Patient[] = [
    { id: 'P001', name: 'John Doe', age: 45, gender: 'Male', bloodGroup: 'O+', contactNumber: '123-456-7890', status: 'Active' },
    { id: 'P002', name: 'Jane Smith', age: 28, gender: 'Female', bloodGroup: 'A+', contactNumber: '234-567-8901', status: 'Active' },
    { id: 'P003', name: 'Robert Johnson', age: 62, gender: 'Male', bloodGroup: 'B-', contactNumber: '345-678-9012', status: 'Critical' },
    { id: 'P004', name: 'Emily Davis', age: 35, gender: 'Female', bloodGroup: 'AB+', contactNumber: '456-789-0123', status: 'Discharged' },
    { id: 'P005', name: 'John Doe', age: 45, gender: 'Male', bloodGroup: 'O+', contactNumber: '123-456-7890', status: 'Active' },
    { id: 'P006', name: 'Jane Smith', age: 28, gender: 'Female', bloodGroup: 'A+', contactNumber: '234-567-8901', status: 'Active' },
    { id: 'P007', name: 'Robert Johnson', age: 62, gender: 'Male', bloodGroup: 'B-', contactNumber: '345-678-9012', status: 'Critical' },
    { id: 'P008', name: 'Emily Davis', age: 35, gender: 'Female', bloodGroup: 'AB+', contactNumber: '456-789-0123', status: 'Discharged' },
    { id: 'P009', name: 'John Doe', age: 45, gender: 'Male', bloodGroup: 'O+', contactNumber: '123-456-7890', status: 'Active' },
    { id: 'P010', name: 'Jane Smith', age: 28, gender: 'Female', bloodGroup: 'A+', contactNumber: '234-567-8901', status: 'Active' },
    { id: 'P011', name: 'Robert Johnson', age: 62, gender: 'Male', bloodGroup: 'B-', contactNumber: '345-678-9012', status: 'Critical' },
    { id: 'P012', name: 'Emily Davis', age: 35, gender: 'Female', bloodGroup: 'AB+', contactNumber: '456-789-0123', status: 'Discharged' },
    { id: 'P013', name: 'John Doe', age: 45, gender: 'Male', bloodGroup: 'O+', contactNumber: '123-456-7890', status: 'Active' },
    { id: 'P015', name: 'Jane Smith', age: 28, gender: 'Female', bloodGroup: 'A+', contactNumber: '234-567-8901', status: 'Active' },
    { id: 'P016', name: 'Robert Johnson', age: 62, gender: 'Male', bloodGroup: 'B-', contactNumber: '345-678-9012', status: 'Critical' },
    { id: 'P017', name: 'Emily Davis', age: 35, gender: 'Female', bloodGroup: 'AB+', contactNumber: '456-789-0123', status: 'Discharged' },
  ];
  

const PatientsTable: React.FC<PatientsTableProps> = ({ darkMode }) => {
  const [searchId, setSearchId] = useState('');
  const [patients, setPatients] = useState<Patient[]>(samplePatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    name: '',
    age: 0,
    gender: 'Male',
    bloodGroup: '',
    contactNumber: '',
    status: 'Active',
  });

  // Search logic
  const handleSearch = () => {
    if (searchId.trim() === '') {
      setPatients(samplePatients);
    } else {
      setPatients(
        samplePatients.filter(p =>
          p.id.toLowerCase().includes(searchId.trim().toLowerCase())
        )
      );
    }
  };

  // Table row click: open modal in view mode
  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditPatient(patient);
    setEditMode(false);
  };

  // Modal close
  const closeModal = () => {
    setSelectedPatient(null);
    setEditMode(false);
    setEditPatient(null);
  };

  // Edit mode
  const handleEdit = () => {
    setEditMode(true);
    setEditPatient(selectedPatient);
  };

  // Editing fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editPatient) return;
    const { name, value } = e.target;
    setEditPatient({
      ...editPatient,
      [name]: name === 'age' ? Number(value) : value,
    });
  };

  // Detect changes for Save button
  const isChanged = () => {
    if (!selectedPatient || !editPatient) return false;
    return (
      selectedPatient.name !== editPatient.name ||
      selectedPatient.age !== editPatient.age ||
      selectedPatient.gender !== editPatient.gender ||
      selectedPatient.bloodGroup !== editPatient.bloodGroup ||
      selectedPatient.contactNumber !== editPatient.contactNumber ||
      selectedPatient.status !== editPatient.status
    );
  };

  // Save edits
  const handleSave = () => {
    if (!editPatient) return;
    setPatients(patients.map(p => (p.id === editPatient.id ? editPatient : p)));
    setSelectedPatient(editPatient);
    setEditMode(false);
  };

  // Delete patient
  const handleDelete = () => {
    if (!editPatient) return;
    setPatients(patients.filter(p => p.id !== editPatient.id));
    closeModal();
  };

  // Add Patient Modal
  const openAddModal = () => {
    setShowAddModal(true);
    setNewPatient({
      name: '',
      age: 0,
      gender: 'Male',
      bloodGroup: '',
      contactNumber: '',
      status: 'Active',
    });
  };
  const closeAddModal = () => setShowAddModal(false);

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }));
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate new ID
    const maxIdNum = patients
      .map(p => parseInt(p.id.replace(/\D/g, '')))
      .reduce((max, curr) => (curr > max ? curr : max), 0);
    const newId = `P${(maxIdNum + 1).toString().padStart(3, '0')}`;
    setPatients([
      ...patients,
      { id: newId, ...newPatient }
    ]);
    setShowAddModal(false);
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-blue-400" : "bg-white text-black"}>
      {/* Top Bar with Search and Add */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={darkMode?"text-2xl font-bold text-white":"text-2xl font-bold text-gray-800 dark:text-blue-300"}>Patients</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            className="border px-3 py-2 rounded-lg focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          <button
            onClick={() => { setSearchId(''); setPatients(samplePatients); }}
            className="px-3 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Patient
          </button>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className={`shadow-md rounded-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className={`w-full min-w-full divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
            <thead className={darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Blood Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
              </tr>
            </thead>
            <tbody className={darkMode ? "bg-gray-900" : "bg-white"}>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">No patients found.</td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className={`hover:bg-gray-50 cursor-pointer ${darkMode ? "hover:bg-gray-700" : ""}`}
                    onClick={() => handleRowClick(patient)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.bloodGroup}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.contactNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          patient.status === 'Discharged' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Patient Details/Edit */}
      {selectedPatient && editPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-8 max-w-md w-full shadow-lg ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}>
            <h3 className="text-xl font-bold mb-4">
              {editMode ? "Edit Patient" : "Patient Details"}
            </h3>
            {editMode ? (
              <form className="space-y-3" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div>
                  <label className="font-semibold">ID:</label>
                  <input
                    className="w-full border px-3 py-1 rounded bg-gray-100 cursor-not-allowed"
                    value={editPatient.id}
                    name="id"
                    readOnly
                  />
                </div>
                <div>
                  <label className="font-semibold">Name:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editPatient.name}
                    name="name"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Age:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    type="number"
                    value={editPatient.age}
                    name="age"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Gender:</label>
                  <select
                    className="w-full border px-3 py-1 rounded"
                    value={editPatient.gender}
                    name="gender"
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold">Blood Group:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editPatient.bloodGroup}
                    name="bloodGroup"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Contact:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editPatient.contactNumber}
                    name="contactNumber"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Status:</label>
                  <select
                    className="w-full border px-3 py-1 rounded"
                    value={editPatient.status}
                    name="status"
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Discharged">Discharged</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="submit"
                    disabled={!isChanged()}
                    className={`px-4 py-2 rounded-lg text-white font-bold ${isChanged() ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </form>
            ) : (
              <>
                <ul className="mb-6">
                  <li><strong>ID:</strong> {selectedPatient.id}</li>
                  <li><strong>Name:</strong> {selectedPatient.name}</li>
                  <li><strong>Age:</strong> {selectedPatient.age}</li>
                  <li><strong>Gender:</strong> {selectedPatient.gender}</li>
                  <li><strong>Blood Group:</strong> {selectedPatient.bloodGroup}</li>
                  <li><strong>Contact:</strong> {selectedPatient.contactNumber}</li>
                  <li><strong>Status:</strong> {selectedPatient.status}</li>
                </ul>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal for Adding Patient */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddPatient}
            className={`rounded-lg p-8 max-w-md w-full shadow-lg ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}
          >
            <h3 className="text-xl font-bold mb-4">Add Patient</h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold">Name:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="name"
                  value={newPatient.name}
                  onChange={handleNewPatientChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Age:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  type="number"
                  name="age"
                  value={newPatient.age}
                  onChange={handleNewPatientChange}
                  required
                  min={0}
                />
              </div>
              <div>
                <label className="font-semibold">Gender:</label>
                <select
                  className="w-full border px-3 py-1 rounded"
                  name="gender"
                  value={newPatient.gender}
                  onChange={handleNewPatientChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold">Blood Group:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="bloodGroup"
                  value={newPatient.bloodGroup}
                  onChange={handleNewPatientChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Contact:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="contactNumber"
                  value={newPatient.contactNumber}
                  onChange={handleNewPatientChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Status:</label>
                <select
                  className="w-full border px-3 py-1 rounded"
                  name="status"
                  value={newPatient.status}
                  onChange={handleNewPatientChange}
                >
                  <option value="Active">Active</option>
                  <option value="Discharged">Discharged</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={closeAddModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PatientsTable;
