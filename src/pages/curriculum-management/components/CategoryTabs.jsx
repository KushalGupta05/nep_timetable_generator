import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryTabs = ({ activeCategory, onCategoryChange, courseCounts }) => {
  const categories = [
    { 
      id: 'all', 
      label: 'All Courses', 
      icon: 'BookOpen',
      color: 'text-foreground',
      bgColor: 'bg-muted'
    },
    { 
      id: 'major', 
      label: 'Major', 
      icon: 'GraduationCap',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'minor', 
      label: 'Minor', 
      icon: 'Book',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      id: 'ability-enhancement', 
      label: 'AEC', 
      icon: 'Zap',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      id: 'skill', 
      label: 'SEC', 
      icon: 'Tool',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      id: 'value-added', 
      label: 'VAC', 
      icon: 'Star',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    { 
      id: 'foundation', 
      label: 'Foundation', 
      icon: 'Building',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-1">
      <div className="flex flex-wrap gap-1">
        {categories?.map((category) => {
          const isActive = activeCategory === category?.id;
          const count = courseCounts?.[category?.id] || 0;
          
          return (
            <button
              key={category?.id}
              onClick={() => onCategoryChange(category?.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? `${category?.bgColor} ${category?.color} shadow-sm`
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={category?.icon} size={16} />
              <span>{category?.label}</span>
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-white/80 text-current' :'bg-muted-foreground/10 text-muted-foreground'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;