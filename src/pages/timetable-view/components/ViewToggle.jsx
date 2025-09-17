import React from 'react';
import Button from '../../../components/ui/Button';


const ViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'grid', label: 'Grid View', icon: 'Grid3X3' },
    { id: 'calendar', label: 'Calendar View', icon: 'Calendar' }
  ];

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {views?.map((view) => (
        <Button
          key={view?.id}
          variant={currentView === view?.id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(view?.id)}
          iconName={view?.icon}
          iconPosition="left"
          iconSize={16}
          className="text-sm"
        >
          {view?.label}
        </Button>
      ))}
    </div>
  );
};

export default ViewToggle;