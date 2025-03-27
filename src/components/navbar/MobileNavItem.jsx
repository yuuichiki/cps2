
import React from 'react';
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

const MobileNavItem = ({ item, isActive, onClick }) => {
  // Dynamically import the correct icon
  const getIcon = () => {
    const iconName = item.icon || 'Home';
    // Use dynamic import for icons
    const Icon = iconMap[iconName] ? require('lucide-react')[iconName] : Home;
    return Icon;
  };
  
  const Icon = getIcon();

  return (
    <div 
      className={`flex items-center p-3 rounded-md cursor-pointer mb-2 ${
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'hover:bg-accent'
      }`}
      onClick={onClick}
    >
      <Icon className="mr-2 h-5 w-5" />
      <span>{item.title}</span>
    </div>
  );
};

export default MobileNavItem;
