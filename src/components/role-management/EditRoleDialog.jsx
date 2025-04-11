
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import RoleForm from './RoleForm';

const EditRoleDialog = ({ 
  isOpen, 
  onOpenChange, 
  formData, 
  handleChange, 
  togglePermission, 
  togglePermissionGroup,
  onUpdateRole,
  isUpdating,
  isLoadingPermissions
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>
        
        {isLoadingPermissions ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p>Loading role permissions...</p>
          </div>
        ) : (
          <RoleForm 
            formData={formData}
            handleChange={handleChange}
            togglePermission={togglePermission}
            togglePermissionGroup={togglePermissionGroup}
          />
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating || isLoadingPermissions}
          >
            Cancel
          </Button>
          <Button 
            onClick={onUpdateRole}
            disabled={isUpdating || isLoadingPermissions}
          >
            {isUpdating ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
