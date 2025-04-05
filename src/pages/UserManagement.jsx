
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@/contexts/AuthContext';
import { getCrudPermissions, ROLES } from '@/utils/permissions';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2, Users, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/userService';

const UserManagement = () => {
  const { user } = useAuth();
  const permissions = getCrudPermissions(user, 'users');
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    role: 'user',
    password: '',
  });

  // Fetch users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "User Created",
        description: `User ${formData.name} was created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Creating User",
        description: error.message || "An error occurred while creating the user.",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "User Updated",
        description: `User ${formData.name} was updated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Updating User",
        description: error.message || "An error occurred while updating the user.",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "User Deleted",
        description: `User ${selectedUser?.name} was deleted successfully.`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Deleting User",
        description: error.message || "An error occurred while deleting the user.",
      });
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle role selection
  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      email: '',
      role: 'user',
      password: '',
    });
    setSelectedUser(null);
  };

  // Open edit dialog with user data
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      password: '', // Don't populate password on edit
    });
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Create a new user
  const handleCreateUser = () => {
    // Validation
    if (!formData.username || !formData.name || !formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all required fields.",
      });
      return;
    }

    // Send create request
    createUserMutation.mutate(formData);
  };

  // Update an existing user
  const handleUpdateUser = () => {
    // Validation
    if (!formData.username || !formData.name || !formData.email) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all required fields.",
      });
      return;
    }

    // Send update request
    updateUserMutation.mutate({ 
      userId: selectedUser.id, 
      userData: formData 
    });
  };

  // Delete a user
  const handleDeleteUser = () => {
    if (selectedUser?.id) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  // Handle API errors
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p>Error loading users: {error.message || "Unknown error"}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
              >
                Retry
              </Button>
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
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={formData.username} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                        <SelectItem value={ROLES.USER}>User</SelectItem>
                        <SelectItem value={ROLES.VIEWER}>Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleCreateUser}
                    disabled={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : 'Create User'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
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
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit User</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-username">Username</Label>
                                    <Input id="edit-username" name="username" value={formData.username} onChange={handleChange} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input id="edit-name" name="name" value={formData.name} onChange={handleChange} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-password">Password (leave blank to keep unchanged)</Label>
                                    <Input id="edit-password" name="password" type="password" value={formData.password} onChange={handleChange} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-role">Role</Label>
                                    <Select value={formData.role} onValueChange={handleRoleChange}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                                        <SelectItem value={ROLES.USER}>User</SelectItem>
                                        <SelectItem value={ROLES.VIEWER}>Viewer</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button 
                                    onClick={handleUpdateUser}
                                    disabled={updateUserMutation.isPending}
                                  >
                                    {updateUserMutation.isPending ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                      </>
                                    ) : 'Update User'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          {permissions.canDelete && (
                            <Dialog open={isDeleteDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(user)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Deletion</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <p>Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?</p>
                                  <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button 
                                    variant="destructive" 
                                    onClick={handleDeleteUser}
                                    disabled={deleteUserMutation.isPending}
                                  >
                                    {deleteUserMutation.isPending ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                      </>
                                    ) : 'Delete User'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
