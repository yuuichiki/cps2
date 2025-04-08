
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { getCrudPermissions } from '@/utils/permissions';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2, Shield } from 'lucide-react';

// Group permissions by category for easier management
const PERMISSION_GROUPS = [
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
const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap(group => group.permissions);

const RoleManagement = () => {
  const { user } = useAuth();
  const permissions = getCrudPermissions(user, 'roles');
  
  // Sample role data (in a real app, this would come from API)
  const [roles, setRoles] = useState([
    { 
      id: 1, 
      name: 'Admin', 
      code: 'admin', 
      description: 'Full system access',
      permissions: ALL_PERMISSIONS.map(p => p.id)
    },
    { 
      id: 2, 
      name: 'Regular User', 
      code: 'user', 
      description: 'Standard user access',
      permissions: ['view:dashboard', 'upload:excel', 'edit:excel', 'export:excel', 'view:reports', 'view:users']
    },
    { 
      id: 3, 
      name: 'Viewer', 
      code: 'viewer', 
      description: 'Read-only access',
      permissions: ['view:dashboard', 'view:reports', 'export:excel']
    },
  ]);
  
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
      description: role.description,
      permissions: [...role.permissions],
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

    // In a real app, this would be an API call
    const newRole = {
      id: roles.length + 1,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      permissions: formData.permissions,
    };

    setRoles([...roles, newRole]);
    resetForm();
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Role Created",
      description: `Role ${newRole.name} was created successfully.`,
    });
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

    // In a real app, this would be an API call
    const updatedRoles = roles.map(r => {
      if (r.id === selectedRole.id) {
        return {
          ...r,
          name: formData.name,
          code: formData.code,
          description: formData.description,
          permissions: formData.permissions,
        };
      }
      return r;
    });

    setRoles(updatedRoles);
    resetForm();
    setIsEditDialogOpen(false);
    
    toast({
      title: "Role Updated",
      description: `Role ${formData.name} was updated successfully.`,
    });
  };

  // Delete a role
  const handleDeleteRole = () => {
    // In a real app, this would be an API call
    const filteredRoles = roles.filter(r => r.id !== selectedRole.id);
    setRoles(filteredRoles);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Role Deleted",
      description: `Role ${selectedRole.name} was deleted successfully.`,
    });
  };

  // Render permission checkboxes grouped by category
  const renderPermissionGroups = () => {
    return PERMISSION_GROUPS.map(group => (
      <div key={group.name} className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox 
            id={`group-${group.name}`}
            checked={group.permissions.every(p => formData.permissions.includes(p.id))}
            onCheckedChange={() => togglePermissionGroup(group.permissions)}
          />
          <Label htmlFor={`group-${group.name}`} className="font-semibold">{group.name}</Label>
        </div>
        <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
          {group.permissions.map(permission => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox 
                id={permission.id}
                checked={formData.permissions.includes(permission.id)}
                onCheckedChange={() => togglePermission(permission.id)}
              />
              <Label htmlFor={permission.id}>{permission.label}</Label>
            </div>
          ))}
        </div>
        <Separator className="mt-4" />
      </div>
    ));
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <Shield className="mr-2 h-6 w-6" />
              Role Management
            </CardTitle>
            <CardDescription>
              Define roles and permissions for access control
            </CardDescription>
          </div>
          
          {permissions.canCreate && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Role Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Role Code</Label>
                      <Input id="code" name="code" value={formData.code} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" value={formData.description} onChange={handleChange} />
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-4">Permissions</h3>
                    {renderPermissionGroups()}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreateRole}>Create Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                {(permissions.canEdit || permissions.canDelete) && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-1 py-0.5 rounded text-sm">{role.code}</code>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.length > 0 ? (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {role.permissions.length} permissions
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">No permissions</span>
                      )}
                    </div>
                  </TableCell>
                  {(permissions.canEdit || permissions.canDelete) && (
                    <TableCell className="text-right">
                      {permissions.canEdit && (
                        <Dialog open={isEditDialogOpen && selectedRole?.id === role.id} onOpenChange={(open) => !open && setIsEditDialogOpen(false)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(role)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Role</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Role Name</Label>
                                  <Input id="edit-name" name="name" value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-code">Role Code</Label>
                                  <Input id="edit-code" name="code" value={formData.code} onChange={handleChange} />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Input id="edit-description" name="description" value={formData.description} onChange={handleChange} />
                              </div>
                              <Separator />
                              <div>
                                <h3 className="text-lg font-medium mb-4">Permissions</h3>
                                {renderPermissionGroups()}
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button onClick={handleUpdateRole}>Update Role</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      {permissions.canDelete && (
                        <Dialog open={isDeleteDialogOpen && selectedRole?.id === role.id} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(role)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <p>Are you sure you want to delete role <strong>{selectedRole?.name}</strong>?</p>
                              <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button variant="destructive" onClick={handleDeleteRole}>Delete Role</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
