
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import UserForm from './UserForm';

const CreateUserDialog = ({ 
  isOpen, 
  setIsOpen, 
  formData, 
  handleChange, 
  handleRoleChange, 
  handleCreateUser, 
  isSubmitting, 
  resetForm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
        <UserForm
          formData={formData}
          handleChange={handleChange}
          handleRoleChange={handleRoleChange}
          onSubmit={handleCreateUser}
          isSubmitting={isSubmitting}
          submitButtonText="Create User"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
