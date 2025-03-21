
/**
 * Authentication Service for handling API authentication
 */

// Base URL for Auth API - replace with your actual API endpoint
const AUTH_API_URL = "https://api.example.com/auth";

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise containing user data and token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    }
    
    return await response.json();
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
    const response = await fetch(`${AUTH_API_URL}/validate-token`, {
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

/**
 * For development - Simulated authentication
 * @returns {Object} - Mock user data and token
 */
export const devAuthenticate = () => {
  // This is just for development/testing
  return {
    user: {
      id: 1,
      name: "Demo User",
      email: "user@example.com",
      role: "user"
    },
    token: "mock-jwt-token-for-development-testing-only",
    expiresIn: 3600
  };
};
