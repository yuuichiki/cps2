
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

/**
 * Get CPS data from the server
 * @param {string} userId - User ID
 * @param {string} token - Authentication token
 * @returns {Promise} - Promise containing the CPS data
 */
export const getCpsData = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cp/getajaxcpdata?userid=${userId}&token=${token}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CPS data with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching CPS data:", error);
    throw error;
  }
};

/**
 * Get CPS state
 * @param {string} userId - User ID
 * @param {string} cpId - CP ID
 * @returns {Promise} - Promise containing the CPS state
 */
export const getCpsState = async (userId, cpId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cp/getCpsState?userid=${userId}&cpid=${cpId}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CPS state with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching CPS state:", error);
    throw error;
  }
};

/**
 * Insert new CPS data
 * @param {string} userId - User ID
 * @param {string} key - Key
 * @param {string} values - Values (JSON string)
 * @returns {Promise} - Promise containing the insertion result
 */
export const insertCps = async (userId, key, values) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cp/InsertCps?userid=${userId}&key=${key}&values=${values}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to insert CPS with status: ${response.status}`);
    }
    
    // Send SignalR message (this would need to be implemented separately)
    // sendSignalRMessage(userId, "InsertCPS");
    
    return await response.json();
  } catch (error) {
    console.error("Error inserting CPS:", error);
    throw error;
  }
};

/**
 * Update CPS data
 * @param {string} userId - User ID
 * @param {string} key - Key
 * @param {string} values - Values (JSON string)
 * @returns {Promise} - Promise containing the update result
 */
export const updateCps = async (userId, key, values) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cp/UpdateCps?userid=${userId}&key=${key}&values=${values}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update CPS with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating CPS:", error);
    throw error;
  }
};

/**
 * Update CPS state
 * @param {string} userId - User ID
 * @param {number} stateIndex - State index
 * @param {string} state - State
 * @param {string} cpId - CP ID
 * @returns {Promise} - Promise containing the update result
 */
export const updateCpsState = async (userId, stateIndex, state, cpId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cp/UpdateCpsState?userid=${userId}&stateIndex=${stateIndex}&state=${state}&cpid=${cpId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update CPS state with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating CPS state:", error);
    throw error;
  }
};

/**
 * Remove CPS data
 * @param {string} userId - User ID
 * @param {string} cpId - CP ID
 * @returns {Promise} - Promise containing the removal result
 */
export const removeCPS = async (userId, cpId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cp/RemoveCPS?userid=${userId}&cpid=${cpId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to remove CPS with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error removing CPS:", error);
    throw error;
  }
};

/**
 * Get log data
 * @param {string} userId - User ID
 * @param {string} cpId - CP ID
 * @returns {Promise} - Promise containing the log data
 */
export const getLog = async (userId, cpId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cp/getLog?userid=${userId}&cpid=${cpId}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch log with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching log:", error);
    throw error;
  }
};

/**
 * Request re-upload file
 * @param {string} userId - User ID
 * @param {string} cpId - CP ID
 * @returns {Promise} - Promise containing the request result
 */
export const requestReUploadFile = async (userId, cpId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cp/requestReUploadFileState?userid=${userId}&cpid=${cpId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to request re-upload with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error requesting re-upload:", error);
    throw error;
  }
};

/**
 * Confirm re-upload file
 * @param {string} userId - User ID
 * @param {string} cpId - CP ID
 * @param {boolean} confirm - Confirm flag
 * @returns {Promise} - Promise containing the confirmation result
 */
export const confirmReUploadFile = async (userId, cpId, confirm) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cp/confirmUploadFileState?userid=${userId}&cpid=${cpId}&confirm=${confirm}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to confirm re-upload with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error confirming re-upload:", error);
    throw error;
  }
};

/**
 * Upload file
 * @param {FormData} formData - Form data containing the file
 * @returns {Promise} - Promise containing the upload result
 */
export const uploadFile = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cp/uploadFile`, {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload file with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
