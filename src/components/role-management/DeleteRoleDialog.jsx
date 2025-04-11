
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const DeleteRoleDialog = ({ 
  isOpen, 
  onOpenChange, 
  selectedRole,
  onDeleteRole,
  isDeleting
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete role <strong>{selectedRole?.name}</strong>?</p>
          <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDeleteRole}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRoleDialog;
