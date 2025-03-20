
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
import { FileUploader } from '@/components/FileUploader';
import { ExcelViewer } from '@/components/ExcelViewer';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileUploaded = (data, name) => {
    setExcelData(data);
    setFileName(name);
    toast({
      title: "File uploaded successfully",
      description: `${name} has been processed`,
    });
  };

  const handleReset = () => {
    setExcelData(null);
    setFileName('');
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
          {!excelData ? (
            <FileUploader onFileUploaded={handleFileUploaded} />
          ) : (
            <ExcelViewer data={excelData} fileName={fileName} />
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
