import React, { useState } from 'react';

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
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

  // Row click: open dialog in view mode
  const handleRowClick = (test: Test) => {
    setSelectedTest(test);
    setEditTest(test);
    setEditMode(false);
    setViewDialogOpen(true);
  };

  // Dialog close
  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedTest(null);
    setEditMode(false);
    setEditTest(null);
  };

  // Edit mode
  const handleEdit = () => {
    setEditMode(true);
  };

  // Editing fields
  const handleInputChange = (name: string, value: any) => {
    if (!editTest) return;
    setEditTest({
      ...editTest,
      [name]: value,
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
    closeViewDialog();
  };

  // Add Test Dialog
  const openAddDialog = () => {
    setAddDialogOpen(true);
    setNewTest({
      name: '',
      category: '',
      price: 0,
      duration: '',
      requiresFasting: false,
      availability: 'Available',
    });
  };

  const handleNewTestChange = (name: string, value: any) => {
    setNewTest(prev => ({
      ...prev,
      [name]: value,
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
    setAddDialogOpen(false);
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
      {/* Top Bar with Search and Add */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
          Tests Available
        </h2>
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            className="w-40"
          />
          <Button 
            onClick={handleSearch}
            variant="default"
          >
            Search
          </Button>
          <Button 
            onClick={() => { setSearchId(''); setTests(sampleTests); }}
            variant="secondary"
          >
            Reset
          </Button>
          <Button 
            onClick={openAddDialog}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            Add Test
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table>
            <TableHeader className={darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}>
              <TableRow>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>ID</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Test Name</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Category</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Price</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Duration</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Fasting Required</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={darkMode ? "bg-gray-900" : "bg-white"}>
              {tests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-400">No tests found.</TableCell>
                </TableRow>
              ) : (
                tests.map((test) => (
                  <TableRow
                    key={test.id}
                    className={`cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
                    onClick={() => handleRowClick(test)}
                  >
                    <TableCell>{test.id}</TableCell>
                    <TableCell>{test.name}</TableCell>
                    <TableCell>{test.category}</TableCell>
                    <TableCell>${test.price}</TableCell>
                    <TableCell>{test.duration}</TableCell>
                    <TableCell>{test.requiresFasting ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                    <Badge 
                        variant={
                            test.availability === 'Available' ? 'default' : 
                            test.availability === 'Limited' ? 'secondary' : 
                            'destructive'
                            }
                            className={test.availability === 'Limited' ? 'bg-yellow-500 hover:bg-yellow-700 text-white' : ''}
                        >
                    {test.availability}
                    </Badge>
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
            <DialogTitle>{editMode ? "Edit Test" : "Test Details"}</DialogTitle>
          </DialogHeader>
          
          {editMode ? (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div>
                <Label className="font-semibold">ID:</Label>
                <Input
                  className="w-full bg-gray-100 cursor-not-allowed"
                  value={editTest?.id || ''}
                  readOnly
                />
              </div>
              <div>
                <Label className="font-semibold">Name:</Label>
                <Input
                  className="w-full"
                  value={editTest?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label className="font-semibold">Category:</Label>
                <Input
                  className="w-full"
                  value={editTest?.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
              </div>
              <div>
                <Label className="font-semibold">Price:</Label>
                <Input
                  className="w-full"
                  type="number"
                  value={editTest?.price || 0}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="font-semibold">Duration:</Label>
                <Input
                  className="w-full"
                  value={editTest?.duration || ''}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label className="font-semibold">Fasting Required:</Label>
                <Checkbox
                  checked={editTest?.requiresFasting || false}
                  onCheckedChange={(checked) => handleInputChange('requiresFasting', !!checked)}
                />
              </div>
              <div>
                <Label className="font-semibold">Availability:</Label>
                <Select 
                  value={editTest?.availability} 
                  onValueChange={(value) => handleInputChange('availability', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Limited">Limited</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
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
                <p><strong>ID:</strong> {selectedTest?.id}</p>
                <p><strong>Name:</strong> {selectedTest?.name}</p>
                <p><strong>Category:</strong> {selectedTest?.category}</p>
                <p><strong>Price:</strong> ${selectedTest?.price}</p>
                <p><strong>Duration:</strong> {selectedTest?.duration}</p>
                <p><strong>Fasting Required:</strong> {selectedTest?.requiresFasting ? 'Yes' : 'No'}</p>
                <p><strong>Availability:</strong> {selectedTest?.availability}</p>
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

      {/* Add Test Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className={`sm:max-w-md ${darkMode ? "bg-gray-800 text-blue-200" : "bg-white"}`}>
          <DialogHeader>
            <DialogTitle>Add Test</DialogTitle>
          </DialogHeader>
          
          <form className="space-y-3" onSubmit={handleAddTest}>
            <div>
              <Label className="font-semibold">Name:</Label>
              <Input
                className="w-full"
                value={newTest.name}
                onChange={(e) => handleNewTestChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="font-semibold">Category:</Label>
              <Input
                className="w-full"
                value={newTest.category}
                onChange={(e) => handleNewTestChange('category', e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="font-semibold">Price:</Label>
              <Input
                className="w-full"
                type="number"
                value={newTest.price}
                onChange={(e) => handleNewTestChange('price', Number(e.target.value))}
                required
                min={0}
              />
            </div>
            <div>
              <Label className="font-semibold">Duration:</Label>
              <Input
                className="w-full"
                value={newTest.duration}
                onChange={(e) => handleNewTestChange('duration', e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="font-semibold">Fasting Required:</Label>
              <Checkbox
                checked={newTest.requiresFasting}
                onCheckedChange={(checked) => handleNewTestChange('requiresFasting', !!checked)}
              />
            </div>
            <div>
              <Label className="font-semibold">Availability:</Label>
              <Select 
                defaultValue={newTest.availability} 
                onValueChange={(value) => handleNewTestChange('availability', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Limited">Limited</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
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

export default TestsTable;
