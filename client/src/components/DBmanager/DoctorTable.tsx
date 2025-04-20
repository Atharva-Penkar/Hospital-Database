// import React, { useState, useEffect } from 'react';

// // Import shadcn components
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// // API response interface - matches your Prisma model
// interface ApiDoctor {
//   D_ID: number;
//   name: string;
//   specialization: string;
//   mail: string | null;
//   phone: string;
//   shift: string | null;
//   available: boolean;
//   ad_id: number | null;
// }

// // Component data interface
// interface Doctor {
//   id: number;           // Maps to D_ID in Prisma
//   name: string;
//   specialization: string;
//   mail: string | null |undefined;
//   phone: string;
//   shift: string | null | undefined;
//   available: boolean;
//   ad_id: number | null | undefined;
// }

// const SPECIALIZATIONS_URLS = [
//   "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev",
//   "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev",
//   "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev",
//   "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev",
//   "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev",
//   "http://localhost:5000"
// ];

// interface DoctorsTableProps {
//   darkMode: boolean;
// }

// const DoctorsTable: React.FC<DoctorsTableProps> = ({ darkMode }) => {
//   const [searchId, setSearchId] = useState<string>('');
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
//   const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
//   const [editMode, setEditMode] = useState<boolean>(false);
//   const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
//   const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const [newDoctor, setNewDoctor] = useState<Omit<Doctor, 'id'>>({
//     name: '',
//     specialization: '',
//     mail: null,
//     phone: '',
//     shift: null,
//     available: true,
//     ad_id: null
//   });

//   // Fetch doctors from API when component mounts
//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   // API functions
//   const fetchDoctors = async (): Promise<void> => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch(`${baseUrl}/api/dbdoctor-available`);
//       if (!response.ok) throw new Error('Failed to fetch doctors');
      
//       const data = await response.json();
//       console.log('Raw API response:', data);
      
//       // Type guard to ensure data is an array
//       if (!Array.isArray(data)) {
//         throw new Error('API response is not an array');
//       }
      
//       // Transform API data to match our component interface
//       const transformedData: Doctor[] = data.map((item: ApiDoctor) => ({
//         id: item.D_ID,
//         name: item.name,
//         specialization: item.specialization,
//         mail: item.mail,
//         phone: item.phone,
//         shift: item.shift,
//         available: item.available,
//         ad_id: item.ad_id
//       }));
      
//       setDoctors(transformedData);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Error fetching doctors:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addDoctor = async (doctor: Omit<Doctor, 'id'>): Promise<Doctor | undefined> => {
//     try {
//       setLoading(true);
      
//       const response = await fetch('http://localhost:5000/api/dbdoctor-available', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           name: doctor.name,
//           specialization: doctor.specialization,
//           mail: doctor.mail,
//           phone: doctor.phone,
//           shift: doctor.shift,
//           available: doctor.available,
//           ad_id: doctor.ad_id
//         })
//       });
      
//       if (!response.ok) throw new Error('Failed to add doctor');
      
//       const responseData = await response.json();
//       console.log('Add doctor response:', responseData);
      
//       // If the response has nested data, ensure we extract it correctly
//       const newDoctorData = responseData.doctor || responseData;
      
//       // Convert API response to our component's format
//       const newDoctorItem: Doctor = {
//         id: newDoctorData.D_ID,
//         name: newDoctorData.name,
//         specialization: newDoctorData.specialization,
//         mail: newDoctorData.mail,
//         phone: newDoctorData.phone,
//         shift: newDoctorData.shift,
//         available: newDoctorData.available,
//         ad_id: newDoctorData.ad_id
//       };
      
//       setDoctors(prevDoctors => [...prevDoctors, newDoctorItem]);
//       return newDoctorItem;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Error adding doctor:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateDoctor = async (id: number, doctorData: Partial<Doctor>): Promise<Doctor | undefined> => {
//     try {
//       setLoading(true);
      
//       const response = await fetch(`http://localhost:5000/api/dbdoctor-available/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           name: doctorData.name,
//           specialization: doctorData.specialization,
//           mail: doctorData.mail,
//           phone: doctorData.phone,
//           shift: doctorData.shift,
//           available: doctorData.available,
//           ad_id: doctorData.ad_id
//         })
//       });
      
//       if (!response.ok) {
//         // If API isn't implemented yet, simulate the update locally
//         const updatedDoctor: Doctor = { 
//           id,
//           name: doctorData.name || '',
//           specialization: doctorData.specialization || '',
//           mail: doctorData.mail,
//           phone: doctorData.phone || '',
//           shift: doctorData.shift,
//           available: doctorData.available !== undefined ? doctorData.available : true,
//           ad_id: doctorData.ad_id
//         };
        
//         setDoctors(prevDoctors => prevDoctors.map(d => d.id === id ? updatedDoctor : d));
//         return updatedDoctor;
//       }
      
//       const responseData = await response.json();
//       const updatedDoctorData = responseData.doctor || responseData;
      
//       const updatedDoctor: Doctor = {
//         id: updatedDoctorData.D_ID,
//         name: updatedDoctorData.name,
//         specialization: updatedDoctorData.specialization,
//         mail: updatedDoctorData.mail,
//         phone: updatedDoctorData.phone,
//         shift: updatedDoctorData.shift,
//         available: updatedDoctorData.available,
//         ad_id: updatedDoctorData.ad_id
//       };
      
//       setDoctors(prevDoctors => prevDoctors.map(d => d.id === id ? updatedDoctor : d));
//       return updatedDoctor;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Error updating doctor:', err);
      
//       // If the API fails, simulate update locally
//       if (doctorData.name) {
//         // Create a merged doctor object with existing data plus updates
//         const existingDoctor = doctors.find(d => d.id === id);
//         if (existingDoctor) {
//           const updatedDoctor = { ...existingDoctor, ...doctorData };
//           setDoctors(prevDoctors => prevDoctors.map(d => d.id === id ? updatedDoctor : d));
//           return updatedDoctor;
//         }
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteDoctor = async (id: number): Promise<void> => {
//     try {
//       setLoading(true);
      
//       const response = await fetch(`http://localhost:5000/api/dbdoctor-available/${id}`, {
//         method: 'DELETE'
//       });
      
//       // If the API is not implemented yet, just do local deletion
//       if (!response.ok) {
//         setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== id));
//         return;
//       }
      
//       // If the API worked, still update local state
//       setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== id));
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       setError(errorMessage);
//       console.error('Error deleting doctor:', err);
      
//       // Even if API fails, update the UI
//       setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== id));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Search logic - fixed to search by string ID or name
//   const handleSearch = (): void => {
//     if (searchId.trim() === '') {
//       fetchDoctors();
//     } else {
//       const searchValue = searchId.trim().toLowerCase();
//       setDoctors(prevDoctors => 
//         prevDoctors.filter(d => 
//           d.id.toString().toLowerCase().includes(searchValue) || 
//           d.name.toLowerCase().includes(searchValue) ||
//           d.specialization.toLowerCase().includes(searchValue)
//         )
//       );
//     }
//   };

//   // Row click: open dialog in view mode
//   const handleRowClick = (doctor: Doctor): void => {
//     setSelectedDoctor(doctor);
//     setEditDoctor({...doctor}); // Make a copy to avoid reference issues
//     setEditMode(false);
//     setViewDialogOpen(true);
//   };

//   // Dialog close
//   const closeViewDialog = (): void => {
//     setViewDialogOpen(false);
//     setSelectedDoctor(null);
//     setEditMode(false);
//     setEditDoctor(null);
//   };

//   // Edit mode
//   const handleEdit = (): void => {
//     setEditMode(true);
//   };

//   // Editing fields with type safety
//   const handleInputChange = (name: keyof Doctor, value: any): void => {
//     if (!editDoctor) return;
//     setEditDoctor({
//       ...editDoctor,
//       [name]: value,
//     });
//   };

//   // Detect changes for Save button
//   const isChanged = (): boolean => {
//     if (!selectedDoctor || !editDoctor) return false;
//     return (
//       selectedDoctor.name !== editDoctor.name ||
//       selectedDoctor.specialization !== editDoctor.specialization ||
//       selectedDoctor.mail !== editDoctor.mail ||
//       selectedDoctor.phone !== editDoctor.phone ||
//       selectedDoctor.shift !== editDoctor.shift ||
//       selectedDoctor.available !== editDoctor.available ||
//       selectedDoctor.ad_id !== editDoctor.ad_id
//     );
//   };

//   // Save edits
//   const handleSave = async (): Promise<void> => {
//     if (!editDoctor) return;
//     try {
//       const updated = await updateDoctor(editDoctor.id, editDoctor);
//       if (updated) {
//         setSelectedDoctor(updated);
//         setEditMode(false);
//       }
//     } catch (error) {
//       console.error('Failed to save doctor:', error);
//     }
//   };

//   // Delete doctor
//   const handleDelete = async (): Promise<void> => {
//     if (!editDoctor) return;
//     try {
//       await deleteDoctor(editDoctor.id);
//       closeViewDialog();
//     } catch (error) {
//       console.error('Failed to delete doctor:', error);
//     }
//   };

//   // Add Doctor Dialog
//   const openAddDialog = (): void => {
//     setAddDialogOpen(true);
//     setNewDoctor({
//       name: '',
//       specialization: '',
//       mail: null,
//       phone: '',
//       shift: null,
//       available: true,
//       ad_id: null
//     });
//   };

//   const handleNewDoctorChange = (name: keyof Omit<Doctor, 'id'>, value: any): void => {
//     setNewDoctor(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleAddDoctor = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     try {
//       await addDoctor(newDoctor);
//       setAddDialogOpen(false);
//     } catch (error) {
//       console.error('Failed to add doctor:', error);
//     }
//   };

//   // Loading state
//   if (loading && doctors.length === 0) {
//     return (
//       <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
//         <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
//           Doctors
//         </h2>
//         <div className="text-center py-8">
//           <p className="text-lg">Loading doctors...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state with no data
//   if (error && doctors.length === 0) {
//     return (
//       <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
//         <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
//           Doctors
//         </h2>
//         <div className="text-center py-8">
//           <p className="text-lg text-red-500">Error: {error}</p>
//           <Button 
//             onClick={fetchDoctors}
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
//           Doctors
//         </h2>
//         <div className="flex gap-2 items-center">
//           <Input
//             type="text"
//             placeholder="Search by ID, name or specialization"
//             value={searchId}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
//             className="w-64"
//           />
//           <Button 
//             onClick={handleSearch}
//             variant="default"
//           >
//             Search
//           </Button>
//           <Button 
//             onClick={() => { setSearchId(''); fetchDoctors(); }}
//             variant="secondary"
//           >
//             Reset
//           </Button>
//           <Button 
//             onClick={openAddDialog}
//             variant="default"
//             className="bg-green-600 hover:bg-green-700"
//           >
//             Add Doctor
//           </Button>
//         </div>
//       </div>

//       {/* Loading and Error States when data exists */}
//       {loading && doctors.length > 0 && <p className="text-center py-4">Refreshing doctors...</p>}
//       {error && doctors.length > 0 && <p className="text-center py-4 text-red-500">Error: {error}</p>}

//       {/* Table */}
//       <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//         <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
//           <Table>
//             <TableHeader className={darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}>
//               <TableRow>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>ID</TableHead>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Name</TableHead>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Specialization</TableHead>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Phone</TableHead>
//                 <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody className={darkMode ? "bg-gray-900" : "bg-white"}>
//               {doctors.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5} className="text-center py-6 text-gray-400">No doctors found.</TableCell>
//                 </TableRow>
//               ) : (
//                 doctors.map((doctor) => (
//                   <TableRow
//                     key={doctor.id}
//                     className={`cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
//                     onClick={() => handleRowClick(doctor)}
//                   >
//                     <TableCell>{doctor.id}</TableCell>
//                     <TableCell>{doctor.name}</TableCell>
//                     <TableCell>{doctor.specialization}</TableCell>
//                     <TableCell>{doctor.phone}</TableCell>
//                     <TableCell>
//                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
//                         ${doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                         {doctor.available ? 'Available' : 'Unavailable'}
//                       </span>
//                     </TableCell>
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
//             <DialogTitle>{editMode ? "Edit Doctor" : "Doctor Details"}</DialogTitle>
//           </DialogHeader>
          
//           {editMode ? (
//             <form className="space-y-3" onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSave(); }}>
//               <div>
//                 <Label className="font-semibold">ID:</Label>
//                 <Input
//                   className="w-full bg-gray-100 cursor-not-allowed"
//                   value={editDoctor?.id.toString() || ''}
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <Label className="font-semibold">Name:</Label>
//                 <Input
//                   className="w-full"
//                   value={editDoctor?.name || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label className="font-semibold">Specialization:</Label>
//                 <Input
//                   className="w-full"
//                   value={editDoctor?.specialization || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('specialization', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label className="font-semibold">Email:</Label>
//                 <Input
//                   className="w-full"
//                   value={editDoctor?.mail || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('mail', e.target.value || null)}
//                 />
//               </div>
//               <div>
//                 <Label className="font-semibold">Phone:</Label>
//                 <Input
//                   className="w-full"
//                   value={editDoctor?.phone || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label className="font-semibold">Shift:</Label>
//                 <Input
//                   className="w-full"
//                   value={editDoctor?.shift || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('shift', e.target.value || null)}
//                 />
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Label className="font-semibold">Available:</Label>
//                 <Switch 
//                   checked={editDoctor?.available || false}
//                   onCheckedChange={(checked :boolean) => handleInputChange('available', checked)}
//                 />
//                 <span className="ml-2">{editDoctor?.available ? 'Yes' : 'No'}</span>
//               </div>
//               <div>
//                 <Label className="font-semibold">Admin ID:</Label>
//                 <Input
//                   className="w-full"
//                   type="number"
//                   value={editDoctor?.ad_id?.toString() || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     const value = e.target.value === '' ? null : parseInt(e.target.value);
//                     handleInputChange('ad_id', value);
//                   }}
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
//                 <p><strong>ID:</strong> {selectedDoctor?.id}</p>
//                 <p><strong>Name:</strong> {selectedDoctor?.name}</p>
//                 <p><strong>Specialization:</strong> {selectedDoctor?.specialization}</p>
//                 <p><strong>Email:</strong> {selectedDoctor?.mail || 'Not provided'}</p>
//                 <p><strong>Phone:</strong> {selectedDoctor?.phone}</p>
//                 <p><strong>Shift:</strong> {selectedDoctor?.shift || 'Not specified'}</p>
//                 <p><strong>Available:</strong> {selectedDoctor?.available ? 'Yes' : 'No'}</p>
//                 <p><strong>Admin ID:</strong> {selectedDoctor?.ad_id || 'Not assigned'}</p>
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

//       {/* Add Doctor Dialog */}
//       <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
//         <DialogContent className={`sm:max-w-md ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}>
//           <DialogHeader>
//             <DialogTitle>Add Doctor</DialogTitle>
//           </DialogHeader>
          
//           <form className="space-y-3" onSubmit={handleAddDoctor}>
//             <div>
//               <Label className="font-semibold">Name:</Label>
//               <Input
//                 className="w-full"
//                 value={newDoctor.name}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewDoctorChange('name', e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <Label className="font-semibold">Specialization:</Label>
//               <Input
//                 className="w-full"
//                 value={newDoctor.specialization}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewDoctorChange('specialization', e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <Label className="font-semibold">Email:</Label>
//               <Input
//                 className="w-full"
//                 value={newDoctor.mail || ''}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewDoctorChange('mail', e.target.value || null)}
//               />
//             </div>
//             <div>
//               <Label className="font-semibold">Phone:</Label>
//               <Input
//                 className="w-full"
//                 value={newDoctor.phone}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewDoctorChange('phone', e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <Label className="font-semibold">Shift:</Label>
//               <Input
//                 className="w-full"
//                 value={newDoctor.shift || ''}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewDoctorChange('shift', e.target.value || null)}
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <Label className="font-semibold">Available:</Label>
//               <Switch 
//                 checked={newDoctor.available}
//                 onCheckedChange={(checked : boolean) => handleNewDoctorChange('available', checked)}
//               />
//               <span className="ml-2">{newDoctor.available ? 'Yes' : 'No'}</span>
//             </div>
//             <div>
//               <Label className="font-semibold">Admin ID:</Label>
//               <Input
//                 className="w-full"
//                 type="number"
//                 value={newDoctor.ad_id?.toString() || ''}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                   const value = e.target.value === '' ? null : parseInt(e.target.value);
//                   handleNewDoctorChange('ad_id', value);
//                 }}
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

// export default DoctorsTable;

import React, { useState, useEffect } from 'react';

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// API response interface - matches your Prisma model
interface ApiDoctor {
  D_ID: number;
  name: string;
  specialization: string;
  mail: string | null;
  phone: string;
  shift: string | null;
  available: boolean;
  ad_id: number | null;
}

// Component data interface
interface Doctor {
  id: number;           // Maps to D_ID in Prisma
  name: string;
  specialization: string;
  mail: string | null | undefined;
  phone: string;
  shift: string | null | undefined;
  available: boolean;
  ad_id: number | null | undefined;
}

const SPECIALIZATIONS_URLS = [
  "https://probable-parakeet-9vw4979p6q5c4x4-5000.app.github.dev",
  "https://effective-enigma-6jx7j47vvj635gqv-5000.app.github.dev",
  "https://improved-umbrella-6997vv74rqgpc59gx-5000.app.github.dev",
  "https://bug-free-zebra-7qw4vwr6jq5cwp6x-5000.app.github.dev",
  "https://special-spoon-q7wxq4pjqwrf4rrw-5000.app.github.dev",
  "http://localhost:5000"
];

const resolveBaseBySpecialization = async (specialization: string): Promise<string | null> => {
  for (const baseUrl of SPECIALIZATIONS_URLS) {
    try {
      const response = await fetch(`${baseUrl}/api/dbdoctor-available`);
      if (!response.ok) continue;
      // const doctors = await response.json();
      // if (Array.isArray(doctors) && doctors.some((d: ApiDoctor) => d.specialization === specialization)) {
      //   return baseUrl;
      // }
    } catch {
      continue;
    }
  }
  return null;
};

interface DoctorsTableProps {
  darkMode: boolean;
}

const DoctorsTable: React.FC<DoctorsTableProps> = ({ darkMode }) => {
  const [searchId, setSearchId] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newDoctor, setNewDoctor] = useState<Omit<Doctor, 'id'>>({
    name: '',
    specialization: '',
    mail: null,
    phone: '',
    shift: null,
    available: true,
    ad_id: null
  });

  // Fetch doctors from all backend URLs in parallel
  const fetchDoctors = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const fetchPromises = SPECIALIZATIONS_URLS.map(async (baseUrl) => {
        try {
          const response = await fetch(`${baseUrl}/api/dbdoctor-available`);
          if (!response.ok) throw new Error();
          const data = await response.json();
          if (!Array.isArray(data)) throw new Error();
          return data;
        } catch {
          return [];
        }
      });
      const results = await Promise.all(fetchPromises);
      const allDoctors: Doctor[] = results.flat().map((item: ApiDoctor) => ({
        id: item.D_ID,
        name: item.name,
        specialization: item.specialization,
        mail: item.mail,
        phone: item.phone,
        shift: item.shift,
        available: item.available,
        ad_id: item.ad_id
      }));
      setDoctors(allDoctors);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // const addDoctor = async (doctor: Omit<Doctor, 'id'>): Promise<Doctor | undefined> => {
  //   try {
  //     setLoading(true);
      
  //     const response = await fetch('http://localhost:5000/api/dbdoctor-available', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         name: doctor.name,
  //         specialization: doctor.specialization,
  //         mail: doctor.mail,
  //         phone: doctor.phone,
  //         shift: doctor.shift,
  //         available: doctor.available,
  //         ad_id: doctor.ad_id
  //       })
  //     });
  //     if (!response.ok) throw new Error('Failed to add doctor');
  //     const responseData = await response.json();
  //     const newDoctorData = responseData.doctor || responseData;
  //     const newDoctorItem: Doctor = {
  //       id: newDoctorData.D_ID,
  //       name: newDoctorData.name,
  //       specialization: newDoctorData.specialization,
  //       mail: newDoctorData.mail,
  //       phone: newDoctorData.phone,
  //       shift: newDoctorData.shift,
  //       available: newDoctorData.available,
  //       ad_id: newDoctorData.ad_id
  //     };
  //     setDoctors(prevDoctors => [...prevDoctors, newDoctorItem]);
  //     return newDoctorItem;
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  //     setError(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const addDoctor = async (doctor: Omit<Doctor, 'id'>): Promise<void> => {
    try {
      setLoading(true);
      const baseUrl = await resolveBaseBySpecialization(doctor.specialization);
      if (!baseUrl) throw new Error("No service found for the specialization");

      const response = await fetch(`${baseUrl}/api/dbdoctor-available`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctor)
      });

      if (!response.ok) throw new Error('Failed to add doctor');
      const responseData = await response.json();
      const newDoctorData = responseData.doctor || responseData;
      const newDoctorItem: Doctor = {
        id: newDoctorData.D_ID,
        name: newDoctorData.name,
        specialization: newDoctorData.specialization,
        mail: newDoctorData.mail,
        phone: newDoctorData.phone,
        shift: newDoctorData.shift,
        available: newDoctorData.available,
        ad_id: newDoctorData.ad_id
      };
      setDoctors(prevDoctors => [...prevDoctors, newDoctorItem]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateDoctor = async (id: number, doctorData: Partial<Doctor>): Promise<Doctor | undefined> => {
    try {
      setLoading(true);
      if (!doctorData.specialization) throw new Error("Specialization is required for update");

      const baseUrl = await resolveBaseBySpecialization(doctorData.specialization);
      if (!baseUrl) throw new Error("No service found for the specialization");

      const response = await fetch(`${baseUrl}/api/dbdoctor-available/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: doctorData.name,
          specialization: doctorData.specialization,
          mail: doctorData.mail,
          phone: doctorData.phone,
          shift: doctorData.shift,
          available: doctorData.available !== undefined ? doctorData.available : true,
          ad_id: doctorData.ad_id
        })
      });
      if (!response.ok) {
        const updatedDoctor: Doctor = {
          id,
          name: doctorData.name || '',
          specialization: doctorData.specialization || '',
          mail: doctorData.mail,
          phone: doctorData.phone || '',
          shift: doctorData.shift,
          available: doctorData.available !== undefined ? doctorData.available : true,
          ad_id: doctorData.ad_id
        };
        setDoctors(prevDoctors => prevDoctors.map(d => d.id === id ? updatedDoctor : d));
        return updatedDoctor;
      }
      const responseData = await response.json();
      const updatedDoctorData = responseData.doctor || responseData;
      const updatedDoctor: Doctor = {
        id: updatedDoctorData.D_ID,
        name: updatedDoctorData.name,
        specialization: updatedDoctorData.specialization,
        mail: updatedDoctorData.mail,
        phone: updatedDoctorData.phone,
        shift: updatedDoctorData.shift,
        available: updatedDoctorData.available,
        ad_id: updatedDoctorData.ad_id
      };
      setDoctors(prevDoctors => prevDoctors.map(d => d.id === id ? updatedDoctor : d));
      return updatedDoctor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      const existingDoctor = doctors.find(d => d.id === id);
      if (existingDoctor) {
        const updatedDoctor = { ...existingDoctor, ...doctorData };
        setDoctors(prevDoctors => prevDoctors.map(d => d.id === id ? updatedDoctor : d));
        return updatedDoctor;
      }
    } finally {
      setLoading(false);
    }
  };
  
  // const updateDoctor = async (id: number, doctorData: Partial<Doctor>): Promise<void> => {
    // try {
    //   setLoading(true);
    //   if (!doctorData.specialization) throw new Error("Specialization is required for update");

    //   const baseUrl = await resolveBaseBySpecialization(doctorData.specialization);
    //   if (!baseUrl) throw new Error("No service found for the specialization");

    //   const response = await fetch(`${baseUrl}/api/dbdoctor-available/${id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(doctorData)
  //     });

  //     if (!response.ok) throw new Error('Update failed');
  //     const responseData = await response.json();
  //     const updatedDoctorData = responseData.doctor || responseData;
  //     const updatedDoctor: Doctor = {
  //       id: updatedDoctorData.D_ID,
  //       name: updatedDoctorData.name,
  //       specialization: updatedDoctorData.specialization,
  //       mail: updatedDoctorData.mail,
  //       phone: updatedDoctorData.phone,
  //       shift: updatedDoctorData.shift,
  //       available: updatedDoctorData.available,
  //       ad_id: updatedDoctorData.ad_id
  //     };
  //     setDoctors(prevDoctors => prevDoctors.map(d => d.id === id ? updatedDoctor : d));
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Unknown error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const deleteDoctor = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      const doctorToDelete = doctors.find(d => d.id === id);
      if (!doctorToDelete) throw new Error("Doctor not found");

      const baseUrl = await resolveBaseBySpecialization(doctorToDelete.specialization);
      if (!baseUrl) throw new Error("No service found for the specialization");

      const response = await fetch(`${baseUrl}/api/dbdoctor-available/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== id));
        return;
      }
      setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== id));
    } finally {
      setLoading(false);
    }
  };

  // Search logic - fixed to search by string ID or name
  const handleSearch = (): void => {
    if (searchId.trim() === '') {
      fetchDoctors();
    } else {
      const searchValue = searchId.trim().toLowerCase();
      setDoctors(prevDoctors =>
        prevDoctors.filter(d =>
          d.id.toString().toLowerCase().includes(searchValue) ||
          d.name.toLowerCase().includes(searchValue) ||
          d.specialization.toLowerCase().includes(searchValue)
        )
      );
    }
  };

  const handleRowClick = (doctor: Doctor): void => {
    setSelectedDoctor(doctor);
    setEditDoctor({ ...doctor });
    setEditMode(false);
    setViewDialogOpen(true);
  };

  const closeViewDialog = (): void => {
    setViewDialogOpen(false);
    setSelectedDoctor(null);
    setEditMode(false);
    setEditDoctor(null);
  };

  const handleEdit = (): void => {
    setEditMode(true);
  };

  const handleInputChange = (name: keyof Doctor, value: any): void => {
    if (!editDoctor) return;
    setEditDoctor({
      ...editDoctor,
      [name]: value,
    });
  };

  const isChanged = (): boolean => {
    if (!selectedDoctor || !editDoctor) return false;
    return (
      selectedDoctor.name !== editDoctor.name ||
      selectedDoctor.specialization !== editDoctor.specialization ||
      selectedDoctor.mail !== editDoctor.mail ||
      selectedDoctor.phone !== editDoctor.phone ||
      selectedDoctor.shift !== editDoctor.shift ||
      selectedDoctor.available !== editDoctor.available ||
      selectedDoctor.ad_id !== editDoctor.ad_id
    );
  };

  const handleSave = async (): Promise<void> => {
    if (!editDoctor) return;
    try {
      const updated = await updateDoctor(editDoctor.id, editDoctor);
      if (updated) {
        setSelectedDoctor(updated);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Failed to save doctor:', error);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!editDoctor) return;
    try {
      await deleteDoctor(editDoctor.id);
      closeViewDialog();
    } catch (error) {
      console.error('Failed to delete doctor:', error);
    }
  };

  const openAddDialog = (): void => {
    setAddDialogOpen(true);
    setNewDoctor({
      name: '',
      specialization: '',
      mail: null,
      phone: '',
      shift: null,
      available: true,
      ad_id: null
    });
  };

  const handleNewDoctorChange = (name: keyof Omit<Doctor, 'id'>, value: any): void => {
    setNewDoctor(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDoctor = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await addDoctor(newDoctor);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add doctor:', error);
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
        <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
          Doctors
        </h2>
        <div className="text-center py-8">
          <p className="text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error && doctors.length === 0) {
    return (
      <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
        <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
          Doctors
        </h2>
        <div className="text-center py-8">
          <p className="text-lg text-red-500">Error: {error}</p>
          <Button
            onClick={fetchDoctors}
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
          Doctors
        </h2>
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Search by ID, name or specialization"
            value={searchId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
            className="w-64"
          />
          <Button
            onClick={handleSearch}
            variant="default"
          >
            Search
          </Button>
          <Button
            onClick={() => { setSearchId(''); fetchDoctors(); }}
            variant="secondary"
          >
            Reset
          </Button>
          <Button
            onClick={openAddDialog}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            Add Doctor
          </Button>
        </div>
      </div>

      {loading && doctors.length > 0 && <p className="text-center py-4">Refreshing doctors...</p>}
      {error && doctors.length > 0 && <p className="text-center py-4 text-red-500">Error: {error}</p>}

      {/* Table */}
      <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table>
            <TableHeader className={darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}>
              <TableRow>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>ID</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Name</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Specialization</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Phone</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={darkMode ? "bg-gray-900" : "bg-white"}>
              {doctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-400">No doctors found.</TableCell>
                </TableRow>
              ) : (
                doctors.map((doctor) => (
                  <TableRow
                    key={doctor.id}
                    className={`cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
                    onClick={() => handleRowClick(doctor)}
                  >
                    <TableCell>{doctor.id}</TableCell>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{doctor.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {doctor.available ? 'Available' : 'Unavailable'}
                      </span>
                    </TableCell>
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
            <DialogTitle>{editMode ? "Edit Doctor" : "Doctor Details"}</DialogTitle>
          </DialogHeader>
          {editMode ? (
            <form className="space-y-3" onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSave(); }}>
              <div>
                <Label className="font-semibold">ID:</Label>
                <Input
                  className="w-full bg-gray-100 cursor-not-allowed"
                  value={editDoctor?.id.toString() || ''}
                  readOnly
                />
              </div>
              <div>
                <Label className="font-semibold">Name:</Label>
                <Input
                  className="w-full"
                  value={editDoctor?.name || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="font-semibold">Specialization:</Label>
                <Input
                  className="w-full"
                  value={editDoctor?.specialization || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('specialization', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="font-semibold">Email:</Label>
                <Input
                  className="w-full"
                  value={editDoctor?.mail || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('mail', e.target.value || null)}
                />
              </div>
              <div>
                <Label className="font-semibold">Phone:</Label>
                <Input
                  className="w-full"
                  value={editDoctor?.phone || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="font-semibold">Shift:</Label>
                <Input
                  className="w-full"
                  value={editDoctor?.shift || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('shift', e.target.value || null)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label className="font-semibold">Available:</Label>
                <Switch
                  checked={editDoctor?.available || false}
                  onCheckedChange={(checked: boolean) => handleInputChange('available', checked)}
                />
                <span className="ml-2">{editDoctor?.available ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <Label className="font-semibold">Admin ID:</Label>
                <Input
                  className="w-full"
                  type="number"
                  value={editDoctor?.ad_id?.toString() || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value === '' ? null : parseInt(e.target.value);
                    handleInputChange('ad_id', value);
                  }}
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
                <p><strong>ID:</strong> {selectedDoctor?.id}</p>
                <p><strong>Name:</strong> {selectedDoctor?.name}</p>
                <p><strong>Specialization:</strong> {selectedDoctor?.specialization}</p>
                <p><strong>Email:</strong> {selectedDoctor?.mail || 'Not provided'}</p>
                <p><strong>Phone:</strong> {selectedDoctor?.phone}</p>
                <p><strong>Shift:</strong> {selectedDoctor?.shift || 'Not specified'}</p>
                <p><strong>Available:</strong> {selectedDoctor?.available ? 'Yes' : 'No'}</p>
                <p><strong>Admin ID:</strong> {selectedDoctor?.ad_id || 'Not assigned'}</p>
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

      {/* Add Doctor Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className={`sm:max-w-md ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}>
          <DialogHeader>
            <DialogTitle>Add Doctor</DialogTitle>
          </DialogHeader>
          <form className="space-y-3" onSubmit={handleAddDoctor}>
            <div>
              <Label className="font-semibold">Name:</Label>
              <Input
                className="w-full"
                value={newDoctor.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewDoctorChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="font-semibold">Specialization:</Label>
              <Input
                className="w-full"
                value={newDoctor.specialization}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewDoctorChange('specialization', e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="font-semibold">Email:</Label>
              <Input
                className="w-full"
                value={newDoctor.mail || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewDoctorChange('mail', e.target.value || null)}
              />
            </div>
            <div>
              <Label className="font-semibold">Phone:</Label>
              <Input
                className="w-full"
                value={newDoctor.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewDoctorChange('phone', e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="font-semibold">Shift:</Label>
              <Input
                className="w-full"
                value={newDoctor.shift || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewDoctorChange('shift', e.target.value || null)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="font-semibold">Available:</Label>
              <Switch
                checked={newDoctor.available}
                onCheckedChange={(checked: boolean) => handleNewDoctorChange('available', checked)}
              />
              <span className="ml-2">{newDoctor.available ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <Label className="font-semibold">Admin ID:</Label>
              <Input
                className="w-full"
                type="number"
                value={newDoctor.ad_id?.toString() || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value === '' ? null : parseInt(e.target.value);
                  handleNewDoctorChange('ad_id', value);
                }}
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

export default DoctorsTable;
