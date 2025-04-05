
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserForm from './UserForm';

const EditUserDialog = ({ 
  formData, 
  handleChange, 
  handleRoleChange, 
  handleUpdateUser, 
  isSubmitting
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit User</DialogTitle>
      </DialogHeader>
      <UserForm
        formData={formData}
        handleChange={handleChange}
        handleRoleChange={handleRoleChange}
        onSubmit={handleUpdateUser}
        isSubmitting={isSubmitting}
        submitButtonText="Update User"
      />
    </DialogContent>
  );
};

export default EditUserDialog;
