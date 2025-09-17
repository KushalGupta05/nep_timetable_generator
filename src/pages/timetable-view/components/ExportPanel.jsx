import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ExportPanel = ({ isOpen, onClose }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportScope, setExportScope] = useState('current');
  const [includeOptions, setIncludeOptions] = useState({
    facultyDetails: true,
    roomDetails: true,
    courseDescriptions: false,
    studentCount: true,
    colorCoding: true
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' },
    { value: 'print', label: 'Print Preview' }
  ];

  const scopeOptions = [
    { value: 'current', label: 'Current View' },
    { value: 'week', label: 'Full Week' },
    { value: 'month', label: 'Full Month' },
    { value: 'semester', label: 'Full Semester' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock download trigger
    const filename = `timetable_${exportScope}_${Date.now()}.${exportFormat}`;
    console.log(`Exporting ${filename} with options:`, includeOptions);
    
    setIsExporting(false);
    onClose();
  };

  const handleIncludeOptionChange = (option, checked) => {
    setIncludeOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Icon name="Download" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Export Timetable</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isExporting}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Select
              label="Export Format"
              options={formatOptions}
              value={exportFormat}
              onChange={setExportFormat}
              className="w-full"
            />
          </div>

          <div>
            <Select
              label="Export Scope"
              options={scopeOptions}
              value={exportScope}
              onChange={setExportScope}
              className="w-full"
            />
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-3">Include in Export</h3>
            <div className="space-y-3">
              <Checkbox
                label="Faculty Details"
                checked={includeOptions?.facultyDetails}
                onChange={(e) => handleIncludeOptionChange('facultyDetails', e?.target?.checked)}
              />
              <Checkbox
                label="Room Details"
                checked={includeOptions?.roomDetails}
                onChange={(e) => handleIncludeOptionChange('roomDetails', e?.target?.checked)}
              />
              <Checkbox
                label="Course Descriptions"
                checked={includeOptions?.courseDescriptions}
                onChange={(e) => handleIncludeOptionChange('courseDescriptions', e?.target?.checked)}
              />
              <Checkbox
                label="Student Count"
                checked={includeOptions?.studentCount}
                onChange={(e) => handleIncludeOptionChange('studentCount', e?.target?.checked)}
              />
              <Checkbox
                label="Color Coding"
                checked={includeOptions?.colorCoding}
                onChange={(e) => handleIncludeOptionChange('colorCoding', e?.target?.checked)}
              />
            </div>
          </div>

          {exportFormat === 'pdf' && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={16} className="text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="text-foreground font-medium mb-1">PDF Export Options</p>
                  <p className="text-muted-foreground">
                    The PDF will be optimized for A4 printing with proper page breaks and margins.
                  </p>
                </div>
              </div>
            </div>
          )}

          {exportFormat === 'excel' && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={16} className="text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="text-foreground font-medium mb-1">Excel Export Options</p>
                  <p className="text-muted-foreground">
                    Data will be organized in separate sheets for easy analysis and filtering.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;