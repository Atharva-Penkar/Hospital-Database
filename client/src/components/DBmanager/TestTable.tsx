import React, { useState } from 'react';

interface Test {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  requiresFasting: boolean;
  availability: 'Available' | 'Limited' | 'Unavailable';
}

interface TestsTableProps {
  darkMode: boolean;
}

const sampleTests: Test[] = [
  { id: 'T001', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 50, duration: '1 hour', requiresFasting: false, availability: 'Available' },
  { id: 'T002', name: 'Blood Glucose Test', category: 'Biochemistry', price: 30, duration: '30 minutes', requiresFasting: true, availability: 'Available' },
  { id: 'T003', name: 'Lipid Profile', category: 'Biochemistry', price: 80, duration: '2 hours', requiresFasting: true, availability: 'Available' },
];

const TestsTable: React.FC<TestsTableProps> = ({ darkMode }) => {
  const [searchId, setSearchId] = useState('');
  const [tests, setTests] = useState<Test[]>(sampleTests);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [editTest, setEditTest] = useState<Test | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTest, setNewTest] = useState<Omit<Test, 'id'>>({
    name: '',
    category: '',
    price: 0,
    duration: '',
    requiresFasting: false,
    availability: 'Available',
  });

  // Search logic
  const handleSearch = () => {
    if (searchId.trim() === '') {
      setTests(sampleTests);
    } else {
      setTests(
        sampleTests.filter(t =>
          t.id.toLowerCase().includes(searchId.trim().toLowerCase())
        )
      );
    }
  };

  // Row click: open modal in view mode
  const handleRowClick = (test: Test) => {
    setSelectedTest(test);
    setEditTest(test);
    setEditMode(false);
  };

  // Modal close
  const closeModal = () => {
    setSelectedTest(null);
    setEditMode(false);
    setEditTest(null);
  };

  // Edit mode
  const handleEdit = () => {
    setEditMode(true);
    setEditTest(selectedTest);
  };

  // Editing fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editTest) return;
    const { name, value, type, checked } = e.target;
    setEditTest({
      ...editTest,
      [name]: type === 'checkbox' ? checked : name === 'price' ? Number(value) : value,
    });
  };

  // Detect changes for Save button
  const isChanged = () => {
    if (!selectedTest || !editTest) return false;
    return (
      selectedTest.name !== editTest.name ||
      selectedTest.category !== editTest.category ||
      selectedTest.price !== editTest.price ||
      selectedTest.duration !== editTest.duration ||
      selectedTest.requiresFasting !== editTest.requiresFasting ||
      selectedTest.availability !== editTest.availability
    );
  };

  // Save edits
  const handleSave = () => {
    if (!editTest) return;
    setTests(tests.map(t => (t.id === editTest.id ? editTest : t)));
    setSelectedTest(editTest);
    setEditMode(false);
  };

  // Delete test
  const handleDelete = () => {
    if (!editTest) return;
    setTests(tests.filter(t => t.id !== editTest.id));
    closeModal();
  };

  // Add Test Modal
  const openAddModal = () => {
    setShowAddModal(true);
    setNewTest({
      name: '',
      category: '',
      price: 0,
      duration: '',
      requiresFasting: false,
      availability: 'Available',
    });
  };
  const closeAddModal = () => setShowAddModal(false);

  const handleNewTestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setNewTest(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'price' ? Number(value) : value,
    }));
  };

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate new ID
    const maxIdNum = tests
      .map(t => parseInt(t.id.replace(/\D/g, '')))
      .reduce((max, curr) => (curr > max ? curr : max), 0);
    const newId = `T${(maxIdNum + 1).toString().padStart(3, '0')}`;
    setTests([
      ...tests,
      { id: newId, ...newTest }
    ]);
    setShowAddModal(false);
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-blue-400" : "bg-white text-black"}>
      {/* Top Bar with Search and Add */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800 dark:text-blue-300"}>
          Tests Available
        </h2>
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
            onClick={() => { setSearchId(''); setTests(sampleTests); }}
            className="px-3 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Test
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Test Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fasting Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Availability</th>
              </tr>
            </thead>
            <tbody className={darkMode ? "bg-gray-900" : "bg-white"}>
              {tests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">No tests found.</td>
                </tr>
              ) : (
                tests.map((test) => (
                  <tr
                    key={test.id}
                    className={`hover:bg-gray-50 cursor-pointer ${darkMode ? "hover:bg-gray-700" : ""}`}
                    onClick={() => handleRowClick(test)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{test.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{test.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{test.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${test.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{test.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{test.requiresFasting ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${test.availability === 'Available' ? 'bg-green-100 text-green-800' :
                          test.availability === 'Limited' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {test.availability}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Test Details/Edit */}
      {selectedTest && editTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-8 max-w-md w-full shadow-lg ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}>
            <h3 className="text-xl font-bold mb-4">
              {editMode ? "Edit Test" : "Test Details"}
            </h3>
            {editMode ? (
              <form className="space-y-3" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div>
                  <label className="font-semibold">ID:</label>
                  <input
                    className="w-full border px-3 py-1 rounded bg-gray-100 cursor-not-allowed"
                    value={editTest.id}
                    name="id"
                    readOnly
                  />
                </div>
                <div>
                  <label className="font-semibold">Name:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editTest.name}
                    name="name"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Category:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editTest.category}
                    name="category"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Price:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    type="number"
                    value={editTest.price}
                    name="price"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Duration:</label>
                  <input
                    className="w-full border px-3 py-1 rounded"
                    value={editTest.duration}
                    name="duration"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="font-semibold">Fasting Required:</label>
                  <input
                    type="checkbox"
                    checked={!!editTest.requiresFasting}
                    name="requiresFasting"
                    onChange={handleInputChange}
                    className="ml-2"
                  />
                </div>
                <div>
                  <label className="font-semibold">Availability:</label>
                  <select
                    className="w-full border px-3 py-1 rounded"
                    value={editTest.availability}
                    name="availability"
                    onChange={handleInputChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                    <option value="Unavailable">Unavailable</option>
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
                  <li><strong>ID:</strong> {selectedTest.id}</li>
                  <li><strong>Name:</strong> {selectedTest.name}</li>
                  <li><strong>Category:</strong> {selectedTest.category}</li>
                  <li><strong>Price:</strong> ${selectedTest.price}</li>
                  <li><strong>Duration:</strong> {selectedTest.duration}</li>
                  <li><strong>Fasting Required:</strong> {selectedTest.requiresFasting ? 'Yes' : 'No'}</li>
                  <li><strong>Availability:</strong> {selectedTest.availability}</li>
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

      {/* Modal for Adding Test */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddTest}
            className={`rounded-lg p-8 max-w-md w-full shadow-lg ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}
          >
            <h3 className="text-xl font-bold mb-4">Add Test</h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold">Name:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="name"
                  value={newTest.name}
                  onChange={handleNewTestChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Category:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="category"
                  value={newTest.category}
                  onChange={handleNewTestChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Price:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  type="number"
                  name="price"
                  value={newTest.price}
                  onChange={handleNewTestChange}
                  required
                  min={0}
                />
              </div>
              <div>
                <label className="font-semibold">Duration:</label>
                <input
                  className="w-full border px-3 py-1 rounded"
                  name="duration"
                  value={newTest.duration}
                  onChange={handleNewTestChange}
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Fasting Required:</label>
                <input
                  type="checkbox"
                  name="requiresFasting"
                  checked={!!newTest.requiresFasting}
                  onChange={handleNewTestChange}
                  className="ml-2"
                />
              </div>
              <div>
                <label className="font-semibold">Availability:</label>
                <select
                  className="w-full border px-3 py-1 rounded"
                  name="availability"
                  value={newTest.availability}
                  onChange={handleNewTestChange}
                >
                  <option value="Available">Available</option>
                  <option value="Limited">Limited</option>
                  <option value="Unavailable">Unavailable</option>
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

export default TestsTable;
