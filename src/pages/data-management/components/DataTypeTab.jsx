import React from 'react';

import Icon from '../../../components/AppIcon';

const DataTypeTab = ({ 
  activeTab, 
  onTabChange, 
  tabs = [] 
}) => {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex overflow-x-auto">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab?.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            {tab?.label}
            <span className={`px-2 py-1 text-xs rounded-full ${
              activeTab === tab?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {tab?.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataTypeTab;