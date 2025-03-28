
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { loginUser, validateToken, devAuthenticate, getMenuItems } from '@/services/authService';
import { hasPermission, fetchRolePermissions } from '@/utils/permissions';
import { LANG } from '@/utils/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('language') || LANG.ENGLISH);
  const navigate = useNavigate();
  const location = useLocation();

  // Store language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Store the current path when it changes (except for login page)
  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/500' && location.pathname !== '/404') {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location.pathname]);

  // Initialize permissions when token changes
  useEffect(() => {
    if (token) {
      fetchRolePermissions(token).catch(error => {
        console.error('Error fetching role permissions:', error);
      });
    }
  }, [token]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Validate token with API
          const userData = await validateToken(token).catch(() => {
            console.warn("Token validation failed, but continuing in dev mode");
            return null;
          });
          
          if (userData) {
            setUser(userData);
            // Fetch role permissions
            await fetchRolePermissions(token);
          } else {
            // If token is invalid, clear everything
            logout();
          }
        } catch (error) {
          console.error("Error validating token:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username, password, userLanguage) => {
    try {
      setLoading(true);
      
      const data = await loginUser(username, password);
      
      // Save token to localStorage and state
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // Set user language if provided
      if (userLanguage) {
        setLanguage(userLanguage);
      }
      
      // Update user with language preference
      setUser({
        ...data.user,
        language: userLanguage || language
      });
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigate to last visited page or dashboard as default
      const lastPage = localStorage.getItem('lastVisitedPage');
      navigate(lastPage || '/dashboard');
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // For development/testing - simulates a successful login with role
  const devLogin = (role = 'user', userLanguage) => {
    const mockData = devAuthenticate(role);
    
    localStorage.setItem('token', mockData.token);
    setToken(mockData.token);
    
    // Set user language if provided
    if (userLanguage) {
      setLanguage(userLanguage);
    }
    
    // Update user with language preference
    setUser({
      ...mockData.user,
      language: userLanguage || language
    });
    
    toast({
      title: "Dev login successful",
      description: `Logged in with ${role} role`,
    });
    
    // Navigate to last visited page or dashboard as default
    const lastPage = localStorage.getItem('lastVisitedPage');
    navigate(lastPage || '/dashboard');
  };

  // Check if user has specific permission
  const checkPermission = (permission) => {
    return hasPermission(user, permission);
  };

  const getMenus = async () => {
    try {
      return await getMenuItems(token);
    } catch (error) {
      console.error("Error fetching menus:", error);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading,
      language,
      setLanguage,
      login, 
      logout,
      devLogin,
      checkPermission,
      getMenus,
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
