
/**
 * Permission and role management utilities
 */
import { getRolesAndPermissions, getRoles } from '@/services/authService';

// Define application roles
export const DEFAULT_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
};

// Dynamic role permissions that will be populated from API
let dynamicRolePermissions = null;

// Default role permissions used as fallback if API fails
const DEFAULT_ROLE_PERMISSIONS = {
  [DEFAULT_ROLES.ADMIN]: [
    'view:dashboard',
  ],
  [DEFAULT_ROLES.USER]: [
    'view:dashboard',
  ],
  [DEFAULT_ROLES.VIEWER]: [
    'view:dashboard',
  ],
};

/**
 * Initialize role permissions from API data
 * @param {Array} rolesData - Roles and permissions data from API
 */
export const initializeRolePermissions = (rolesData) => {
  if (!rolesData || !Array.isArray(rolesData)) return;
  
  const permissions = {};
  
  rolesData.forEach(roleData => {
    if (roleData.role && Array.isArray(roleData.permissions)) {
      permissions[roleData.role] = roleData.permissions;
    }
  });
  
  dynamicRolePermissions = permissions;
  console.log('Role permissions initialized:', dynamicRolePermissions);
};

/**
 * Fetch and initialize role permissions from API
 * @param {string} token - JWT token
 */
export const fetchRolePermissions = async (token) => {
  try {
    const rolesData = await getRolesAndPermissions(token);
    initializeRolePermissions(rolesData);
    return rolesData;
  } catch (error) {
    console.error('Failed to fetch role permissions:', error);
    return null;
  }
};

/**
 * Get current role permissions
 * @returns {Object} - Role permissions mapping
 */
export const getRolePermissions = () => {
  return dynamicRolePermissions || DEFAULT_ROLE_PERMISSIONS;
};

// The static fallback menu items (will be used if API request fails)
export const STATIC_MENU_ITEMS = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    permission: 'view:dashboard',
  },
  {
    title: 'Excel Viewer',
    path: '/excel-viewer',
    icon: 'FileSpreadsheet',
    permission: 'view:reports',
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: 'BarChart',
    permission: 'view:reports',
  },
  {
    title: 'User Management',
    path: '/users',
    icon: 'Users',
    permission: 'view:users',
  },
  {
    title: 'Role Management',
    path: '/roles',
    icon: 'Shield',
    permission: 'view:roles',
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: 'Settings',
    permission: 'view:settings',
  },
];

/**
 * Check if user has the specific permission
 * @param {Object} user - Current user object with role property
 * @param {String} permission - Permission to check
 * @returns {Boolean} - Whether user has permission or not
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  var role = user.role.toLowerCase();
  const rolePermissions = getRolePermissions();
  const userPermissions = rolePermissions[role] || [];
  return userPermissions.includes(permission);
};

/**
 * Get menu items user has permission to see
 * @param {Object} user - Current user object with role property
 * @param {Array} menuItems - Array of menu items to filter
 * @returns {Array} - Filtered menu items based on user permissions
 */
export const getAuthorizedMenuItems = (user, menuItems = STATIC_MENU_ITEMS) => {
  if (!user) return [];
  return menuItems.filter(item => hasPermission(user, item.permission));
};

/**
 * Create a higher-order component for permission-based rendering
 * @param {Function} Component - Component to render if permitted
 * @param {String} permission - Required permission
 * @returns {Function} - Wrapped component that checks permissions
 */
export const withPermission = (Component, permission) => {
  return (props) => {
    const { user } = props;
    
    if (!hasPermission(user, permission)) {
      return null;
    }
    
    return Component(props);
  };
};

/**
 * Check if user has any of the CRUD permissions for a resource
 * @param {Object} user - Current user object with role property
 * @param {String} resource - Resource name (e.g., 'users', 'roles')
 * @returns {Object} - Object with boolean flags for each CRUD operation
 */
export const getCrudPermissions = (user, resource) => {
  return {
    canView: hasPermission(user, `view:${resource}`),
    canCreate: hasPermission(user, `create:${resource}`),
    canEdit: hasPermission(user, `edit:${resource}`),
    canDelete: hasPermission(user, `delete:${resource}`)
  };
};

/**
 * Generate a list of available actions based on user permissions
 * @param {Object} user - Current user object with role property
 * @param {String} resource - Resource name (e.g., 'users', 'roles')
 * @returns {Array} - Array of available actions
 */
export const getAvailableActions = (user, resource) => {
  const permissions = getCrudPermissions(user, resource);
  const actions = [];
  
  if (permissions.canView) actions.push('view');
  if (permissions.canCreate) actions.push('create');
  if (permissions.canEdit) actions.push('edit');
  if (permissions.canDelete) actions.push('delete');
  
  return actions;
};
