import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FacultyTable = ({ faculty, onEditFaculty, onViewAvailability }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedFaculty = faculty?.filter(member => {
      const matchesDepartment = !filterDepartment || member?.department === filterDepartment;
      const matchesSearch = !searchQuery || 
        member?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        member?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      return matchesDepartment && matchesSearch;
    })?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];
      
      if (sortField === 'workloadHours' || sortField === 'maxWorkload') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getWorkloadStatus = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return { status: 'overloaded', color: 'text-error' };
    if (percentage >= 75) return { status: 'high', color: 'text-warning' };
    return { status: 'normal', color: 'text-success' };
  };

  const getAvailabilityBadge = (status) => {
    const badges = {
      available: { label: 'Available', className: 'bg-success/10 text-success border-success/20' },
      partial: { label: 'Partial', className: 'bg-warning/10 text-warning border-warning/20' },
      unavailable: { label: 'Unavailable', className: 'bg-error/10 text-error border-error/20' }
    };
    
    const badge = badges?.[status] || badges?.available;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${badge?.className}`}>
        {badge?.label}
      </span>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Header with filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Faculty Directory</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage faculty profiles, availability, and workload assignments
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Input
              type="search"
              placeholder="Search faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full sm:w-64"
            />
            
            <Select
              options={departments}
              value={filterDepartment}
              onChange={setFilterDepartment}
              placeholder="Filter by department"
              className="w-full sm:w-48"
            />
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Faculty Name
                  <Icon 
                    name={sortField === 'name' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Department
                  <Icon 
                    name={sortField === 'department' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Expertise</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('workloadHours')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Workload
                  <Icon 
                    name={sortField === 'workloadHours' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Availability</th>
              <th className="text-right p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedFaculty?.map((member) => {
              const workloadStatus = getWorkloadStatus(member?.workloadHours, member?.maxWorkload);
              
              return (
                <tr key={member?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member?.name}</p>
                        <p className="text-sm text-muted-foreground">{member?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">{member?.department}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {member?.expertise?.slice(0, 2)?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {member?.expertise?.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
                          +{member?.expertise?.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${workloadStatus?.color}`}>
                        {member?.workloadHours}/{member?.maxWorkload}h
                      </span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            workloadStatus?.status === 'overloaded' ? 'bg-error' :
                            workloadStatus?.status === 'high' ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min((member?.workloadHours / member?.maxWorkload) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {getAvailabilityBadge(member?.availabilityStatus)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewAvailability(member)}
                        iconName="Calendar"
                        iconPosition="left"
                      >
                        Schedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditFaculty(member)}
                        iconName="Edit"
                        iconPosition="left"
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredAndSortedFaculty?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Faculty Found</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterDepartment 
              ? 'Try adjusting your search or filter criteria.' :'No faculty members have been added yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FacultyTable;