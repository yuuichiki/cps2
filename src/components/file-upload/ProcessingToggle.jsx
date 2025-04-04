
import React from 'react';
import { Button } from "@/components/ui/button";

const ProcessingToggle = ({ isUsingAPI, onToggle }) => {
  return (
    <div className="flex items-center justify-center">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onToggle}
        className="text-xs mx-auto mt-2"
      >
        Using {isUsingAPI ? 'API' : 'Local'} Processing
      </Button>
    </div>
  );
};

export default ProcessingToggle;
