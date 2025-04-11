
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import RoleForm from './RoleForm';

const CreateRoleDialog = ({ 
  isOpen, 
  onOpenChange, 
  formData, 
  handleChange, 
  togglePermission, 
  togglePermissionGroup,
  onCreateRole,
  isCreating
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>
        <RoleForm 
          formData={formData}
          handleChange={handleChange}
          togglePermission={togglePermission}
          togglePermissionGroup={togglePermissionGroup}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={onCreateRole}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleDialog;
