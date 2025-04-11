
import { toast } from '@/components/ui/use-toast';

// Base URL for Auth API - replace with your actual API endpoint
const AUTH_API_URL = 'http://localhost:7142';

/**
 * Get all roles from the API
 * @param {string} token - JWT token
 * @returns {Promise} - Promise containing roles data
 */
export const getAllRoles = async (token) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/Admin/getSysRoles`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch roles with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

/**
 * Get role permissions from the API
 * @param {string} token - JWT token
 * @param {string} roleId - Role ID to get permissions for
 * @returns {Promise} - Promise containing role permissions data
 */
export const getRolePermissions = async (token, roleId) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/Admin/getSysRolePermissions?roleId=${roleId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch role permissions with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    throw error;
  }
};

/**
 * Create a new role
 * @param {string} token - JWT token
 * @param {object} roleData - Role data to create
 * @returns {Promise} - Promise containing created role data
 */
export const createRole = async (token, roleData) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/Admin/createSysRole`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(roleData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create role with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};

/**
 * Update an existing role
 * @param {string} token - JWT token
 * @param {string} roleId - Role ID to update
 * @param {object} roleData - Updated role data
 * @returns {Promise} - Promise containing updated role data
 */
export const updateRole = async (token, roleId, roleData) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/Admin/updateSysRole/${roleId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(roleData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update role with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

/**
 * Delete a role
 * @param {string} token - JWT token
 * @param {string} roleId - Role ID to delete
 * @returns {Promise} - Promise containing deletion result
 */
export const deleteRole = async (token, roleId) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/Admin/deleteSysRole/${roleId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete role with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

/**
 * Update role permissions
 * @param {string} token - JWT token
 * @param {string} roleId - Role ID
 * @param {Array} permissions - Array of permission strings
 * @returns {Promise} - Promise containing update result
 */
export const updateRolePermissions = async (token, roleId, permissions) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/Admin/updateSysRolePermissions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        roleId,
        permissions
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update role permissions with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating role permissions:", error);
    throw error;
  }
};
