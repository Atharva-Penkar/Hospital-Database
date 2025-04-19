import React, { useState, useEffect } from 'react';

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// API response interface - what comes from your backend
interface ApiTest {
  T_ID: number;
  test_name: string;
}

// Component data interface - what your component uses
interface Test {
  id: number;  // Maps to T_ID in Prisma
  name: string; // Maps to test_name in Prisma
}

interface TestsTableProps {
  darkMode: boolean;
}

const TestsTable: React.FC<TestsTableProps> = ({ darkMode }) => {
  const [searchId, setSearchId] = useState<string>('');
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [editTest, setEditTest] = useState<Test | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newTest, setNewTest] = useState<Omit<Test, 'id'>>({
    name: '',
  });

  // Fetch tests from API when component mounts
  useEffect(() => {
    fetchTests();
  }, []);

  // API functions
  const fetchTests = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/dbtest-available');
      if (!response.ok) throw new Error('Failed to fetch tests');
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Type guard to ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }
      
      // Transform API data to match our component interface
      const transformedData: Test[] = data.map((item: ApiTest) => ({
        id: item.T_ID,
        name: item.test_name
      }));
      
      setTests(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTest = async (test: Omit<Test, 'id'>): Promise<Test | undefined> => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/dbtest-available', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_name: test.name })
      });
      
      if (!response.ok) throw new Error('Failed to add test');
      
      const responseData = await response.json();
      console.log('Add test response:', responseData);
      
      // If the response has nested data, ensure we extract it correctly
      const newTestData = responseData.test || responseData;
      
      // Convert API response to our component's format
      const newTestItem: Test = {
        id: newTestData.T_ID,
        name: newTestData.test_name
      };
      
      setTests(prevTests => [...prevTests, newTestItem]);
      return newTestItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error adding test:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTest = async (id: number, testData: Partial<Test>): Promise<Test | undefined> => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:5000/api/dbtest-available/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_name: testData.name })
      });
      
      if (!response.ok) {
        // If API isn't implemented yet, simulate the update locally
        const updatedTest: Test = { 
          id, 
          name: testData.name || '' 
        };
        
        setTests(prevTests => prevTests.map(t => t.id === id ? updatedTest : t));
        return updatedTest;
      }
      
      const responseData = await response.json();
      const updatedTestData = responseData.test || responseData;
      
      const updatedTest: Test = {
        id: updatedTestData.T_ID,
        name: updatedTestData.test_name
      };
      
      setTests(prevTests => prevTests.map(t => t.id === id ? updatedTest : t));
      return updatedTest;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error updating test:', err);
      
      // If the API fails, simulate update locally
      if (testData.name) {
        const updatedTest: Test = { id, name: testData.name };
        setTests(prevTests => prevTests.map(t => t.id === id ? updatedTest : t));
        return updatedTest;
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteTest = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:5000/api/dbtest-available/${id}`, {
        method: 'DELETE'
      });
      
      // If the API is not implemented yet, just do local deletion
      if (!response.ok) {
        setTests(prevTests => prevTests.filter(t => t.id !== id));
        return;
      }
      
      // If the API worked, still update local state
      setTests(prevTests => prevTests.filter(t => t.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting test:', err);
      
      // Even if API fails, update the UI
      setTests(prevTests => prevTests.filter(t => t.id !== id));
    } finally {
      setLoading(false);
    }
  };

  // Search logic - fixed to search by string ID
  const handleSearch = (): void => {
    if (searchId.trim() === '') {
      fetchTests();
    } else {
      const searchValue = searchId.trim().toLowerCase();
      setTests(prevTests => 
        prevTests.filter(t => 
          t.id.toString().toLowerCase().includes(searchValue) || 
          t.name.toLowerCase().includes(searchValue)
        )
      );
    }
  };

  // Row click: open dialog in view mode
  const handleRowClick = (test: Test): void => {
    setSelectedTest(test);
    setEditTest({...test}); // Make a copy to avoid reference issues
    setEditMode(false);
    setViewDialogOpen(true);
  };

  // Dialog close
  const closeViewDialog = (): void => {
    setViewDialogOpen(false);
    setSelectedTest(null);
    setEditMode(false);
    setEditTest(null);
  };

  // Edit mode
  const handleEdit = (): void => {
    setEditMode(true);
  };

  // Editing fields with type safety
  const handleInputChange = (name: keyof Test, value: any): void => {
    if (!editTest) return;
    setEditTest({
      ...editTest,
      [name]: value,
    });
  };

  // Detect changes for Save button
  const isChanged = (): boolean => {
    if (!selectedTest || !editTest) return false;
    return selectedTest.name !== editTest.name;
  };

  // Save edits
  const handleSave = async (): Promise<void> => {
    if (!editTest) return;
    try {
      const updated = await updateTest(editTest.id, editTest);
      if (updated) {
        setSelectedTest(updated);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Failed to save test:', error);
    }
  };

  // Delete test
  const handleDelete = async (): Promise<void> => {
    if (!editTest) return;
    try {
      await deleteTest(editTest.id);
      closeViewDialog();
    } catch (error) {
      console.error('Failed to delete test:', error);
    }
  };

  // Add Test Dialog
  const openAddDialog = (): void => {
    setAddDialogOpen(true);
    setNewTest({
      name: '',
    });
  };

  const handleNewTestChange = (name: keyof Omit<Test, 'id'>, value: string): void => {
    setNewTest(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTest = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await addTest(newTest);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add test:', error);
    }
  };

  // Loading state
  if (loading && tests.length === 0) {
    return (
      <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
        <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
          Tests Available
        </h2>
        <div className="text-center py-8">
          <p className="text-lg">Loading tests...</p>
        </div>
      </div>
    );
  }

  // Error state with no data
  if (error && tests.length === 0) {
    return (
      <div className={darkMode ? "bg-gray-900 text-blue-400 p-6" : "bg-white text-black p-6"}>
        <h2 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-800"}>
          Tests Available
        </h2>
        <div className="text-center py-8">
          <p className="text-lg text-red-500">Error: {error}</p>
          <Button 
            onClick={fetchTests}
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
          Tests Available
        </h2>
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Search by ID or name"
            value={searchId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
            className="w-40"
          />
          <Button 
            onClick={handleSearch}
            variant="default"
          >
            Search
          </Button>
          <Button 
            onClick={() => { setSearchId(''); fetchTests(); }}
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

      {/* Loading and Error States when data exists */}
      {loading && tests.length > 0 && <p className="text-center py-4">Refreshing tests...</p>}
      {error && tests.length > 0 && <p className="text-center py-4 text-red-500">Error: {error}</p>}

      {/* Table */}
      <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table>
            <TableHeader className={darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}>
              <TableRow>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>ID</TableHead>
                <TableHead className={darkMode ? "text-white" : "text-gray-800"}>Test Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={darkMode ? "bg-gray-900" : "bg-white"}>
              {tests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-6 text-gray-400">No tests found.</TableCell>
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
            <form className="space-y-3" onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSave(); }}>
              <div>
                <Label className="font-semibold">ID:</Label>
                <Input
                  className="w-full bg-gray-100 cursor-not-allowed"
                  value={editTest?.id.toString() || ''}
                  readOnly
                />
              </div>
              <div>
                <Label className="font-semibold">Name:</Label>
                <Input
                  className="w-full"
                  value={editTest?.name || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
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
                <p><strong>ID:</strong> {selectedTest?.id}</p>
                <p><strong>Name:</strong> {selectedTest?.name}</p>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewTestChange('name', e.target.value)}
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

export default TestsTable;
