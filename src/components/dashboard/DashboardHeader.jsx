
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Globe } from 'lucide-react';

const DashboardHeader = () => {
  const { user } = useAuth();
  
  // Map language codes to full names
  const getLanguageName = (code) => {
    switch (code) {
      case 'en': return 'English';
      case 'zh': return 'Chinese';
      case 'vi': return 'Vietnamese';
      default: return 'English';
    }
  };
  
  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-primary/80 to-primary rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Color Palette System Dashboard</h1>
        <p className="opacity-90">
          Welcome back, {user?.name || user?.username || 'User'}! 
          Manage your color palettes and track submissions.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="bg-white/20 rounded-lg px-4 py-2 text-sm backdrop-blur-sm">
            <span className="block opacity-80">Role</span>
            <span className="font-semibold">{user?.roles || 'Standard User'}</span>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 text-sm backdrop-blur-sm">
            <span className="block opacity-80">Department</span>
            <span className="font-semibold">{user?.department || 'Not Assigned'}</span>
          </div>
          {user?.language && (
            <div className="bg-white/20 rounded-lg px-4 py-2 text-sm backdrop-blur-sm flex items-center">
              <span className="block opacity-80 mr-2">Language</span>
              <Globe className="h-4 w-4 mr-1 opacity-80" />
              <span className="font-semibold">{getLanguageName(user.language)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
