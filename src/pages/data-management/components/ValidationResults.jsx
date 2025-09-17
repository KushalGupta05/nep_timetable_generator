import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ValidationResults = ({ 
  results = null, 
  onClose, 
  onProceed, 
  onDownloadErrors 
}) => {
  if (!results) return null;

  const { 
    totalRecords = 0, 
    validRecords = 0, 
    invalidRecords = 0, 
    errors = [], 
    warnings = [] 
  } = results;

  const hasErrors = invalidRecords > 0;
  const hasWarnings = warnings?.length > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Upload Validation Results</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-1">{totalRecords}</div>
          <div className="text-sm text-muted-foreground">Total Records</div>
        </div>
        <div className="bg-success/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">{validRecords}</div>
          <div className="text-sm text-muted-foreground">Valid Records</div>
        </div>
        <div className="bg-error/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-error mb-1">{invalidRecords}</div>
          <div className="text-sm text-muted-foreground">Invalid Records</div>
        </div>
      </div>
      {/* Errors Section */}
      {hasErrors && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="AlertCircle" size={20} className="text-error" />
            <h4 className="text-md font-medium text-error">Errors Found ({errors?.length})</h4>
          </div>
          <div className="bg-error/5 border border-error/20 rounded-lg p-4 max-h-40 overflow-y-auto">
            <div className="space-y-2">
              {errors?.slice(0, 10)?.map((error, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-error">Row {error?.row}:</span>
                  <span className="text-foreground ml-2">{error?.message}</span>
                </div>
              ))}
              {errors?.length > 10 && (
                <div className="text-sm text-muted-foreground italic">
                  ... and {errors?.length - 10} more errors
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Warnings Section */}
      {hasWarnings && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <h4 className="text-md font-medium text-warning">Warnings ({warnings?.length})</h4>
          </div>
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 max-h-32 overflow-y-auto">
            <div className="space-y-2">
              {warnings?.slice(0, 5)?.map((warning, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-warning">Row {warning?.row}:</span>
                  <span className="text-foreground ml-2">{warning?.message}</span>
                </div>
              ))}
              {warnings?.length > 5 && (
                <div className="text-sm text-muted-foreground italic">
                  ... and {warnings?.length - 5} more warnings
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Success Message */}
      {!hasErrors && !hasWarnings && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <h4 className="text-md font-medium text-success">Validation Successful</h4>
              <p className="text-sm text-muted-foreground mt-1">
                All {totalRecords} records are valid and ready to be imported.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        {hasErrors && (
          <Button
            variant="outline"
            onClick={onDownloadErrors}
            iconName="Download"
            iconPosition="left"
          >
            Download Error Report
          </Button>
        )}
        
        {validRecords > 0 && (
          <Button
            onClick={onProceed}
            iconName="Upload"
            iconPosition="left"
            className={hasErrors ? 'bg-warning hover:bg-warning/90' : ''}
          >
            {hasErrors 
              ? `Import ${validRecords} Valid Records` 
              : `Import All ${totalRecords} Records`
            }
          </Button>
        )}
        
        {hasErrors && validRecords === 0 && (
          <Button
            variant="outline"
            onClick={onClose}
          >
            Fix Errors & Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ValidationResults;