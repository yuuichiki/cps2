
import React, { useState } from 'react';
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
import { PlusCircle, Edit, Trash2, Users } from 'lucide-react';

const UserManagement = () => {
  const { user } = useAuth();
  const permissions = getCrudPermissions(user, 'users');
  
  // Sample user data (in a real app, this would come from API)
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: 2, username: 'user1', name: 'Regular User', email: 'user@example.com', role: 'user' },
    { id: 3, username: 'viewer1', name: 'Viewer User', email: 'viewer@example.com', role: 'viewer' },
  ]);
  
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

    // In a real app, this would be an API call
    const newUser = {
      id: users.length + 1,
      username: formData.username,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      // Note: password would be hashed on the server in a real app
    };

    setUsers([...users, newUser]);
    resetForm();
    setIsCreateDialogOpen(false);
    
    toast({
      title: "User Created",
      description: `User ${newUser.name} was created successfully.`,
    });
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

    // In a real app, this would be an API call
    const updatedUsers = users.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          username: formData.username,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          // Only update password if provided
          ...(formData.password ? { password: formData.password } : {}),
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    resetForm();
    setIsEditDialogOpen(false);
    
    toast({
      title: "User Updated",
      description: `User ${formData.name} was updated successfully.`,
    });
  };

  // Delete a user
  const handleDeleteUser = () => {
    // In a real app, this would be an API call
    const filteredUsers = users.filter(u => u.id !== selectedUser.id);
    setUsers(filteredUsers);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "User Deleted",
      description: `User ${selectedUser.name} was deleted successfully.`,
    });
  };

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
                  <Button onClick={handleCreateUser}>Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
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
              {users.map((user) => (
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
                              <Button onClick={handleUpdateUser}>Update User</Button>
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
                              <Button variant="destructive" onClick={handleDeleteUser}>Delete User</Button>
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

export default UserManagement;
