
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { 
  getAllRoles, 
  createRole, 
  updateRole, 
  deleteRole, 
  updateRolePermissions 
} from '@/services/roleService';

// Group permissions by category for easier management
export const PERMISSION_GROUPS = [
  {
    name: 'Dashboard',
    permissions: [
      { id: 'view:dashboard', label: 'View Dashboard' },
    ]
  },
  {
    name: 'Excel Management',
    permissions: [
      { id: 'upload:excel', label: 'Upload Excel Files' },
      { id: 'edit:excel', label: 'Edit Excel Files' },
      { id: 'delete:excel', label: 'Delete Excel Files' },
      { id: 'export:excel', label: 'Export Excel Files' },
      { id: 'view:reports', label: 'View Reports' },
    ]
  },
  {
    name: 'User Management',
    permissions: [
      { id: 'view:users', label: 'View Users' },
      { id: 'create:users', label: 'Create Users' },
      { id: 'edit:users', label: 'Edit Users' },
      { id: 'delete:users', label: 'Delete Users' },
    ]
  },
  {
    name: 'Role Management',
    permissions: [
      { id: 'view:roles', label: 'View Roles' },
      { id: 'create:roles', label: 'Create Roles' },
      { id: 'edit:roles', label: 'Edit Roles' },
      { id: 'delete:roles', label: 'Delete Roles' },
    ]
  },
  {
    name: 'Settings',
    permissions: [
      { id: 'view:settings', label: 'View Settings' },
    ]
  },
];

// Get a flat list of all permissions
export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap(group => group.permissions);

export const useRoleManagement = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    permissions: [],
  });

  // Fetch all roles
  const { 
    data: roles = [],
    isLoading: isLoadingRoles,
    error: rolesError,
    refetch: refetchRoles
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getAllRoles(token),
  });

  // Create role mutation
  const { mutate: createRoleMutation, isPending: isCreating } = useMutation({
    mutationFn: (data) => createRole(token, data),
    onSuccess: () => {
      toast({
        title: "Role Created",
        description: `Role ${formData.name} was created successfully.`,
      });
      resetForm();
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Creating Role",
        description: error.message || "An error occurred while creating the role.",
      });
    }
  });

  // Update role mutation
  const { mutate: updateRoleMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ roleId, data }) => updateRole(token, roleId, data),
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: `Role ${formData.name} was updated successfully.`,
      });
      resetForm();
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Updating Role",
        description: error.message || "An error occurred while updating the role.",
      });
    }
  });

  // Delete role mutation
  const { mutate: deleteRoleMutation, isPending: isDeleting } = useMutation({
    mutationFn: (roleId) => deleteRole(token, roleId),
    onSuccess: () => {
      toast({
        title: "Role Deleted",
        description: `Role ${selectedRole.name} was deleted successfully.`,
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Deleting Role",
        description: error.message || "An error occurred while deleting the role.",
      });
    }
  });

  // Update role permissions mutation
  const { mutate: updateRolePermissionsMutation, isPending: isUpdatingPermissions } = useMutation({
    mutationFn: ({ roleId, permissions }) => updateRolePermissions(token, roleId, permissions),
    onSuccess: () => {
      toast({
        title: "Permissions Updated",
        description: "Role permissions were updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Updating Permissions",
        description: error.message || "An error occurred while updating permissions.",
      });
    }
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle permission selection
  const togglePermission = (permissionId) => {
    setFormData(prev => {
      const updatedPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId];
      
      return { ...prev, permissions: updatedPermissions };
    });
  };

  // Toggle all permissions in a group
  const togglePermissionGroup = (groupPermissions) => {
    const permissionIds = groupPermissions.map(p => p.id);
    const allChecked = permissionIds.every(id => formData.permissions.includes(id));
    
    setFormData(prev => {
      let updatedPermissions;
      
      if (allChecked) {
        // Remove all permissions in this group
        updatedPermissions = prev.permissions.filter(id => !permissionIds.includes(id));
      } else {
        // Add all permissions in this group
        const permissionsToAdd = permissionIds.filter(id => !prev.permissions.includes(id));
        updatedPermissions = [...prev.permissions, ...permissionsToAdd];
      }
      
      return { ...prev, permissions: updatedPermissions };
    });
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      permissions: [],
    });
    setSelectedRole(null);
  };

  // Open edit dialog with role data
  const openEditDialog = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      code: role.code,
      description: role.description || '',
      permissions: role.permissions || [],
    });
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  // Create a new role
  const handleCreateRole = () => {
    // Validation
    if (!formData.name || !formData.code) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all required fields.",
      });
      return;
    }

    const roleData = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
    };

    createRoleMutation(roleData);
  };

  // Update an existing role
  const handleUpdateRole = () => {
    // Validation
    if (!formData.name || !formData.code) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all required fields.",
      });
      return;
    }

    const roleData = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
    };

    updateRoleMutation({ roleId: selectedRole.id, data: roleData });
    
    // Update permissions separately
    if (selectedRole && selectedRole.permissions !== formData.permissions) {
      updateRolePermissionsMutation({ roleId: selectedRole.id, permissions: formData.permissions });
    }
  };

  // Delete a role
  const handleDeleteRole = () => {
    if (!selectedRole || !selectedRole.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No role selected for deletion.",
      });
      return;
    }
    
    deleteRoleMutation(selectedRole.id);
  };

  return {
    roles,
    isLoadingRoles,
    rolesError,
    refetchRoles,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedRole,
    formData,
    handleChange,
    togglePermission,
    togglePermissionGroup,
    resetForm,
    openEditDialog,
    openDeleteDialog,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    isCreating,
    isUpdating,
    isDeleting,
    isUpdatingPermissions,
  };
};
