
/**
 * Authentication Service for handling API authentication
 */

// Base URL for Auth API - replace with your actual API endpoint
const AUTH_API_URL = 'http://localhost:7142';

/**
 * Login user with username and password
 * @param {string} username - User name
 * @param {string} password - User password
 * @returns {Promise} - Promise containing user data and token
 */
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/Account/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("responseData", responseData);

    // Store token in localStorage for future use
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("currentUser", JSON.stringify(responseData));
    
    return responseData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Validate authentication token
 * @param {string} token - JWT token
 * @returns {Promise} - Promise containing validation result
 */
export const validateToken = async (token) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/Account/validate-token`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Token validation failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Token validation error:", error);
    throw error;
  }
};

/**
 * Logout user
 * @param {string} token - JWT token
 * @returns {Promise} - Promise containing logout result
 */
export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Logout failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    // Even if API logout fails, we still want to clear local storage
    return { success: true };
  }
};




export const getMenuItems = async (token) => {
  try {

    const response = await fetch(`${AUTH_API_URL}/Admin/getSysMenu`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    
    if (!response.ok) {
      throw new Error(`Logout failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    // Even if API logout fails, we still want to clear local storage
    return { success: true };
  }
};





export const checkPermission = async (token,permission) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/Admin/getMenuAuth`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Permission":permission
      },
    });
    
    if (!response.ok) {
      throw new Error(`Logout failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    // Even if API logout fails, we still want to clear local storage
    return { success: true };
  }
};





/**
 * For development - Simulated authentication with role
 * @param {string} role - User role (admin, user, viewer)
 * @returns {Object} - Mock user data and token
 */
export const devAuthenticate = (role = 'user') => {
  // This is just for development/testing
  return {
    user: {
      id: 1,
      name: "Demo User",
      username: "testuser",
      role: role
    },
    token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJQUEMiLCJ1bmlxdWVfbmFtZSI6IlBQQyIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzQyODg2OTM0LCJleHAiOjE3NDI5NzMzMzQsImlhdCI6MTc0Mjg4NjkzNCwiaXNzIjoiTmV0QVBJIiwiYXVkIjoiQ1BTU3lzIn0.oaDhxHAhfUdiEyPtNv5aRRRp57pc2Le4E00CLZ67T48`,
    expiresIn: 3600
  };
};
