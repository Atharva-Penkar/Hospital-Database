import React, { useState } from 'react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  contactNumber: string;
  email: string;
  status: 'Available' | 'On Leave' | 'In Surgery';
}

interface DoctorsTableProps {
  darkMode: boolean;
}

const sampleDoctors: Doctor[] = [
  { id: 'D001', name: 'Dr. Robert Smith', specialization: 'Cardiology', department: 'Cardiac Care', contactNumber: '123-456-7890', email: 'r.smith@hospital.com', status: 'Available' },
  { id: 'D002', name: 'Dr. Sarah Johnson', specialization: 'Neurology', department: 'Brain & Spine', contactNumber: '234-567-8901', email: 's.johnson@hospital.com', status: 'In Surgery' },
  { id: 'D003', name: 'Dr. Michael Davis', specialization: 'Orthopedics', department: 'Bone & Joint', contactNumber: '345-678-9012', email: 'm.davis@hospital.com', status: 'Available' },
];

const DoctorsTable: React.FC<DoctorsTableProps> = ({ darkMode }) => {
  const [searchId, setSearchId] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>(sampleDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState<Omit<Doctor, 'id'>>({
    name: '',
    specialization: '',
    department: '',
    contactNumber: '',
    email: '',
    status: 'Available',
  });

  // Search logic
  const handleSearch = () => {
    if (searchId.trim() === '') {
      setDoctors(sampleDoctors);
    } else {
      setDoctors(
        sampleDoctors.filter(d =>
          d.id.toLowerCase().includes(searchId.trim().toLowerCase())
        )
      );
    }
  };

  // Row click: open modal in view mode
  const handleRowClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setEditDoctor(doctor);
    setEditMode(false);
  };

  // Modal close
  const closeModal = () => {
    setSelectedDoctor(null);
    setEditMode(false);
    setEditDoctor(null);
  };

  // Edit mode
  const handleEdit = () => {
    setEditMode(true);
    setEditDoctor(selectedDoctor);
  };

  // Editing fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editDoctor) return;
    const { name, value } = e.target;
    setEditDoctor({
      ...editDoctor,
      [name]: value,
    });
  };

  // Detect changes for Save button
  const isChanged = () => {
    if (!selectedDoctor || !editDoctor) return false;
    return (
      selectedDoctor.name !== editDoctor.name ||
      selectedDoctor.specialization !== editDoctor.specialization ||
      selectedDoctor.department !== editDoctor.department ||
      selectedDoctor.contactNumber !== editDoctor.contactNumber ||
      selectedDoctor.email !== editDoctor.email ||
      selectedDoctor.status !== editDoctor.status
    );
  };

  // Save edits
  const handleSave = () => {
    if (!editDoctor) return;
    setDoctors(doctors.map(d => (d.id === editDoctor.id ? editDoctor : d)));
    setSelectedDoctor(editDoctor);
    setEditMode(false);
  };

  // Delete doctor
  const handleDelete = () => {
    if (!editDoctor) return;
    setDoctors(doctors.filter(d => d.id !== editDoctor.id));
    closeModal();
  };

  // Add Doctor Modal
  const openAddModal = () => {
    setShowAddModal(true);
    setNewDoctor({
      name: '',
      specialization: '',
      department: '',
      contactNumber: '',
      email: '',
      status: 'Available',
    });
  };
  const closeAddModal = () => setShowAddModal(false);

  const handleNewDoctorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate new ID
    const maxIdNum = doctors
      .map(d => parseInt(d.id.replace(/\D/g, '')))
      .reduce((max, curr) => (curr > max ? curr : max), 0);
    const newId = `D${(maxIdNum + 1).toString().padStart(3, '0')}`;
    setDoctors([
      ...doctors,
      { id: newId, ...newDoctor }
    ]);
    setShowAddModal(false);
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-blue-400" : "bg-white text-black"}>
      {/* Top Bar with Search and Add */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={darkMode?"text-2xl font-bold text-white":"text-2xl font-bold text-gray-800 dark:text-blue-300"}>Doctors</h2>
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
            onClick={() => { setSearchId(''); setDoctors(sampleDoctors); }}
            className="px-3 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Doctor
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
              </tr>
            </thead>
            <tbody className={darkMode ? "bg-gray-900" : "bg-white"}>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">No doctors found.</td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className={`hover:bg-gray-50 cursor-pointer ${darkMode ? "hover:bg-gray-700" : ""}`}
                    onClick={() => handleRowClick(doctor)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.contactNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${doctor.status === 'Available' ? 'bg-green-100 text-green-800' : 
                          doctor.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {doctor.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Doctor Details/Edit */}
      {selectedDoctor && editDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-8 max-w-md w-full shadow-lg ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}>
            <h3 className="text-xl font-bold mb-4">
              {editMode ? "Edit Doctor" : "Doctor Details"}
            </h3>
            {editMode ? (
              <form className="space-y-3" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div>
                  <label className="font-semibold">ID:</label>
                  <input
                    className="w-full border px-3 py-1 rounded bg-gray-100 cursor-not-allowed"
                    value={editDoctor.id}
                    name="id"
                    readOnly
                  />
                </div>
                <div>
                  <label className="font-semibold">Name:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editDoctor.name}
                    name="name"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Specialization:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editDoctor.specialization}
                    name="specialization"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Department:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editDoctor.department}
                    name="department"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Contact:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editDoctor.contactNumber}
                    name="contactNumber"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Email:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editDoctor.email}
                    name="email"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Status:</label>
                  <select
                    className="w-full border px-3 py-1 rounded"
                    value={editDoctor.status}
                    name="status"
                    onChange={handleInputChange}
                  >
                    <option value="Available">Available</option>
                    <option value="On Leave">On Leave</option>
                    <option value="In Surgery">In Surgery</option>
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
                  <li><strong>ID:</strong> {selectedDoctor.id}</li>
                  <li><strong>Name:</strong> {selectedDoctor.name}</li>
                  <li><strong>Specialization:</strong> {selectedDoctor.specialization}</li>
                  <li><strong>Department:</strong> {selectedDoctor.department}</li>
                  <li><strong>Contact:</strong> {selectedDoctor.contactNumber}</li>
                  <li><strong>Email:</strong> {selectedDoctor.email}</li>
                  <li><strong>Status:</strong> {selectedDoctor.status}</li>
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

      {/* Modal for Adding Doctor */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddDoctor}
            className={`rounded-lg p-8 max-w-md w-full shadow-lg ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}
          >
            <h3 className="text-xl font-bold mb-4">Add Doctor</h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold">Name:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="name"
                  value={newDoctor.name}
                  onChange={handleNewDoctorChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Specialization:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="specialization"
                  value={newDoctor.specialization}
                  onChange={handleNewDoctorChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Department:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="department"
                  value={newDoctor.department}
                  onChange={handleNewDoctorChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Contact:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="contactNumber"
                  value={newDoctor.contactNumber}
                  onChange={handleNewDoctorChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Email:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="email"
                  value={newDoctor.email}
                  onChange={handleNewDoctorChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Status:</label>
                <select
                  className="w-full border px-3 py-1 rounded"
                  name="status"
                  value={newDoctor.status}
                  onChange={handleNewDoctorChange}
                >
                  <option value="Available">Available</option>
                  <option value="On Leave">On Leave</option>
                  <option value="In Surgery">In Surgery</option>
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

export default DoctorsTable;
