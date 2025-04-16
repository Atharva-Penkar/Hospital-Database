import React from 'react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contactNumber: string;
  status: 'Active' | 'Discharged' | 'Critical';
}

const PatientsTable: React.FC = () => {
  // Sample data
  const patients: Patient[] = [
    { id: 'P001', name: 'John Doe', age: 45, gender: 'Male', bloodGroup: 'O+', contactNumber: '123-456-7890', status: 'Active' },
    { id: 'P002', name: 'Jane Smith', age: 28, gender: 'Female', bloodGroup: 'A+', contactNumber: '234-567-8901', status: 'Active' },
    { id: 'P003', name: 'Robert Johnson', age: 62, gender: 'Male', bloodGroup: 'B-', contactNumber: '345-678-9012', status: 'Critical' },
    { id: 'P004', name: 'Emily Davis', age: 35, gender: 'Female', bloodGroup: 'AB+', contactNumber: '456-789-0123', status: 'Discharged' },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Patients</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Patient
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 cursor-pointer">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientsTable;