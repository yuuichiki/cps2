
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/userService';
import { toast } from '@/components/ui/use-toast';

export const useUserManagement = () => {
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

  return {
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
  };
};
