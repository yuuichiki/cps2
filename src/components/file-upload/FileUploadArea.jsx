
import React from 'react';
import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const FileUploadArea = ({ isDragging, error, onButtonClick, isLoading }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
          <FileSpreadsheet size={40} className="text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Drag & Drop your Excel file here</h3>
        <p className="text-sm text-muted-foreground">
          or click the button below to browse files
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button onClick={onButtonClick} className="mt-4">
        <UploadIcon />
        Browse Files
      </Button>
    </div>
  );
};

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default FileUploadArea;
