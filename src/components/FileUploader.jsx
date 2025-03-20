
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileSpreadsheet, Upload, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { uploadExcelFile } from '@/services/api';

export const FileUploader = ({ onFileUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isUsingAPI, setIsUsingAPI] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 90) {
          clearInterval(progressInterval);
        }
        return newProgress < 90 ? newProgress : 90;
      });
    }, 100);

    try {
      if (isUsingAPI) {
        // Process via API
        const apiResponse = await uploadExcelFile(file);
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          setIsLoading(false);
          onFileUploaded(apiResponse, file.name);
        }, 500);
      } else {
        // Process locally with XLSX
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // Process headers and rows
            const headers = jsonData[0];
            const rows = jsonData.slice(1);
            
            // Create structured data
            const processedData = {
              headers,
              rows,
              sheetName,
              totalRows: rows.length,
              totalColumns: headers.length
            };
            
            // Complete progress and finish loading
            clearInterval(progressInterval);
            setProgress(100);
            
            setTimeout(() => {
              setIsLoading(false);
              onFileUploaded(processedData, file.name);
            }, 500);
          } catch (err) {
            handleError(err, progressInterval);
          }
        };
        
        reader.onerror = () => {
          handleError(new Error("Failed to read file"), progressInterval);
        };
        
        reader.readAsArrayBuffer(file);
      }
    } catch (err) {
      handleError(err, progressInterval);
    }
  };

  const handleError = (err, progressInterval) => {
    clearInterval(progressInterval);
    setError("Failed to process Excel file. Please make sure it's a valid Excel file.");
    setIsLoading(false);
    toast({
      variant: "destructive",
      title: "Error processing file",
      description: err.message,
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    
    if (validateFile(file)) {
      processFile(file);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    
    const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
      });
      return false;
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size must be less than 10MB",
      });
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      processFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const toggleProcessingMode = () => {
    setIsUsingAPI(!isUsingAPI);
    toast({
      title: `Processing mode changed`,
      description: `Now using ${!isUsingAPI ? 'API' : 'local'} processing`,
    });
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=".xlsx,.xls"
        ref={fileInputRef}
      />
      
      {!isLoading ? (
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
            <div className="flex items-center justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleProcessingMode}
                className="text-xs mx-auto mt-2"
              >
                Using {isUsingAPI ? 'API' : 'Local'} Processing
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="text-destructive flex items-center justify-center gap-2 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <Button onClick={handleButtonClick} className="mt-4">
            <Upload size={16} className="mr-2" />
            Browse Files
          </Button>
        </div>
      ) : (
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
      )}
    </div>
  );
};
