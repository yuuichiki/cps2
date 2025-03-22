
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { useAuth } from '@/contexts/AuthContext';
import { FileSpreadsheet, Home, LayoutDashboard, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-background border-b py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <Link to="/" className="text-xl font-bold">Excel File Magic</Link>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <div className={navigationMenuTriggerStyle()}>
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </div>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/dashboard">
                    <div className={navigationMenuTriggerStyle()}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </div>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {user?.name || 'Account'}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[220px] p-2">
                      <div className="border-b pb-2 mb-2">
                        <p className="text-sm font-medium">{user?.username }</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
