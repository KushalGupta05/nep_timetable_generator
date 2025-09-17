import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const UploadSection = ({ 
  onFileUpload, 
  acceptedFormats = ".csv,.xlsx,.xls",
  maxFileSize = 10,
  isUploading = false 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileUpload(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (file?.size > maxFileSize * 1024 * 1024) {
      alert(`File size should not exceed ${maxFileSize}MB`);
      return;
    }
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    onFileUpload(file);
  };

  const handleFileSelect = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFileUpload(e?.target?.files?.[0]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Upload Area */}
        <div className="flex-1">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Upload" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supported formats: CSV, Excel (.xlsx, .xls) • Max size: {maxFileSize}MB
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef?.current?.click()}
                  disabled={isUploading}
                  iconName="FolderOpen"
                  iconPosition="left"
                >
                  Choose File
                </Button>
              </div>
            </div>
            
            {/* Upload Progress */}
            {isUploading && uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-foreground">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Quick Actions */}
        <div className="lg:w-64">
          <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="Download"
              iconPosition="left"
            >
              Download Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="FileText"
              iconPosition="left"
            >
              View Sample Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="HelpCircle"
              iconPosition="left"
            >
              Upload Guide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;