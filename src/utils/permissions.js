
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
  ],
  [ROLES.USER]: [
    'view:dashboard',
    'upload:excel',
    'edit:excel',
    'export:excel',
    'view:reports',
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
    permission: 'manage:users',
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
    
    return <Component {...props} />;
  };
};
