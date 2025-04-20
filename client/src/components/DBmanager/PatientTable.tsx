// import React, { useState, useEffect } from 'react';

// // Import shadcn components
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { CalendarIcon } from "@radix-ui/react-icons";

// // API response interface - matches your Prisma model
// interface ApiPatient {
//   P_ID: number;
//   name: string;
//   address: string | null;
//   DOB: string; // Date comes as string from API
//   Sex: 'M' | 'F' | 'O';
//   mail: string | null;
//   phone_no: string;
//   emergency_phone_no: string;
// }

// // Component data interface
// interface Patient {
//   id: number;           // Maps to P_ID in Prisma
//   name: string;
//   address: string | null | undefined;
//   dob: Date;            // Converted to Date object
//   sex: 'M' | 'F' | 'O';
//   mail: string | null | undefined;
//   phoneNo: string;
//   emergencyPhoneNo: string;
// }

// interface PatientsTableProps {
//   darkMode: boolean;
// }

// const PatientsTable: React.FC<PatientsTableProps> = ({ darkMode }) => {
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const [editPatient, setEditPatient] = useState<Patient | null>(null);
//   const [editMode, setEditMode] = useState<boolean>(false);
//   const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
//   const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const [newPatient, setNewPatient] = useState<Omit<Patient, 'id' | 'dob'> & {dob: Date}>({
//     name: '',
//     address: '',
//     dob: new Date(),
//     sex: 'M',
//     mail: '',
//     phoneNo: '',
//     emergencyPhoneNo: ''
//   });

//   // Fetch patients from API when component mounts
//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   // API functions
//   const fetchPatients = async (): Promise<void> => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch('http://localhost:5000/api/dbpatient-available');
//       if (!response.ok) {
//         throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       console.log('Raw API response:', data);
      
//       // Transform API data to match our component interface
//       const transformedData: Patient[] = data.map((item: ApiPatient) => ({
//         id: item.P_ID,
//         name: item.name,
//         address: item.address,
//         dob: new Date(item.DOB),
//         sex: item.Sex,
//         mail: item.mail,
//         phoneNo: item.phone_no,
//         emergencyPhoneNo: item.emergency_phone_no
//       }));
      
//       setPatients(transformedData);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Error fetching patients:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addPatient = async (patient: Omit<Patient, 'id' | 'dob'> & {dob: Date}): Promise<Patient | undefined> => {
//     try {
//       setLoading(true);
      
//       const response = await fetch('http://localhost:5000/api/dbpatient-available', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           name: patient.name,
//           address: patient.address,
//           DOB: patient.dob.toISOString(), // Format date for API
//           Sex: patient.sex,
//           mail: patient.mail,
//           phone_no: patient.phoneNo,
//           emergency_phone_no: patient.emergencyPhoneNo
//         })
//       });
      
//       if (!response.ok) throw new Error('Failed to add patient');
      
//       const responseData = await response.json();
//       console.log('Add patient response:', responseData);
      
//       // Extract the patient data from response
//       const newPatientData = responseData.patient || responseData;
      
//       // Convert API response to component format
//       const newPatientItem: Patient = {
//         id: newPatientData.P_ID,
//         name: newPatientData.name,
//         address: newPatientData.address,
//         dob: new Date(newPatientData.DOB),
//         sex: newPatientData.Sex,
//         mail: newPatientData.mail,
//         phoneNo: newPatientData.phone_no,
//         emergencyPhoneNo: newPatientData.emergency_phone_no
//       };
      
//       setPatients(prevPatients => [...prevPatients, newPatientItem]);
//       return newPatientItem;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Error adding patient:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updatePatient = async (id: number, patientData: Partial<Patient>): Promise<Patient | undefined> => {
//     try {
//       setLoading(true);
      
//       // Format data for API
//       const apiData: any = {};
//       if (patientData.name !== undefined) apiData.name = patientData.name;
//       if (patientData.address !== undefined) apiData.address = patientData.address;
//       if (patientData.dob !== undefined) apiData.DOB = patientData.dob.toISOString();
//       if (patientData.sex !== undefined) apiData.Sex = patientData.sex;
//       if (patientData.mail !== undefined) apiData.mail = patientData.mail;
//       if (patientData.phoneNo !== undefined) apiData.phone_no = patientData.phoneNo;
//       if (patientData.emergencyPhoneNo !== undefined) apiData.emergency_phone_no = patientData.emergencyPhoneNo;
      
//       const response = await fetch(`http://localhost:5000/api/dbpatient-available/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(apiData)
//       });
      
//       if (!response.ok) {
//         // If API isn't implemented yet, simulate the update locally
//         const updatedPatient: Patient = { 
//           ...patientData,
//           id,
//           name: patientData.name || '',
//           phoneNo: patientData.phoneNo || '',
//           emergencyPhoneNo: patientData.emergencyPhoneNo || '',
//           dob: patientData.dob || new Date(),
//           sex: patientData.sex || 'M',
//         } as Patient;
        
//         setPatients(prevPatients => prevPatients.map(p => p.id === id ? updatedPatient : p));
//         return updatedPatient;
//       }
      
//       const responseData = await response.json();
//       const updatedPatientData = responseData.patient || responseData;
      
//       const updatedPatient: Patient = {
//         id: updatedPatientData.P_ID,
//         name: updatedPatientData.name,
//         address: updatedPatientData.address,
//         dob: new Date(updatedPatientData.DOB),
//         sex: updatedPatientData.Sex,
//         mail: updatedPatientData.mail,
//         phoneNo: updatedPatientData.phone_no,
//         emergencyPhoneNo: updatedPatientData.emergency_phone_no
//       };
      
//       setPatients(prevPatients => prevPatients.map(p => p.id === id ? updatedPatient : p));
//       return updatedPatient;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Error updating patient:', err);
      
//       // If the API fails, simulate update locally
//       const existingPatient = patients.find(p => p.id === id);
//       if (existingPatient && patientData.name) {
//         const updatedPatient = { ...existingPatient, ...patientData };
//         setPatients(prevPatients => prevPatients.map(p => p.id === id ? updatedPatient : p));
//         return updatedPatient;
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deletePatient = async (id: number): Promise<void> => {
//     try {
//       setLoading(true);
      
//       const response = await fetch(`http://localhost:5000/api/dbpatient-available/${id}`, {
//         method: 'DELETE'
//       });
      
//       // Even if API call fails, update local state
//       setPatients(prevPatients => prevPatients.filter(p => p.id !== id));
      
//       if (!response.ok) throw new Error('Failed to delete patient');
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Error deleting patient:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Search logic
//   const handleSearch = (): void => {
//     if (searchTerm.trim() === '') {
//       fetchPatients();
//     } else {
//       const searchValue = searchTerm.trim().toLowerCase();
//       setPatients(prevPatients => 
//         prevPatients.filter(p => 
//           p.id.toString().toLowerCase().includes(searchValue) || 
//           p.name.toLowerCase().includes(searchValue)
//         )
//       );
//     }
//   };

//   // Row click: open dialog in view mode
//   const handleRowClick = (patient: Patient): void => {
//     setSelectedPatient(patient);
//     setEditPatient({...patient}); // Make a copy to avoid reference issues
//     setEditMode(false);
//     setViewDialogOpen(true);
//   };

//   // Dialog close
//   const closeViewDialog = (): void => {
//     setViewDialogOpen(false);
//     setSelectedPatient(null);
//     setEditMode(false);
//     setEditPatient(null);
//   };

//   // Edit mode
//   const handleEdit = (): void => {
//     setEditMode(true);
//   };

//   // Editing fields with type safety
//   const handleInputChange = (name: keyof Patient, value: any): void => {
//     if (!editPatient) return;
//     setEditPatient({
//       ...editPatient,
//       [name]: value,
//     });
//   };

//   // Format date for inputs and display
//   const formatDateForInput = (date: Date): string => {
//     return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
//   };

//   const formatDate = (date: Date): string => {
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Detect changes for Save button
//   const isChanged = (): boolean => {
//     if (!selectedPatient || !editPatient) return false;
//     return (
//       selectedPatient.name !== editPatient.name ||
//       selectedPatient.address !== editPatient.address ||
//       selectedPatient.dob.getTime() !== editPatient.dob.getTime() ||
//       selectedPatient.sex !== editPatient.sex ||
//       selectedPatient.mail !== editPatient.mail ||
//       selectedPatient.phoneNo !== editPatient.phoneNo ||
//       selectedPatient.emergencyPhoneNo !== editPatient.emergencyPhoneNo
//     );
//   };

//   // Save edits
//   const handleSave = async (): Promise<void> => {
//     if (!editPatient) return;
//     try {
//       const updated = await updatePatient(editPatient.id, editPatient);
//       if (updated) {
//         setSelectedPatient(updated);
//         setEditMode(false);
//       }
//     } catch (error) {
//       console.error('Failed to save patient:', error);
//     }
//   };

//   // Delete patient
//   const handleDelete = async (): Promise<void> => {
//     if (!editPatient) return;
//     try {
//       await deletePatient(editPatient.id);
//       closeViewDialog();
//     } catch (error) {
//       console.error('Failed to delete patient:', error);
//     }
//   };

//   // Add Patient Dialog
//   const openAddDialog = (): void => {
//     setAddDialogOpen(true);
//     setNewPatient({
//       name: '',
//       address: '',
//       dob: new Date(),
//       sex: 'M',
//       mail: '',
//       phoneNo: '',
//       emergencyPhoneNo: ''
//     });
//   };

//   const handleNewPatientChange = (name: keyof Omit<Patient, 'id' | 'dob'> | 'dob', value: any): void => {
//     setNewPatient(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleAddPatient = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     try {
//       await addPatient(newPatient);
//       setAddDialogOpen(false);
//     } catch (error) {
//       console.error('Failed to add patient:', error);
//     }
//   };

//   // Loading state
//   if (loading && patients.length === 0) {
//     return (
//       <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
//         <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
//           Patients
//         </h2>
//         <div className="text-center py-8">
//           <p className="text-lg">Loading patients...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state with no data
//   if (error && patients.length === 0) {
//     return (
//       <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
//         <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
//           Patients
//         </h2>
//         <div className="text-center py-8">
//           <p className="text-lg text-red-500">Error: {error}</p>
//           <Button 
//             onClick={fetchPatients}
//             variant="default"
//             className="mt-4"
//           >
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
//       {/* Top Bar with Search and Add */}
//       <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
//         <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
//           Patients
//         </h2>
//         <div className="flex gap-2 items-center">
//           <Input
//             type="text"
//             placeholder="Search by ID or name"
//             value={searchTerm}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
//             className="w-64"
//           />
//           <Button 
//             onClick={handleSearch}
//             variant="default"
//           >
//             Search
//           </Button>
//           <Button 
//             onClick={() => { setSearchTerm(''); fetchPatients(); }}
//             variant="secondary"
//           >
//             Reset
//           </Button>
//           <Button 
//             onClick={openAddDialog}
//             variant="default"
//             className="bg-green-600 hover:bg-green-700"
//           >
//             Add Patient
//           </Button>
//         </div>
//       </div>

//       {/* Loading and Error States when data exists */}
//       {loading && patients.length > 0 && <p className="text-center py-4">Refreshing patients...</p>}
//       {error && patients.length > 0 && <p className="text-center py-4 text-red-500">Error: {error}</p>}

//       {/* Table */}
//       <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//         <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
//           <Table>
//             <TableHeader className={darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}>
//               <TableRow>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>ID</TableHead>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Name</TableHead>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Gender</TableHead>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Date of Birth</TableHead>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Phone</TableHead>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Emergency Contact</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody className={darkMode ? "bg-gray-900" : "bg-white"}>
//               {patients.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center py-6 text-gray-400">No patients found.</TableCell>
//                 </TableRow>
//               ) : (
//                 patients.map((patient) => (
//                   <TableRow
//                     key={patient.id}
//                     className={`cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
//                     onClick={() => handleRowClick(patient)}
//                   >
//                     <TableCell>{patient.id}</TableCell>
//                     <TableCell>{patient.name}</TableCell>
//                     <TableCell>{patient.sex === 'M' ? 'Male' : patient.sex === 'F' ? 'Female' : 'Other'}</TableCell>
//                     <TableCell>{formatDate(patient.dob)}</TableCell>
//                     <TableCell>{patient.phoneNo}</TableCell>
//                     <TableCell>{patient.emergencyPhoneNo}</TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* View/Edit Dialog */}
//       <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
//         <DialogContent className={`sm:max-w-md ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}>
//           <DialogHeader>
//             <DialogTitle>{editMode ? "Edit Patient" : "Patient Details"}</DialogTitle>
//           </DialogHeader>
          
//           {editMode ? (
//             <form className="space-y-3" onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSave(); }}>
//               <div>
//                 <Label className="font-semibold">ID:</Label>
//                 <Input
//                   className="w-full bg-gray-100 cursor-not-allowed"
//                   value={editPatient?.id.toString() || ''}
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <Label className="font-semibold">Name:</Label>
//                 <Input
//                   className="w-full"
//                   value={editPatient?.name || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label className="font-semibold">Address:</Label>
//                 <Input
//                   className="w-full"
//                   value={editPatient?.address || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value || null)}
//                 />
//               </div>
//               <div>
//                 <Label className="font-semibold">Date of Birth:</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-start text-left font-normal"
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {editPatient?.dob ? format(editPatient.dob, "PPP") : "Select a date"}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={editPatient?.dob}
//                       onSelect={(date) => handleInputChange('dob', date || new Date())}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//               <div>
//                 <Label className="font-semibold">Gender:</Label>
//                 <Select 
//                   value={editPatient?.sex || 'M'} 
//                   onValueChange={(value) => handleInputChange('sex', value as 'M' | 'F' | 'O')}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select gender" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="M">Male</SelectItem>
//                     <SelectItem value="F">Female</SelectItem>
//                     <SelectItem value="O">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label className="font-semibold">Email:</Label>
//                 <Input
//                   className="w-full"
//                   value={editPatient?.mail || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('mail', e.target.value || null)}
//                 />
//               </div>
//               <div>
//                 <Label className="font-semibold">Phone Number:</Label>
//                 <Input
//                   className="w-full"
//                   value={editPatient?.phoneNo || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phoneNo', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label className="font-semibold">Emergency Phone Number:</Label>
//                 <Input
//                   className="w-full"
//                   value={editPatient?.emergencyPhoneNo || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('emergencyPhoneNo', e.target.value)}
//                   required
//                 />
//               </div>
              
//               <DialogFooter className="flex justify-end gap-2 mt-6">
//                 <Button
//                   type="submit"
//                   disabled={!isChanged()}
//                   className={isChanged() ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}
//                 >
//                   Save
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={handleDelete}
//                   variant="destructive"
//                 >
//                   Delete
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={closeViewDialog}
//                   variant="secondary"
//                 >
//                   Close
//                 </Button>
//               </DialogFooter>
//             </form>
//           ) : (
//             <>
//               <div className="space-y-2">
//                 <p><strong>ID:</strong> {selectedPatient?.id}</p>
//                 <p><strong>Name:</strong> {selectedPatient?.name}</p>
//                 <p><strong>Address:</strong> {selectedPatient?.address || 'Not provided'}</p>
//                 <p><strong>Date of Birth:</strong> {selectedPatient && formatDate(selectedPatient.dob)}</p>
//                 <p><strong>Gender:</strong> {selectedPatient?.sex === 'M' ? 'Male' : selectedPatient?.sex === 'F' ? 'Female' : 'Other'}</p>
//                 <p><strong>Email:</strong> {selectedPatient?.mail || 'Not provided'}</p>
//                 <p><strong>Phone Number:</strong> {selectedPatient?.phoneNo}</p>
//                 <p><strong>Emergency Phone Number:</strong> {selectedPatient?.emergencyPhoneNo}</p>
//               </div>
              
//               <DialogFooter className="flex justify-end gap-2 mt-6">
//                 <Button
//                   onClick={handleEdit}
//                   variant="default"
//                   className="bg-yellow-500 hover:bg-yellow-600"
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   onClick={closeViewDialog}
//                   variant="secondary"
//                 >
//                   Close
//                 </Button>
//               </DialogFooter>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Add Patient Dialog */}
//       <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
//         <DialogContent className={`sm:max-w-md ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}>
//           <DialogHeader>
//             <DialogTitle>Add Patient</DialogTitle>
//           </DialogHeader>
          
//           <form className="space-y-3" onSubmit={handleAddPatient}>
//             <div>
//               <Label className="font-semibold">Name:</Label>
//               <Input
//                 className="w-full"
//                 value={newPatient.name}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPatientChange('name', e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <Label className="font-semibold">Address:</Label>
//               <Input
//                 className="w-full"
//                 value={newPatient.address || ''}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPatientChange('address', e.target.value || null)}
//               />
//             </div>
//             <div>
//               <Label className="font-semibold">Date of Birth:</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-left font-normal"
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {format(newPatient.dob, "PPP")}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   <Calendar
//                     mode="single"
//                     selected={newPatient.dob}
//                     onSelect={(date) => handleNewPatientChange('dob', date || new Date())}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>
//             <div>
//               <Label className="font-semibold">Gender:</Label>
//               <Select 
//                 value={newPatient.sex} 
//                 onValueChange={(value) => handleNewPatientChange('sex', value as 'M' | 'F' | 'O')}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select gender" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="M">Male</SelectItem>
//                   <SelectItem value="F">Female</SelectItem>
//                   <SelectItem value="O">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label className="font-semibold">Email:</Label>
//               <Input
//                 className="w-full"
//                 value={newPatient.mail || ''}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPatientChange('mail', e.target.value || null)}
//               />
//             </div>
//             <div>
//               <Label className="font-semibold">Phone Number:</Label>
//               <Input
//                 className="w-full"
//                 value={newPatient.phoneNo}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPatientChange('phoneNo', e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <Label className="font-semibold">Emergency Phone Number:</Label>
//               <Input
//                 className="w-full"
//                 value={newPatient.emergencyPhoneNo}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPatientChange('emergencyPhoneNo', e.target.value)}
//                 required
//               />
//             </div>
            
//             <DialogFooter className="flex justify-end gap-2 mt-6">
//               <Button
//                 type="submit"
//                 className="bg-green-600 hover:bg-green-700"
//               >
//                 Add
//               </Button>
//               <Button
//                 type="button"
//                 onClick={() => setAddDialogOpen(false)}
//                 variant="secondary"
//               >
//                 Cancel
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default PatientsTable;

import React, { useState, useEffect } from 'react';

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

// API response interface - matches your Prisma model
interface ApiPatient {
  P_ID: number;
  name: string;
  address: string | null;
  DOB: string;
  Sex: 'M' | 'F' | 'O';
  mail: string | null;
  phone_no: string;
  emergency_phone_no: string;
}

// Component data interface
interface Patient {
  id: number;
  name: string;
  address: string | null | undefined;
  dob: Date;
  sex: 'M' | 'F' | 'O';
  mail: string | null | undefined;
  phoneNo: string;
  emergencyPhoneNo: string;
}

interface PatientsTableProps {
  darkMode: boolean;
}

// --- MULTI-BACKEND URL LOGIC ---
const PATIENT_SERVICE_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev",
  "http://localhost:5000"
];

const resolveBaseByAddress = async (address: string): Promise<string | null> => {
  for (const baseUrl of PATIENT_SERVICE_URLS) {
    try {
      const response = await fetch(`${baseUrl}/api/dbpatient-available`);
      if (!response.ok) continue;
      const patients = await response.json();
      if (Array.isArray(patients)) {
        return baseUrl;
      }
    } catch {
      continue;
    }
  }
  return null;
};

const PatientsTable: React.FC<PatientsTableProps> = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id' | 'dob'> & {dob: Date}>({
    name: '',
    address: '',
    dob: new Date(),
    sex: 'M',
    mail: '',
    phoneNo: '',
    emergencyPhoneNo: ''
  });

  // Fetch patients from all backend URLs in parallel
  const fetchPatients = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const fetchPromises = PATIENT_SERVICE_URLS.map(async (baseUrl) => {
        try {
          const response = await fetch(`${baseUrl}/api/dbpatient-available`);
          if (!response.ok) throw new Error();
          const data = await response.json();
          if (!Array.isArray(data)) throw new Error();
          return data;
        } catch {
          return [];
        }
      });
      const results = await Promise.all(fetchPromises);
      const transformedData: Patient[] = results.flat().map((item: ApiPatient) => ({
        id: item.P_ID,
        name: item.name,
        address: item.address,
        dob: new Date(item.DOB),
        sex: item.Sex,
        mail: item.mail,
        phoneNo: item.phone_no,
        emergencyPhoneNo: item.emergency_phone_no
      }));
      setPatients(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const addPatient = async (patient: Omit<Patient, 'id' | 'dob'> & {dob: Date}): Promise<Patient | undefined> => {
    try {
      setLoading(true);
      if (!patient.address) throw new Error("Address is required");
      const baseUrl = await resolveBaseByAddress(patient.address);
      if (!baseUrl) throw new Error("No service found for the address");
      const response = await fetch(`${baseUrl}/api/dbpatient-available`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: patient.name,
          address: patient.address,
          DOB: patient.dob.toISOString(),
          Sex: patient.sex,
          mail: patient.mail,
          phone_no: patient.phoneNo,
          emergency_phone_no: patient.emergencyPhoneNo
        })
      });
      if (!response.ok) throw new Error('Failed to add patient');
      const responseData = await response.json();
      const newPatientData = responseData.patient || responseData;
      const newPatientItem: Patient = {
        id: newPatientData.P_ID,
        name: newPatientData.name,
        address: newPatientData.address,
        dob: new Date(newPatientData.DOB),
        sex: newPatientData.Sex,
        mail: newPatientData.mail,
        phoneNo: newPatientData.phone_no,
        emergencyPhoneNo: newPatientData.emergency_phone_no
      };
      setPatients(prevPatients => [...prevPatients, newPatientItem]);
      return newPatientItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (id: number, patientData: Partial<Patient>): Promise<Patient | undefined> => {
    try {
      setLoading(true);
      if (!patientData.address) throw new Error("Address is required for update");
      const baseUrl = await resolveBaseByAddress(patientData.address);
      if (!baseUrl) throw new Error("No service found for the address");
      const apiData: any = {};
      if (patientData.name !== undefined) apiData.name = patientData.name;
      if (patientData.address !== undefined) apiData.address = patientData.address;
      if (patientData.dob !== undefined) apiData.DOB = patientData.dob.toISOString();
      if (patientData.sex !== undefined) apiData.Sex = patientData.sex;
      if (patientData.mail !== undefined) apiData.mail = patientData.mail;
      if (patientData.phoneNo !== undefined) apiData.phone_no = patientData.phoneNo;
      if (patientData.emergencyPhoneNo !== undefined) apiData.emergency_phone_no = patientData.emergencyPhoneNo;
      const response = await fetch(`${baseUrl}/api/dbpatient-available/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });
      if (!response.ok) {
        // If API isn't implemented yet, simulate the update locally
        const updatedPatient: Patient = { 
          ...patientData,
          id,
          name: patientData.name || '',
          phoneNo: patientData.phoneNo || '',
          emergencyPhoneNo: patientData.emergencyPhoneNo || '',
          dob: patientData.dob || new Date(),
          sex: patientData.sex || 'M',
        } as Patient;
        setPatients(prevPatients => prevPatients.map(p => p.id === id ? updatedPatient : p));
        return updatedPatient;
      }
      const responseData = await response.json();
      const updatedPatientData = responseData.patient || responseData;
      const updatedPatient: Patient = {
        id: updatedPatientData.P_ID,
        name: updatedPatientData.name,
        address: updatedPatientData.address,
        dob: new Date(updatedPatientData.DOB),
        sex: updatedPatientData.Sex,
        mail: updatedPatientData.mail,
        phoneNo: updatedPatientData.phone_no,
        emergencyPhoneNo: updatedPatientData.emergency_phone_no
      };
      setPatients(prevPatients => prevPatients.map(p => p.id === id ? updatedPatient : p));
      return updatedPatient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      // If the API fails, simulate update locally
      const existingPatient = patients.find(p => p.id === id);
      if (existingPatient && patientData.name) {
        const updatedPatient = { ...existingPatient, ...patientData };
        setPatients(prevPatients => prevPatients.map(p => p.id === id ? updatedPatient : p));
        return updatedPatient;
      }
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      const patientToDelete = patients.find(p => p.id === id);
      if (!patientToDelete) throw new Error("Patient not found");
      const baseUrl = await resolveBaseByAddress(patientToDelete.address || '');
      if (!baseUrl) throw new Error("No service found for the address");
      const response = await fetch(`${baseUrl}/api/dbpatient-available/${id}`, {
        method: 'DELETE'
      });
      setPatients(prevPatients => prevPatients.filter(p => p.id !== id));
      if (!response.ok) throw new Error('Failed to delete patient');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Search logic
  const handleSearch = (): void => {
    if (searchTerm.trim() === '') {
      fetchPatients();
    } else {
      const searchValue = searchTerm.trim().toLowerCase();
      setPatients(prevPatients => 
        prevPatients.filter(p => 
          p.id.toString().toLowerCase().includes(searchValue) || 
          p.name.toLowerCase().includes(searchValue)
        )
      );
    }
  };

  // Row click: open dialog in view mode
  const handleRowClick = (patient: Patient): void => {
    setSelectedPatient(patient);
    setEditPatient({...patient});
    setEditMode(false);
    setViewDialogOpen(true);
  };

  // Dialog close
  const closeViewDialog = (): void => {
    setViewDialogOpen(false);
    setSelectedPatient(null);
    setEditMode(false);
    setEditPatient(null);
  };

  // Edit mode
  const handleEdit = (): void => {
    setEditMode(true);
  };

  // Editing fields with type safety
  const handleInputChange = (name: keyof Patient, value: any): void => {
    if (!editPatient) return;
    setEditPatient({
      ...editPatient,
      [name]: value,
    });
  };

  // Format date for inputs and display
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Detect changes for Save button
  const isChanged = (): boolean => {
    if (!selectedPatient || !editPatient) return false;
    return (
      selectedPatient.name !== editPatient.name ||
      selectedPatient.address !== editPatient.address ||
      selectedPatient.dob.getTime() !== editPatient.dob.getTime() ||
      selectedPatient.sex !== editPatient.sex ||
      selectedPatient.mail !== editPatient.mail ||
      selectedPatient.phoneNo !== editPatient.phoneNo ||
      selectedPatient.emergencyPhoneNo !== editPatient.emergencyPhoneNo
    );
  };

  // Save edits
  const handleSave = async (): Promise<void> => {
    if (!editPatient) return;
    try {
      const updated = await updatePatient(editPatient.id, editPatient);
      if (updated) {
        setSelectedPatient(updated);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Failed to save patient:', error);
    }
  };

  // Delete patient
  const handleDelete = async (): Promise<void> => {
    if (!editPatient) return;
    try {
      await deletePatient(editPatient.id);
      closeViewDialog();
    } catch (error) {
      console.error('Failed to delete patient:', error);
    }
  };

  // Add Patient Dialog
  const openAddDialog = (): void => {
    setAddDialogOpen(true);
    setNewPatient({
      name: '',
      address: '',
      dob: new Date(),
      sex: 'M',
      mail: '',
      phoneNo: '',
      emergencyPhoneNo: ''
    });
  };

  const handleNewPatientChange = (name: keyof Omit<Patient, 'id' | 'dob'> | 'dob', value: any): void => {
    setNewPatient(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPatient = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await addPatient(newPatient);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add patient:', error);
    }
  };

  // Loading state
  if (loading && patients.length === 0) {
    return (
      <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
        <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
          Patients
        </h2>
        <div className="text-center py-8">
          <p className="text-lg">Loading patients...</p>
        </div>
      </div>
    );
  }

  // Error state with no data
  if (error && patients.length === 0) {
    return (
      <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
        <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
          Patients
        </h2>
        <div className="text-center py-8">
          <p className="text-lg text-red-500">Error: {error}</p>
          <Button 
            onClick={fetchPatients}
            variant="default"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
      {/* Top Bar with Search and Add */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
          Patients
        </h2>
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Search by ID or name"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button 
            onClick={handleSearch}
            variant="default"
          >
            Search
          </Button>
          <Button 
            onClick={() => { setSearchTerm(''); fetchPatients(); }}
            variant="secondary"
          >
            Reset
          </Button>
          <Button 
            onClick={openAddDialog}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            Add Patient
          </Button>
        </div>
      </div>

      {/* Loading and Error States when data exists */}
      {loading && patients.length > 0 && <p className="text-center py-4">Refreshing patients...</p>}
      {error && patients.length > 0 && <p className="text-center py-4 text-red-500">Error: {error}</p>}

      {/* Table */}
      <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table>
            <TableHeader className={darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}>
              <TableRow>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>ID</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Name</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Gender</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Date of Birth</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Phone</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Emergency Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={darkMode ? "bg-gray-900" : "bg-white"}>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-400">No patients found.</TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className={`cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
                    onClick={() => handleRowClick(patient)}
                  >
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.sex === 'M' ? 'Male' : patient.sex === 'F' ? 'Female' : 'Other'}</TableCell>
                    <TableCell>{formatDate(patient.dob)}</TableCell>
                    <TableCell>{patient.phoneNo}</TableCell>
                    <TableCell>{patient.emergencyPhoneNo}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View/Edit Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className={`sm:max-w-md ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}>
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Patient" : "Patient Details"}</DialogTitle>
          </DialogHeader>
          
          {editMode ? (
            <form className="space-y-3" onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSave(); }}>
              <div>
                <Label className="font-semibold">ID:</Label>
                <Input
                  className="w-full bg-gray-100 cursor-not-allowed"
                  value={editPatient?.id.toString() || ''}
                  readOnly
                />
              </div>
              <div>
                <Label className="font-semibold">Name:</Label>
                <Input
                  className="w-full"
                  value={editPatient?.name || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="font-semibold">Address:</Label>
                <Input
                  className="w-full"
                  value={editPatient?.address || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value || null)}
                />
              </div>
              <div>
                <Label className="font-semibold">Date of Birth:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editPatient?.dob ? format(editPatient.dob, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editPatient?.dob}
                      onSelect={(date) => handleInputChange('dob', date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="font-semibold">Gender:</Label>
                <Select 
                  value={editPatient?.sex || 'M'} 
                  onValueChange={(value) => handleInputChange('sex', value as 'M' | 'F' | 'O')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="O">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-semibold">Email:</Label>
                <Input
                  className="w-full"
                  value={editPatient?.mail || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('mail', e.target.value || null)}
                />
              </div>
              <div>
                <Label className="font-semibold">Phone Number:</Label>
                <Input
                  className="w-full"
                  value={editPatient?.phoneNo || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phoneNo', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="font-semibold">Emergency Phone Number:</Label>
                <Input
                  className="w-full"
                  value={editPatient?.emergencyPhoneNo || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('emergencyPhoneNo', e.target.value)}
                  required
                />
              </div>
              <DialogFooter className="flex justify-end gap-2 mt-6">
                <Button
                  type="submit"
                  disabled={!isChanged()}
                  className={isChanged() ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  variant="destructive"
                >
                  Delete
                </Button>
                <Button
                  type="button"
                  onClick={closeViewDialog}
                  variant="secondary"
                >
                  Close
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <>
              <div className="space-y-2">
                <p><strong>ID:</strong> {selectedPatient?.id}</p>
                <p><strong>Name:</strong> {selectedPatient?.name}</p>
                <p><strong>Address:</strong> {selectedPatient?.address || 'Not provided'}</p>
                <p><strong>Date of Birth:</strong> {selectedPatient && formatDate(selectedPatient.dob)}</p>
                <p><strong>Gender:</strong> {selectedPatient?.sex === 'M' ? 'Male' : selectedPatient?.sex === 'F' ? 'Female' : 'Other'}</p>
                <p><strong>Email:</strong> {selectedPatient?.mail || 'Not provided'}</p>
                <p><strong>Phone Number:</strong> {selectedPatient?.phoneNo}</p>
                <p><strong>Emergency Phone Number:</strong> {selectedPatient?.emergencyPhoneNo}</p>
              </div>
              
              <DialogFooter className="flex justify-end gap-2 mt-6">
                <Button
                  onClick={handleEdit}
                  variant="default"
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  Edit
                </Button>
                <Button
                  onClick={closeViewDialog}
                  variant="secondary"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Patient Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className={`sm:max-w-md ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}>
          <DialogHeader>
            <DialogTitle>Add Patient</DialogTitle>
          </DialogHeader>
          
          <form className="space-y-3" onSubmit={handleAddPatient}>
            <div>
              <Label className="font-semibold">Name:</Label>
              <Input
                className="w-full"
                value={newPatient.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPatientChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="font-semibold">Address:</Label>
              <Input
                className="w-full"
                value={newPatient.address || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPatientChange('address', e.target.value || null)}
              />
            </div>
            <div>
              <Label className="font-semibold">Date of Birth:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(newPatient.dob, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newPatient.dob}
                    onSelect={(date) => handleNewPatientChange('dob', date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="font-semibold">Gender:</Label>
              <Select 
                value={newPatient.sex} 
                onValueChange={(value) => handleNewPatientChange('sex', value as 'M' | 'F' | 'O')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="O">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-semibold">Email:</Label>
              <Input
                className="w-full"
                value={newPatient.mail || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPatientChange('mail', e.target.value || null)}
              />
            </div>
            <div>
              <Label className="font-semibold">Phone Number:</Label>
              <Input
                className="w-full"
                value={newPatient.phoneNo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPatientChange('phoneNo', e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="font-semibold">Emergency Phone Number:</Label>
              <Input
                className="w-full"
                value={newPatient.emergencyPhoneNo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPatientChange('emergencyPhoneNo', e.target.value)}
                required
              />
            </div>
            
            <DialogFooter className="flex justify-end gap-2 mt-6">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                Add
              </Button>
              <Button
                type="button"
                onClick={() => setAddDialogOpen(false)}
                variant="secondary"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientsTable;
