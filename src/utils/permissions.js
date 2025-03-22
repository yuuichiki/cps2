
/**
 * Permission and role management utilities
 */

// Define application roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
};

// Define permissions by role
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'view:dashboard',
    'view:settings',
    'upload:excel',
    'edit:excel',
    'delete:excel',
    'export:excel',
    'manage:users',
    'view:reports',
    // Role CRUD permissions
    'view:roles',
    'create:roles',
    'edit:roles',
    'delete:roles',
    // User CRUD permissions
    'view:users',
    'create:users',
    'edit:users',
    'delete:users',
  ],
  [ROLES.USER]: [
    'view:dashboard',
    'upload:excel',
    'edit:excel',
    'export:excel',
    'view:reports',
    // Limited user permissions
    'view:users',
  ],
  [ROLES.VIEWER]: [
    'view:dashboard',
    'view:reports',
    'export:excel',
  ],
};

// Define menu items with their required permissions
export const MENU_ITEMS = [
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
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
};

/**
 * Get menu items user has permission to see
 * @param {Object} user - Current user object with role property
 * @returns {Array} - Filtered menu items based on user permissions
 */
export const getAuthorizedMenuItems = (user) => {
  if (!user) return [];
  
  return MENU_ITEMS.filter(item => hasPermission(user, item.permission));
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
