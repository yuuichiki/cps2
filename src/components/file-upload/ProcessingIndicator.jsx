
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { FileSpreadsheet } from "lucide-react";

const ProcessingIndicator = ({ progress }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
          <FileSpreadsheet size={40} className="text-primary" />
        </div>
      </div>
      
      <h3 className="text-lg font-medium">Processing your file...</h3>
      <Progress value={progress} className="w-full h-2" />
      <p className="text-sm text-muted-foreground">{progress}% complete</p>
    </div>
  );
};

export default ProcessingIndicator;
