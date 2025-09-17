import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ filters, onFilterChange, onClearFilters, isExpanded, onToggleExpanded }) => {
  const programOptions = [
    { value: 'all', label: 'All Programs' },
    { value: 'btech-cse', label: 'B.Tech Computer Science' },
    { value: 'btech-ece', label: 'B.Tech Electronics' },
    { value: 'mtech-cse', label: 'M.Tech Computer Science' },
    { value: 'bed', label: 'B.Ed' },
    { value: 'med', label: 'M.Ed' }
  ];

  const semesterOptions = [
    { value: 'all', label: 'All Semesters' },
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Semester 3' },
    { value: '4', label: 'Semester 4' },
    { value: '5', label: 'Semester 5' },
    { value: '6', label: 'Semester 6' },
    { value: '7', label: 'Semester 7' },
    { value: '8', label: 'Semester 8' }
  ];

  const facultyOptions = [
    { value: 'all', label: 'All Faculty' },
    { value: 'dr-sharma', label: 'Dr. Rajesh Sharma' },
    { value: 'prof-gupta', label: 'Prof. Priya Gupta' },
    { value: 'dr-singh', label: 'Dr. Amit Singh' },
    { value: 'prof-verma', label: 'Prof. Sunita Verma' },
    { value: 'dr-kumar', label: 'Dr. Vikash Kumar' }
  ];

  const roomOptions = [
    { value: 'all', label: 'All Rooms' },
    { value: 'room-101', label: 'Room 101' },
    { value: 'room-102', label: 'Room 102' },
    { value: 'lab-cs1', label: 'CS Lab 1' },
    { value: 'lab-cs2', label: 'CS Lab 2' },
    { value: 'auditorium', label: 'Main Auditorium' }
  ];

  const courseTypeOptions = [
    { value: 'all', label: 'All Course Types' },
    { value: 'major', label: 'Major Courses' },
    { value: 'minor', label: 'Minor Courses' },
    { value: 'ability', label: 'Ability Enhancement' },
    { value: 'skill', label: 'Skill Enhancement' },
    { value: 'value', label: 'Value Added' }
  ];

  const activeFiltersCount = Object.values(filters)?.filter(value => value !== 'all')?.length;

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpanded}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <Select
            label="Program"
            options={programOptions}
            value={filters?.program}
            onChange={(value) => onFilterChange('program', value)}
            className="w-full"
          />
          <Select
            label="Semester"
            options={semesterOptions}
            value={filters?.semester}
            onChange={(value) => onFilterChange('semester', value)}
            className="w-full"
          />
          <Select
            label="Faculty"
            options={facultyOptions}
            value={filters?.faculty}
            onChange={(value) => onFilterChange('faculty', value)}
            searchable
            className="w-full"
          />
          <Select
            label="Room"
            options={roomOptions}
            value={filters?.room}
            onChange={(value) => onFilterChange('room', value)}
            className="w-full"
          />
          <Select
            label="Course Type"
            options={courseTypeOptions}
            value={filters?.courseType}
            onChange={(value) => onFilterChange('courseType', value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default FilterPanel;