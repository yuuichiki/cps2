
import React from 'react';
import { useFileUpload } from './file-upload/useFileUpload';
import FileUploadArea from './file-upload/FileUploadArea';
import ProcessingIndicator from './file-upload/ProcessingIndicator';

export const FileUploader = ({ onFileUploaded }) => {
  const { 
    isDragging, 
    isLoading, 
    progress,
    error,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleButtonClick
  } = useFileUpload(onFileUploaded);

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
        <FileUploadArea 
          isDragging={isDragging}
          error={error}
          onButtonClick={handleButtonClick}
          isLoading={isLoading}
        />
      ) : (
        <ProcessingIndicator progress={progress} />
      )}
    </div>
  );
};
