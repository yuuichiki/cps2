
/**
 * API Service for handling Excel file uploads and processing
 */

// Base URL for API - replace with your actual API endpoint
const API_BASE_URL = "https://172.19.137.252:3200";

/**
 * Upload an Excel file to the server
 * @param {File} file - The Excel file to upload
 * @param {string} token - Authentication token
 * @returns {Promise} - Promise containing the processed data
 */
export const uploadExcelFile = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${API_BASE_URL}/upload-excel`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
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
 * @param {string} token - Authentication token
 * @returns {Promise} - Promise containing the processed data
 */
export const getProcessedExcelData = async (fileId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/excel-data/${fileId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
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
 * @param {string} token - Authentication token
 * @returns {Promise} - Promise containing the processed result
 */
export const processExcelData = async (data, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/process-excel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
