import React from 'react';

interface Test {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  requiresFasting: boolean;
  availability: 'Available' | 'Limited' | 'Unavailable';
}

const TestsTable: React.FC = () => {
  // Sample data
  const tests: Test[] = [
    { id: 'T001', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 50, duration: '1 hour', requiresFasting: false, availability: 'Available' },
    { id: 'T002', name: 'Blood Glucose Test', category: 'Biochemistry', price: 30, duration: '30 minutes', requiresFasting: true, availability: 'Available' },
    { id: 'T003', name: 'Lipid Profile', category: 'Biochemistry', price: 80, duration: '2 hours', requiresFasting: true, availability: 'Available' },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Tests Available</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Test
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fasting Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50 cursor-pointer">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestsTable;