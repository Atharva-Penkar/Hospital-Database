import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all tests
// export const getAllTestsAvailable = async (req: Request, res: Response) => {
//   console.log("[getAllTestsAvailable] Called");
//   try {
//     const tests = await prisma.testsAvailable.findMany();
//     console.log("[getAllTestsAvailable] Fetched tests:", tests);
//     return res.status(200).json({ tests });
//   } catch (err) {
//     console.error("[getAllTestsAvailable] Error fetching all tests:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
export const getAllTestsAvailable = async (req: Request, res: Response) => {
  console.log("[getAllTestsAvailable] Called");
  try {
    const tests = await prisma.testsAvailable.findMany();
    console.log("[getAllTestsAvailable] Fetched tests:", tests);
    
    // Return the array directly instead of wrapping it in an object
    return res.status(200).json(tests);
  } catch (err) {
    console.error("[getAllTestsAvailable] Error fetching all tests:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a test by ID
export const getTestAvailableById = async (req: Request, res: Response) => {
  console.log("[getTestAvailableById] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[getTestAvailableById] Invalid Test ID format:", id);
      return res.status(400).json({ message: "Invalid Test ID format" });
    }

    const test = await prisma.testsAvailable.findUnique({
      where: { T_ID: parsedId },
    });
    console.log("[getTestAvailableById] Fetched test:", test);

    if (!test) {
      console.log("[getTestAvailableById] Test not found for ID:", parsedId);
      return res.status(404).json({ message: "Test not found" });
    }

    return res.status(200).json({ test });
  } catch (err) {
    console.error("[getTestAvailableById] Error fetching test by ID:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// // Create a new test
// export const createTestAvailable = async (req: Request, res: Response) => {
//   console.log("[createTestAvailable] Called with body:", req.body);
//   try {
//     const { test_name } = req.body;
//     if (!test_name) {
//       console.log("[createTestAvailable] test_name is required");
//       return res.status(400).json({ message: "test_name is required" });
//     }

//     const newTest = await prisma.testsAvailable.create({
//       data: { test_name },
//     });
//     console.log("[createTestAvailable] Created new test:", newTest);

//     return res.status(201).json({ test: newTest });
//   } catch (err) {
//     console.error("[createTestAvailable] Error creating test:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


// export const createTestAvailable = async (req: Request, res: Response) => {
//   console.log("[createTestAvailable] Called with body:", req.body);
//   try {
//     const { test_name } = req.body;
    
//     // Validate test name is provided
//     if (!test_name || test_name.trim() === "") {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Test name is required" 
//       });
//     }

//     // Create a new test record
//     // T_ID is auto-incremented by the database
//     const newTest = await prisma.testsAvailable.create({
//       data: {
//         test_name: req.body.test_name
//         // Omit T_ID and let Prisma/PostgreSQL handle it
//       }
//     });

//     console.log("[createTestAvailable] Created new test:", newTest);
    
//     // Return success response with the created test
//     return res.status(201).json({
//       success: true,
//       message: "Test created successfully",
//       test: newTest
//     });
//   } catch (error) {
//     console.error("[createTestAvailable] Error creating test:", error);
//     if (error.code === 'P2002' && error.meta?.target?.includes('T_ID')) {
//       console.error('Unique constraint failed on T_ID. Trying with a new ID...');
      
//       // Find the highest existing T_ID
//       const maxRecord = await prisma.testsAvailable.findFirst({
//         orderBy: { T_ID: 'desc' }
//       });
      
//       const nextId = maxRecord ? maxRecord.T_ID + 1 : 1;
      
//       // Try again with explicit ID
//       const newTest = await prisma.testsAvailable.create({
//         data: {
//           T_ID: nextId,
//           test_name: req.body.test_name
//         }
//       });
//     // Check for unique constraint violation
//     // if (error.code === 'P2002') {
//     //   return res.status(409).json({
//     //     success: false,
//     //     message: "A test with this ID already exists"
//     //   });
//     // }
    
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   } finally {
//     // Uncomment the following line if you want to disconnect after each request
//     await prisma.$disconnect();
//   }
// };

export const createTestAvailable = async (req: Request, res: Response) => {
  console.log("[createTestAvailable] Called with body:", req.body);
  try {
    const { test_name } = req.body;
    console.log("[test_name ] :",test_name);
    // Validate test name is provided
    if (!test_name || test_name.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "Test name is required" 
      });
    }

    // Create a new test record
    // T_ID is auto-incremented by the database
    const newTest = await prisma.testsAvailable.create({
      data: {
        test_name: test_name
      }
    });

    console.log("[createTestAvailable] Created new test:", newTest);

    // Return success response with the created test
    return res.status(201).json({
      success: true,
      message: "Test created successfully",
      test: newTest
    });
  } catch (error: any) {
    console.error("[createTestAvailable] Error creating test:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('T_ID')) {
      console.error('Unique constraint failed on T_ID. Trying with a new ID...');
      
      try {
        // Find the highest existing T_ID
        const maxRecord = await prisma.testsAvailable.findFirst({
          orderBy: { T_ID: 'desc' }
        });
        
        const nextId = maxRecord ? maxRecord.T_ID + 1 : 1;
        const { new_test } = req.body;
        console.log("[checking info] test_name :",req.body);
        console.log("[checking info] test_name :",new_test);
        // Try again with explicit ID
        const newTest = await prisma.testsAvailable.create({
          data: {
            T_ID: nextId,
            test_name: new_test
          }
        });
        
        console.log("[createTestAvailable] Created new test with explicit ID:", newTest);
        
        // Return success response if the retry worked
        return res.status(201).json({
          success: true,
          message: "Test created successfully with explicit ID",
          test: newTest
        });
      } catch (retryError) {
        console.error("[createTestAvailable] Error on retry:", retryError);
        return res.status(500).json({
          success: false,
          message: "Failed to create test even with explicit ID"
        });
      }
    }
    
    // Handle other types of errors
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  } finally {
    // Disconnect Prisma client after the operation
    await prisma.$disconnect();
  }
};

// Update a test by ID
export const updateTestAvailable = async (req: Request, res: Response) => {
  console.log("[updateTestAvailable] Called with params:", req.params, "and body:", req.body);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const { test_name } = req.body;

    if (!id || isNaN(parsedId)) {
      console.log("[updateTestAvailable] Invalid Test ID format:", id);
      return res.status(400).json({ message: "Invalid Test ID format" });
    }
    if (!test_name) {
      console.log("[updateTestAvailable] test_name is required");
      return res.status(400).json({ message: "test_name is required" });
    }

    const updatedTest = await prisma.testsAvailable.update({
      where: { T_ID: parsedId },
      data: { test_name },
    });
    console.log("[updateTestAvailable] Updated test:", updatedTest);

    return res.status(200).json({ test: updatedTest });
  } catch (err: any) {
    console.error("[updateTestAvailable] Error updating test:", err);
    if (err.code === "P2025") {
      console.log("[updateTestAvailable] Test not found for update, ID:", req.params.id);
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a test by ID
export const deleteTestAvailable = async (req: Request, res: Response) => {
  console.log("[deleteTestAvailable] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[deleteTestAvailable] Invalid Test ID format:", id);
      return res.status(400).json({ message: "Invalid Test ID format" });
    }

    await prisma.testsAvailable.delete({
      where: { T_ID: parsedId },
    });
    console.log("[deleteTestAvailable] Deleted test with ID:", parsedId);

    return res.status(204).send();
  } catch (err: any) {
    console.error("[deleteTestAvailable] Error deleting test:", err);
    if (err.code === "P2025") {
      console.log("[deleteTestAvailable] Test not found for delete, ID:", req.params.id);
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
