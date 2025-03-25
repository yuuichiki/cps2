import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { uploadExcelFile } from '@/services/api';
import { toast } from "@/components/ui/use-toast";

export const useFileUpload = (onFileUploaded) => {
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
            
            // Process all sheets
            const sheets = workbook.SheetNames.map(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              
              // Process headers and rows for this sheet
              const headers = jsonData[0] || [];
              const rows = jsonData.slice(1);
              
              return {
                sheetName,
                headers,
                rows,
                totalRows: rows.length,
                totalColumns: headers.length
              };
            });
            
            // Create structured data with all sheets
            const processedData = {
              sheets,
              fileName: file.name,
              totalSheets: sheets.length
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

  return {
    isDragging,
    isLoading,
    progress,
    error,
    isUsingAPI,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleButtonClick,
    toggleProcessingMode
  };
};
