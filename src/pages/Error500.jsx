
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Error500 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <AlertTriangle className="h-20 w-20 text-destructive mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">500</h1>
        <p className="text-xl text-muted-foreground mb-2">Server Error</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Sorry, something went wrong on our servers. We're working to fix the issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    </div>
  );
};

export default Error500;
