
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import iconMap from './iconMap';

const NavItem = ({ item, isActive = false }) => {
  // Get the icon component from our iconMap
  const IconComponent = item.icon ? iconMap[item.icon] || iconMap.Home : iconMap.Home;

  return (
    <NavigationMenuItem>
      <Link to={item.path}>
        <div className={`${navigationMenuTriggerStyle()} ${
          isActive ? 'bg-accent/50' : ''
        }`}>
          <IconComponent className="mr-2 h-4 w-4" />
          {item.title}
        </div>
      </Link>
    </NavigationMenuItem>
  );
};

export default NavItem;
