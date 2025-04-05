
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { getCrudPermissions } from '@/utils/permissions';
import { Users } from 'lucide-react';

import UserTable from '@/components/user-management/UserTable';
import CreateUserDialog from '@/components/user-management/CreateUserDialog';
import EditUserDialog from '@/components/user-management/EditUserDialog';
import DeleteUserDialog from '@/components/user-management/DeleteUserDialog';
import { useUserManagement } from '@/components/user-management/useUserManagement';

const UserManagement = () => {
  const { user } = useAuth();
  const permissions = getCrudPermissions(user, 'users');
  
  const {
    users,
    isLoading,
    error,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedUser,
    formData,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    handleChange,
    handleRoleChange,
    resetForm,
    openEditDialog,
    openDeleteDialog,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useUserManagement();

  // Handle API errors
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p>Error loading users: {error.message || "Unknown error"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <Users className="mr-2 h-6 w-6" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage user accounts and assign roles
            </CardDescription>
          </div>
          
          {permissions.canCreate && (
            <CreateUserDialog 
              isOpen={isCreateDialogOpen}
              setIsOpen={setIsCreateDialogOpen}
              formData={formData}
              handleChange={handleChange}
              handleRoleChange={handleRoleChange}
              handleCreateUser={handleCreateUser}
              isSubmitting={createUserMutation.isPending}
              resetForm={resetForm}
            />
          )}
        </CardHeader>
        <CardContent>
          <UserTable 
            users={users}
            isLoading={isLoading}
            permissions={permissions}
            openEditDialog={openEditDialog}
            openDeleteDialog={openDeleteDialog}
            selectedUser={selectedUser}
            isEditDialogOpen={isEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
          
          {/* These dialogs will be placed by the Dialog when triggered */}
          {selectedUser && (
            <>
              <EditUserDialog 
                formData={formData}
                handleChange={handleChange}
                handleRoleChange={handleRoleChange}
                handleUpdateUser={handleUpdateUser}
                isSubmitting={updateUserMutation.isPending}
              />
              
              <DeleteUserDialog 
                selectedUser={selectedUser}
                handleDeleteUser={handleDeleteUser}
                isSubmitting={deleteUserMutation.isPending}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
