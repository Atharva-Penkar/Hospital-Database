import React from 'react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  contactNumber: string;
  email: string;
  status: 'Available' | 'On Leave' | 'In Surgery';
}

const DoctorsTable: React.FC = () => {
  // Sample data
  const doctors: Doctor[] = [
    { id: 'D001', name: 'Dr. Robert Smith', specialization: 'Cardiology', department: 'Cardiac Care', contactNumber: '123-456-7890', email: 'r.smith@hospital.com', status: 'Available' },
    { id: 'D002', name: 'Dr. Sarah Johnson', specialization: 'Neurology', department: 'Brain & Spine', contactNumber: '234-567-8901', email: 's.johnson@hospital.com', status: 'In Surgery' },
    { id: 'D003', name: 'Dr. Michael Davis', specialization: 'Orthopedics', department: 'Bone & Joint', contactNumber: '345-678-9012', email: 'm.davis@hospital.com', status: 'Available' },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Doctors</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Doctor
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50 cursor-pointer">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorsTable;