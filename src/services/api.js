
/**
 * API Service for handling Excel file uploads and processing
 */

// Base URL for API - replace with your actual API endpoint
const API_BASE_URL = "http://localhost:7142";

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
    
    const response = await fetch(`${API_BASE_URL}/cp/upload-excel`, {
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
    const response = await fetch(`${API_BASE_URL}/cp/excel-data/${fileId}`, {
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
    const response = await fetch(`${API_BASE_URL}/cp/process-excel`, {
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
