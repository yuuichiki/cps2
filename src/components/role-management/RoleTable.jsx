
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCrudPermissions } from '@/utils/permissions';

const RoleTable = ({ roles, onEdit, onDelete }) => {
  const { user } = useAuth();
  const permissions = getCrudPermissions(user, 'roles');

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Permissions</TableHead>
          {(permissions.canEdit || permissions.canDelete) && (
            <TableHead className="text-right">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell className="font-medium">{role.name}</TableCell>
            <TableCell>
              <code className="bg-muted px-1 py-0.5 rounded text-sm">{role.code}</code>
            </TableCell>
            <TableCell>{role.description}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {role.permissions && role.permissions.length > 0 ? (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {role.permissions.length} permissions
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">No permissions</span>
                )}
              </div>
            </TableCell>
            {(permissions.canEdit || permissions.canDelete) && (
              <TableCell className="text-right">
                {permissions.canEdit && (
                  <Button variant="ghost" size="icon" onClick={() => onEdit(role)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                {permissions.canDelete && (
                  <Button variant="ghost" size="icon" onClick={() => onDelete(role)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RoleTable;
