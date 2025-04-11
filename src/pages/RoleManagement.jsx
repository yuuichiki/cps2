
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { getCrudPermissions } from '@/utils/permissions';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, Shield, Loader2 } from 'lucide-react';
import { useRoleManagement } from '@/hooks/useRoleManagement';
import RoleTable from '@/components/role-management/RoleTable';
import CreateRoleDialog from '@/components/role-management/CreateRoleDialog';
import EditRoleDialog from '@/components/role-management/EditRoleDialog';
import DeleteRoleDialog from '@/components/role-management/DeleteRoleDialog';

const RoleManagement = () => {
  const { user } = useAuth();
  const permissions = getCrudPermissions(user, 'roles');
  
  const {
    roles,
    isLoadingRoles,
    rolesError,
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
    isLoadingPermissions,
  } = useRoleManagement();

  // Handle API error
  if (rolesError) {
    toast({
      variant: "destructive",
      title: "Error Loading Roles",
      description: rolesError.message || "An error occurred while loading roles.",
    });
  }

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
            <Button 
              onClick={() => {
                resetForm();
                setIsCreateDialogOpen(true);
              }}
              disabled={isLoadingRoles}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoadingRoles ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading roles...</span>
            </div>
          ) : (
            <RoleTable 
              roles={roles} 
              onEdit={openEditDialog} 
              onDelete={openDeleteDialog} 
            />
          )}

          {/* Dialogs */}
          <CreateRoleDialog
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            formData={formData}
            handleChange={handleChange}
            togglePermission={togglePermission}
            togglePermissionGroup={togglePermissionGroup}
            onCreateRole={handleCreateRole}
            isCreating={isCreating}
          />

          <EditRoleDialog
            isOpen={isEditDialogOpen && !!selectedRole}
            onOpenChange={setIsEditDialogOpen}
            formData={formData}
            handleChange={handleChange}
            togglePermission={togglePermission}
            togglePermissionGroup={togglePermissionGroup}
            onUpdateRole={handleUpdateRole}
            isUpdating={isUpdating}
            isLoadingPermissions={isLoadingPermissions}
          />

          <DeleteRoleDialog
            isOpen={isDeleteDialogOpen && !!selectedRole}
            onOpenChange={setIsDeleteDialogOpen}
            selectedRole={selectedRole}
            onDeleteRole={handleDeleteRole}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
