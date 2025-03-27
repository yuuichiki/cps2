
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Home } from 'lucide-react';

const iconMap = {
  FileSpreadsheet: 'FileSpreadsheet',
  Home: 'Home',
  LayoutDashboard: 'LayoutDashboard',
  User: 'User',
  Users: 'Users',
  Settings: 'Settings',
  BarChart: 'BarChart',
  Shield: 'Shield',
};

const NavItem = ({ item, isActive = false }) => {
  // Dynamically import the correct icon
  const getIcon = () => {
    const iconName = item.icon || 'Home';
    // Use dynamic import for icons
    const Icon = iconMap[iconName] ? require('lucide-react')[iconName] : Home;
    return Icon;
  };
  
  const Icon = getIcon();

  return (
    <NavigationMenuItem>
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
};

export default NavItem;
