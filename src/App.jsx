
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Navbar />
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/500" element={<Error500 />} />

              {/* Protected routes with permission checks */}
              <Route element={<ProtectedRoute requiredPermission="view:dashboard" />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              
              <Route element={<ProtectedRoute requiredPermission="view:reports" />}>
                <Route path="/excel-viewer" element={<Index />} />
              </Route>

              <Route element={<ProtectedRoute requiredPermission="manage:users" />}>
                <Route path="/users" element={<div className="container py-10">User Management (Coming Soon)</div>} />
              </Route>
              
              <Route element={<ProtectedRoute requiredPermission="view:settings" />}>
                <Route path="/settings" element={<div className="container py-10">Settings (Coming Soon)</div>} />
              </Route>
              
              {/* Error/fallback routes */}
              <Route path="*" element={<Error404 />} />
            </Routes>
          </main>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
