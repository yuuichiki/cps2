
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { ROLES } from '@/utils/permissions';

const UserForm = ({ 
  formData, 
  handleChange, 
  handleRoleChange, 
  onSubmit, 
  isSubmitting,
  submitButtonText,
  cancelText = "Cancel"
}) => {
  return (
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
        <Label htmlFor="password">
          {submitButtonText === 'Create User' ? 'Password' : 'Password (leave blank to keep unchanged)'}
        </Label>
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
      
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{cancelText}</Button>
        </DialogClose>
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {submitButtonText === 'Create User' ? 'Creating...' : 'Updating...'}
            </>
          ) : submitButtonText}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default UserForm;
