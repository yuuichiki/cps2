
import React from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet } from 'lucide-react';

const NavbarLogo = () => {
  return (
    <div className="flex items-center space-x-2">
      <FileSpreadsheet className="h-6 w-6 text-primary" />
      <Link to="/" className="text-xl font-bold">Excel File Magic</Link>
    </div>
  );
};

export default NavbarLogo;
