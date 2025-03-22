
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { loginUser, validateToken, devAuthenticate } from '@/services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Validate token with API - in production, this would call your actual API
          const userData = await validateToken(token).catch(() => {
            // If API call fails, still allow the app to function in dev mode
            console.warn("Token validation failed, but continuing in dev mode");
            return null;
          });
          
          if (userData) {
            setUser(userData);
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

  const login = async (username, password) => {
    try {
      setLoading(true);
      
      const data = await loginUser(username, password);
      
      // Save token to localStorage and state
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/dashboard');
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

  // For development/testing - simulates a successful login
  const devLogin = () => {
    const mockData = devAuthenticate();
    
    localStorage.setItem('token', mockData.token);
    setToken(mockData.token);
    setUser(mockData.user);
    
    toast({
      title: "Dev login successful",
      description: "Logged in with demo account",
    });
    
    navigate('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      logout,
      devLogin,
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
