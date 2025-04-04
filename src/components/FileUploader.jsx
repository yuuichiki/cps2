
import React from 'react';
import { useFileUpload } from './file-upload/useFileUpload';
import FileUploadArea from './file-upload/FileUploadArea';
import ProcessingIndicator from './file-upload/ProcessingIndicator';
import ProcessingToggle from './file-upload/ProcessingToggle';

export const FileUploader = ({ onFileUploaded }) => {
  const { 
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
        <>
          <FileUploadArea 
            isDragging={isDragging}
            error={error}
            onButtonClick={handleButtonClick}
            isLoading={isLoading}
          />
          <ProcessingToggle 
            isUsingAPI={isUsingAPI} 
            onToggle={toggleProcessingMode} 
          />
        </>
      ) : (
        <ProcessingIndicator progress={progress} />
      )}
    </div>
  );
};
