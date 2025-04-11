import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { 
  getAllRoles, 
  createRole, 
  updateRole, 
  deleteRole, 
  updateRolePermissions,
  getRolePermissions
} from '@/services/roleService';

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
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  const { 
    data: roles = [],
    isLoading: isLoadingRoles,
    error: rolesError,
    refetch: refetchRoles
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getAllRoles(token),
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePermission = (permissionId) => {
    setFormData(prev => {
      const updatedPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId];
      
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const togglePermissionGroup = (groupPermissions) => {
    const permissionIds = groupPermissions.map(p => p.id);
    const allChecked = permissionIds.every(id => formData.permissions.includes(id));
    
    setFormData(prev => {
      let updatedPermissions;
      
      if (allChecked) {
        updatedPermissions = prev.permissions.filter(id => !permissionIds.includes(id));
      } else {
        const permissionsToAdd = permissionIds.filter(id => !prev.permissions.includes(id));
        updatedPermissions = [...prev.permissions, ...permissionsToAdd];
      }
      
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      permissions: [],
    });
    setSelectedRole(null);
  };

  const openEditDialog = async (role) => {
    setSelectedRole(role);
    
    setFormData({
      name: role.name,
      code: role.code,
      description: role.description || '',
      permissions: [],
    });
    
    setIsLoadingPermissions(true);
    try {
      const permissions = await getRolePermissions(token, role.id);
      setFormData(prev => ({
        ...prev,
        permissions: permissions || []
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Loading Permissions",
        description: "Failed to load role permissions. Please try again.",
      });
      console.error("Error fetching role permissions:", error);
    } finally {
      setIsLoadingPermissions(false);
    }
    
    setIsEditDialogOpen(true);
  };

  const handleCreateRole = () => {
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

  const handleUpdateRole = () => {
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
    
    if (selectedRole && selectedRole.permissions !== formData.permissions) {
      updateRolePermissionsMutation({ roleId: selectedRole.id, permissions: formData.permissions });
    }
  };

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
    isLoadingPermissions,
  };
};
