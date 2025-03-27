
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { getAuthorizedMenuItems } from '@/utils/permissions';
import useResponsive from '@/hooks/useResponsive';

// Import smaller component parts
import NavbarLogo from './NavbarLogo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Navbar = () => {
  const { user, logout, isAuthenticated, getMenus } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!user) {
        setMenuItems([]);
        setLoading(false);
        return;
      }
      
      try {
        const apiMenuItems = await getMenus();
        if (apiMenuItems && Array.isArray(apiMenuItems)) {
          const formattedMenuItems = apiMenuItems.map(item => ({
            title: item.title || item.name || item.menuName,
            path: item.path || item.url || item.menuUrl,
            icon: item.icon || 'LayoutDashboard',
            permission: item.permission || 'view:dashboard',
          }));
          setMenuItems(formattedMenuItems);
        } else {
          // Fallback to static menu items
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [user, getMenus]);

  const authorizedMenuItems = getAuthorizedMenuItems(user, menuItems);

  return (
    <header className="bg-background border-b py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <NavbarLogo />

        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-4">
              <DesktopNav 
                user={user} 
                logout={logout} 
                menuItems={authorizedMenuItems} 
                loading={loading} 
              />
            </div>
            
            <MobileNav 
              user={user}
              logout={logout}
              menuItems={authorizedMenuItems}
              loading={loading}
              isOpen={mobileMenuOpen}
              setIsOpen={setMobileMenuOpen}
            />
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
