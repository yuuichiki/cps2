
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Home, LogOut } from 'lucide-react';
import MobileNavItem from './MobileNavItem';

const MobileNav = ({ user, logout, menuItems, loading, isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path) => {
    navigate(path);
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
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
            
            {loading ? (
              <div className="flex items-center p-3">Loading...</div>
            ) : (
              menuItems.map(item => (
                <MobileNavItem
                  key={item.path}
                  item={item}
                  isActive={location.pathname === item.path}
                  onClick={() => handleMenuClick(item.path)}
                />
              ))
            )}
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
  );
};

export default MobileNav;
