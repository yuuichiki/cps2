
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

const DeleteUserDialog = ({ selectedUser, handleDeleteUser, isSubmitting }) => {
  return (
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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : 'Delete User'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteUserDialog;
