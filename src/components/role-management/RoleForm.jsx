
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { PERMISSION_GROUPS } from '@/hooks/useRoleManagement';

const RoleForm = ({ formData, handleChange, togglePermission, togglePermissionGroup }) => {
  // Render permission checkboxes grouped by category
  const renderPermissionGroups = () => {
    return PERMISSION_GROUPS.map(group => (
      <div key={group.name} className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox 
            id={`group-${group.name}`}
            checked={group.permissions.every(p => formData.permissions.includes(p.id))}
            onCheckedChange={() => togglePermissionGroup(group.permissions)}
          />
          <Label htmlFor={`group-${group.name}`} className="font-semibold">{group.name}</Label>
        </div>
        <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
          {group.permissions.map(permission => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox 
                id={permission.id}
                checked={formData.permissions.includes(permission.id)}
                onCheckedChange={() => togglePermission(permission.id)}
              />
              <Label htmlFor={permission.id}>{permission.label}</Label>
            </div>
          ))}
        </div>
        <Separator className="mt-4" />
      </div>
    ));
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Role Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Role Code</Label>
          <Input id="code" name="code" value={formData.code} onChange={handleChange} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium mb-4">Permissions</h3>
        {renderPermissionGroups()}
      </div>
    </div>
  );
};

export default RoleForm;
