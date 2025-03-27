
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Home } from 'lucide-react';
import UserMenu from './UserMenu';
import NavItem from './NavItem';

const DesktopNav = ({ user, logout, menuItems, loading }) => {
  const location = useLocation();

  return (
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
        
        {loading ? (
          <NavigationMenuItem>
            <div className={navigationMenuTriggerStyle()}>
              Loading...
            </div>
          </NavigationMenuItem>
        ) : (
          menuItems.map(item => (
            <NavItem 
              key={item.path} 
              item={item} 
              isActive={location.pathname === item.path} 
            />
          ))
        )}
        
        <NavigationMenuItem>
          <UserMenu user={user} logout={logout} />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNav;
