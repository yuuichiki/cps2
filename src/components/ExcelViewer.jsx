
import React, { useState } from 'react';
import { FileSpreadsheet, Download, Search, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from 'xlsx';

export const ExcelViewer = ({ data, fileName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  const { headers, rows, totalRows } = data;
  
  const filteredRows = rows.filter(row => 
    row.some(cell => 
      String(cell).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);
  
  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <FileSpreadsheet size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium truncate max-w-xs">{fileName}</h3>
            <p className="text-xs text-muted-foreground">
              {totalRows} rows | {headers.length} columns
            </p>
          </div>
        </div>
        
        <Button onClick={exportToExcel} variant="outline" size="sm">
          <Download size={16} className="mr-2" />
          Export
        </Button>
      </div>
      
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
                  {headers.map((header, index) => (
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
                      {row.map((cell, cellIndex) => (
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
                      colSpan={headers.length} 
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
  );
};
