import React from 'react';
import Icon from '../../../components/AppIcon';

const GenerationProgress = ({ isGenerating, progress, currentStep, conflicts, estimatedTime }) => {
  const steps = [
    { id: 'data', label: 'Loading Data', icon: 'Database' },
    { id: 'analysis', label: 'Analyzing Constraints', icon: 'Search' },
    { id: 'generation', label: 'Generating Schedule', icon: 'Cpu' },
    { id: 'optimization', label: 'Optimizing Layout', icon: 'Zap' },
    { id: 'validation', label: 'Validating Results', icon: 'CheckCircle' }
  ];

  if (!isGenerating) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
          <Icon name="Clock" size={20} color="white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Generation in Progress</h3>
          <p className="text-sm text-muted-foreground">
            Estimated time remaining: {estimatedTime || '2-3 minutes'}
          </p>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Overall Progress</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* Steps */}
      <div className="space-y-4">
        {steps?.map((step, index) => {
          const isActive = step?.id === currentStep;
          const isCompleted = steps?.findIndex(s => s?.id === currentStep) > index;
          
          return (
            <div key={step?.id} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-success text-success-foreground' 
                  : isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step?.icon} size={16} />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.label}
                </p>
                {isActive && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Conflicts Detection */}
      {conflicts && conflicts?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">
              Conflicts Detected: {conflicts?.length}
            </span>
          </div>
          <div className="space-y-2">
            {conflicts?.slice(0, 3)?.map((conflict, index) => (
              <div key={index} className="text-xs text-muted-foreground bg-muted p-2 rounded">
                {conflict?.message}
              </div>
            ))}
            {conflicts?.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{conflicts?.length - 3} more conflicts will be resolved automatically
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationProgress;