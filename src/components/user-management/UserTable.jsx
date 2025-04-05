
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Loader2 } from 'lucide-react';

const UserTable = ({ 
  users, 
  isLoading, 
  permissions,
  openEditDialog,
  openDeleteDialog,
  selectedUser,
  isEditDialogOpen,
  isDeleteDialogOpen,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
  children
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          {(permissions.canEdit || permissions.canDelete) && (
            <TableHead className="text-right">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={(permissions.canEdit || permissions.canDelete) ? 5 : 4} className="text-center py-8 text-muted-foreground">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </TableCell>
              {(permissions.canEdit || permissions.canDelete) && (
                <TableCell className="text-right">
                  {permissions.canEdit && (
                    <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => !open && setIsEditDialogOpen(false)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {/* Edit dialog content is passed as children */}
                    </Dialog>
                  )}
                  
                  {permissions.canDelete && (
                    <Dialog open={isDeleteDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(user)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </DialogTrigger>
                      {/* Delete dialog content is passed as children */}
                    </Dialog>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UserTable;
