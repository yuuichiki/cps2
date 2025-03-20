
/**
 * API Service for handling Excel file uploads and processing
 */

// Base URL for API - replace with your actual API endpoint
const API_BASE_URL = "https://api.example.com";

/**
 * Upload an Excel file to the server
 * @param {File} file - The Excel file to upload
 * @returns {Promise} - Promise containing the processed data
 */
export const uploadExcelFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${API_BASE_URL}/upload-excel`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    
    // For now, let's simulate a response with multiple sheets as the API is not available
    // This is just for demo purposes and should be removed in production
    const simulatedResponse = {
      sheets: [
        {
          sheetName: "Sheet1",
          headers: ["Name", "Age", "City"],
          rows: [
            ["John", 30, "New York"],
            ["Alice", 25, "Boston"],
            ["Bob", 35, "Chicago"]
          ],
          totalRows: 3,
          totalColumns: 3
        },
        {
          sheetName: "Sheet2",
          headers: ["Product", "Price", "Quantity"],
          rows: [
            ["Laptop", 1200, 5],
            ["Phone", 800, 10],
            ["Tablet", 500, 8]
          ],
          totalRows: 3,
          totalColumns: 3
        }
      ],
      fileName: file.name,
      totalSheets: 2
    };
    
    return simulatedResponse;
  }
};

/**
 * Fetch processed Excel data from the server
 * @param {string} fileId - ID of the processed file
 * @returns {Promise} - Promise containing the processed data
 */
export const getProcessedExcelData = async (fileId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/excel-data/${fileId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching processed data:", error);
    throw error;
  }
};

/**
 * Process Excel data on the server
 * @param {Object} data - The Excel data to process
 * @returns {Promise} - Promise containing the processed result
 */
export const processExcelData = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/process-excel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Processing failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error processing data:", error);
    
    // For now, return the same data structure as we don't have an actual API
    // This should be removed in production
    return data;
  }
};
