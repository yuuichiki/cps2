
import React from 'react';
import iconMap from './iconMap';

const MobileNavItem = ({ item, isActive, onClick }) => {
  // Get the icon component from our iconMap
  const IconComponent = item.icon ? iconMap[item.icon] || iconMap.Home : iconMap.Home;

  return (
    <div 
      className={`flex items-center p-3 rounded-md cursor-pointer mb-2 ${
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'hover:bg-accent'
      }`}
      onClick={onClick}
    >
      <IconComponent className="mr-2 h-5 w-5" />
      <span>{item.title}</span>
    </div>
  );
};

export default MobileNavItem;
