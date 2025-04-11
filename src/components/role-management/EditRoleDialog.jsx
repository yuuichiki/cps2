
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import RoleForm from './RoleForm';

const EditRoleDialog = ({ 
  isOpen, 
  onOpenChange, 
  formData, 
  handleChange, 
  togglePermission, 
  togglePermissionGroup,
  onUpdateRole,
  isUpdating
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
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
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
            onClick={onUpdateRole}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
