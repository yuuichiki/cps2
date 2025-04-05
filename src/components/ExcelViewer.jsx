import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Download, Search, File, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as XLSX from 'xlsx';

export const ExcelViewer = ({ data, fileName }) => {
  const navigate = useNavigate();
  
  // Check if data and sheets exist, if not provide defaults
  const sheets = data?.sheets || [{ 
    sheetName: 'No Data', 
    headers: [], 
    rows: [], 
    totalRows: 0, 
    totalColumns: 0 
  }];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [activeSheet, setActiveSheet] = useState(sheets[0]?.sheetName || 'No Data');
  
  const currentSheetData = sheets.find(sheet => sheet.sheetName === activeSheet) || sheets[0] || {
    headers: [],
    rows: [],
    totalRows: 0
  };
  
  const { headers, rows, totalRows } = currentSheetData;
  
  const filteredRows = rows?.filter(row => 
    row?.some(cell => 
      String(cell).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];
  
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);
  
  const exportToExcel = () => {
    if (!headers || !rows || rows.length === 0) {
      return;
    }
    
    const workbook = XLSX.utils.book_new();
    
    // Export only the current sheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(workbook, worksheet, activeSheet);
    
    XLSX.writeFile(workbook, `${fileName.split('.')[0]}_${activeSheet}.xlsx`);
  };

  const exportAllToExcel = () => {
    if (!sheets || sheets.length === 0) {
      return;
    }
    
    const workbook = XLSX.utils.book_new();
    
    // Add all sheets to the workbook
    sheets.forEach(sheet => {
      if (sheet.headers && sheet.rows) {
        const worksheet = XLSX.utils.aoa_to_sheet([sheet.headers, ...sheet.rows]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
      }
    });
    
    XLSX.writeFile(workbook, fileName || 'export.xlsx');
  };
  
  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <FileSpreadsheet size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium truncate max-w-xs">{fileName || 'Excel Data'}</h3>
            <p className="text-xs text-muted-foreground">
              {sheets.length} sheets | {totalRows} rows in current sheet
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={exportToExcel} variant="outline" size="sm" disabled={!headers || headers.length === 0}>
            <Download size={16} className="mr-2" />
            Export Current Sheet
          </Button>
          <Button onClick={exportAllToExcel} variant="outline" size="sm" disabled={!sheets || sheets.length === 0}>
            <Download size={16} className="mr-2" />
            Export All
          </Button>
        </div>
      </div>
      
      {sheets && sheets.length > 0 ? (
        <Tabs value={activeSheet} onValueChange={setActiveSheet} className="w-full">
          <div className="border-b">
            <TabsList className="h-10 bg-transparent p-0">
              {sheets.map((sheet) => (
                <TabsTrigger
                  key={sheet.sheetName}
                  value={sheet.sheetName}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:text-foreground rounded-none px-4"
                >
                  {sheet.sheetName}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {sheets.map((sheet) => (
            <TabsContent key={sheet.sheetName} value={sheet.sheetName} className="pt-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search in data..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                
                <div className="border rounded-md">
                  <ScrollArea className="h-[400px]">
                    <div className="w-full">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            {headers && headers.map((header, index) => (
                              <th 
                                key={index} 
                                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-b sticky top-0 bg-background"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedRows.length > 0 ? (
                            paginatedRows.map((row, rowIndex) => (
                              <tr 
                                key={rowIndex} 
                                className="border-b hover:bg-muted/20 transition-colors"
                              >
                                {row && row.map((cell, cellIndex) => (
                                  <td 
                                    key={cellIndex} 
                                    className="px-4 py-3 text-sm"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td 
                                colSpan={headers ? headers.length : 1} 
                                className="px-4 py-10 text-center text-muted-foreground"
                              >
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <File size={24} />
                                  <p>No data found matching your search</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredRows.length)} of {filteredRows.length} results
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <File size={48} className="text-muted-foreground" />
            <h3 className="text-lg font-medium mt-4">No Data Available</h3>
            <p className="text-sm text-muted-foreground">The Excel file doesn't contain any readable data.</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-6">


              <Button 
          onClick={handleReturnToDashboard} 
          className="w-full max-w-xs bg-transparent text-blue-800 border border-blue-800 hover:bg-blue-100 flex items-center justify-center"
        >
          <CheckCircle size={16} className="mr-2" />
          OK - Return to Dashboard
        </Button>
      </div>
    </div>
  );
};