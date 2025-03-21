
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-3xl mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <FileSpreadsheet className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Excel File Magic
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Upload, view, and analyze your Excel files with ease. Process multiple sheets and get insights from your data.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
