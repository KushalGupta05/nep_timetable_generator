import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkImportModal = ({ isOpen, onClose, onImport, programs }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [importOptions, setImportOptions] = useState({
    skipDuplicates: true,
    updateExisting: false,
    validateData: true
  });

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
      setSelectedFile(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      setSelectedFile(e?.target?.files?.[0]);
    }
  };

  const handleImport = () => {
    if (selectedFile && selectedProgram) {
      onImport({
        file: selectedFile,
        program: selectedProgram,
        options: importOptions
      });
      onClose();
      setSelectedFile(null);
      setSelectedProgram('');
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = `Course Code,Course Title,Credits,Type,Category,Semester,Is Elective,Max Students,Faculty Requirements,Resource Requirements,Description
CS101,Introduction to Computer Science,4,theory,major,1,FALSE,60,PhD in Computer Science,Computer Lab,Basic programming concepts
MATH101,Calculus I,4,theory,major,1,FALSE,80,PhD in Mathematics,Classroom,Differential and integral calculus
PHY101L,Physics Lab I,2,practical,major,1,FALSE,30,PhD in Physics,Physics Lab,Experimental physics`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'course_template.csv';
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Bulk Import Courses</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Program Selection */}
          <Select
            label="Target Program"
            options={programs}
            value={selectedProgram}
            onChange={setSelectedProgram}
            placeholder="Select program for import"
            required
          />

          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">
              Upload Course Data
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-3">
                <Icon name="Upload" size={32} className="mx-auto text-muted-foreground" />
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedFile?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile?.size / 1024)?.toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-foreground">
                      Drop your CSV or Excel file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports .csv, .xlsx, .xls files
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Icon name="Download" size={16} />
              Download Template
            </Button>
          </div>

          {/* Import Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Import Options
            </label>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={importOptions?.skipDuplicates}
                  onChange={(e) => setImportOptions(prev => ({
                    ...prev,
                    skipDuplicates: e?.target?.checked
                  }))}
                  className="rounded border-border"
                />
                <span className="text-sm text-foreground">Skip duplicate course codes</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={importOptions?.updateExisting}
                  onChange={(e) => setImportOptions(prev => ({
                    ...prev,
                    updateExisting: e?.target?.checked
                  }))}
                  className="rounded border-border"
                />
                <span className="text-sm text-foreground">Update existing courses</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={importOptions?.validateData}
                  onChange={(e) => setImportOptions(prev => ({
                    ...prev,
                    validateData: e?.target?.checked
                  }))}
                  className="rounded border-border"
                />
                <span className="text-sm text-foreground">Validate data before import</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!selectedFile || !selectedProgram}
            >
              Import Courses
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;