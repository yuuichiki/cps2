
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';
import { getAuthorizedMenuItems } from '@/utils/permissions';
import useResponsive from '@/hooks/useResponsive';
import { 
  BarChart, 
  FileSpreadsheet, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Settings, 
  User, 
  Users, 
  X
} from 'lucide-react';

// Map of icon names to Lucide React components
const iconMap = {
  FileSpreadsheet,
  Home,
  LayoutDashboard,
  User,
  Users,
  Settings,
  BarChart,
};

const Navbar = () => {
  const { user, logout, isAuthenticated, checkPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useResponsive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get authorized menu items based on user role
  const menuItems = getAuthorizedMenuItems(user);

  // Handle menu click and close mobile menu if open
  const handleMenuClick = (path) => {
    navigate(path);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Render menu items based on authorization
  const renderMenuItems = (items, mobile = false) => {
    return items.map(item => {
      const Icon = iconMap[item.icon] || Home;
      const isActive = location.pathname === item.path;
      
      // For mobile menu
      if (mobile) {
        return (
          <div 
            key={item.path}
            className={`flex items-center p-3 rounded-md cursor-pointer mb-2 ${
              isActive 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-accent'
            }`}
            onClick={() => handleMenuClick(item.path)}
          >
            <Icon className="mr-2 h-5 w-5" />
            <span>{item.title}</span>
          </div>
        );
      }
      
      // For desktop menu
      return (
        <NavigationMenuItem key={item.path}>
          <Link to={item.path}>
            <div className={`${navigationMenuTriggerStyle()} ${
              isActive ? 'bg-accent/50' : ''
            }`}>
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </div>
          </Link>
        </NavigationMenuItem>
      );
    });
  };

  return (
    <header className="bg-background border-b py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <Link to="/" className="text-xl font-bold">Excel File Magic</Link>
        </div>

        {isAuthenticated ? (
          <>
            {/* Desktop Menu */}
            {!isMobile && (
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
                      {/* <Link to="/excel-viewer">
                        <div className={navigationMenuTriggerStyle()}>
                          <Home className="mr-2 h-4 w-4" />
                          excel-viewer
                        </div>
                      </Link>
                      <Link to="/users">
                        <div className={navigationMenuTriggerStyle()}>
                          <Home className="mr-2 h-4 w-4" />
                          users
                        </div>
                      </Link>
                      <Link to="/roles">
                        <div className={navigationMenuTriggerStyle()}>
                          <Home className="mr-2 h-4 w-4" />
                          roles
                        </div>
                      </Link>
                      <Link to="/settings">
                        <div className={navigationMenuTriggerStyle()}>
                          <Home className="mr-2 h-4 w-4" />
                          settings
                        </div>
                      </Link>
                       */}


                    </NavigationMenuItem>
                    
                    {renderMenuItems(menuItems)}
                    
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        {user?.name || user?.username || 'Account'}
                        {user?.role && (
                          <span className="ml-2 text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                        )}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[220px] p-2">
                          <div className="border-b pb-2 mb-2">
                            <p className="text-sm font-medium">{user?.username}</p>
                            {user?.role && (
                              <p className="text-xs text-muted-foreground">Role: {user.role}</p>
                            )}
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
            )}
            
            {/* Mobile Menu */}
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        <div>
                          <p className="font-medium">{user?.username}</p>
                          {user?.role && (
                            <p className="text-xs text-muted-foreground">Role: {user.role}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 overflow-auto py-4">
                      <div 
                        className="flex items-center p-3 rounded-md cursor-pointer mb-2 hover:bg-accent"
                        onClick={() => handleMenuClick('/')}
                      >
                        <Home className="mr-2 h-5 w-5" />
                        <span>Home</span>
                      </div>
                      
                      {renderMenuItems(menuItems, true)}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </>
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
