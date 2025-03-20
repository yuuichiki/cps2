
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUploader } from '@/components/FileUploader';
import { ExcelViewer } from '@/components/ExcelViewer';
import { toast } from "@/components/ui/use-toast";
import { processExcelData } from '@/services/api';
import { RefreshCw } from "lucide-react";

const Index = () => {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState(null);

  const handleFileUploaded = (data, name) => {
    setExcelData(data);
    setFileName(name);
    setProcessingError(null);
    toast({
      title: "File uploaded successfully",
      description: `${name} has been processed`,
    });
  };

  const handleReset = () => {
    setExcelData(null);
    setFileName('');
    setProcessingError(null);
  };

  const handleProcessData = async () => {
    if (!excelData) return;
    
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      const result = await processExcelData(excelData);
      
      // Update the data with processed results
      setExcelData(result);
      
      toast({
        title: "Data processed successfully",
        description: "The Excel data has been processed by the API",
      });
    } catch (error) {
      setProcessingError(error.message || "An error occurred during processing");
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: error.message || "Failed to process the data",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Excel File Uploader</CardTitle>
          <CardDescription>
            Upload your Excel file (.xlsx, .xls) to view and analyze the data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processingError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{processingError}</AlertDescription>
            </Alert>
          )}
          
          {!excelData ? (
            <FileUploader onFileUploaded={handleFileUploaded} />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button 
                  onClick={handleProcessData} 
                  disabled={isProcessing}
                  className="mb-4"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process with API"
                  )}
                </Button>
              </div>
              <ExcelViewer data={excelData} fileName={fileName} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {excelData && (
            <Button onClick={handleReset} variant="outline" className="w-full max-w-xs">
              Upload Another File
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
