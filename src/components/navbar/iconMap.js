
import { 
  FileSpreadsheet, 
  Home, 
  User, 
  Users,
  Settings,
  BarChart, 
  Shield 
} from 'lucide-react';

// Map string icon names to actual Lucide React components
export const iconMap = {
  FileSpreadsheet,
  Home,
  LayoutDashboard: Home, // Fallback to Home if LayoutDashboard is not available
  User,
  Users,
  Settings,
  BarChart,
  Shield,
};

export default iconMap;
