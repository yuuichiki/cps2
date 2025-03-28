
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { User, Settings, LogOut, Globe } from 'lucide-react';

const UserMenu = ({ user, logout }) => {
  const navigate = useNavigate();

  // Map language codes to full names
  const getLanguageName = (code) => {
    switch (code) {
      case 'en': return 'English';
      case 'zh': return 'Chinese';
      case 'vi': return 'Vietnamese';
      default: return 'English';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={navigationMenuTriggerStyle()}>
        <User className="mr-2 h-4 w-4" />
        {user?.name || user?.username || 'Account'}
        {user?.role && (
          <span className="ml-2 text-xs bg-primary/20 px-2 py-0.5 rounded-full">
            {user.role}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{user?.username}</p>
            {user?.role && (
              <p className="text-xs text-muted-foreground">Role: {user.role}</p>
            )}
            {user?.language && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Globe className="h-3 w-3 mr-1" />
                {getLanguageName(user.language)}
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
