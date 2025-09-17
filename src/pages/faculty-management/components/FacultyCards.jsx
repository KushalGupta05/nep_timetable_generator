import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FacultyCards = ({ faculty, onEditFaculty, onViewAvailability }) => {
  const getWorkloadStatus = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return { status: 'overloaded', color: 'text-error', bgColor: 'bg-error/10' };
    if (percentage >= 75) return { status: 'high', color: 'text-warning', bgColor: 'bg-warning/10' };
    return { status: 'normal', color: 'text-success', bgColor: 'bg-success/10' };
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

  if (faculty?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Faculty Found</h3>
        <p className="text-muted-foreground">
          No faculty members match your current search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {faculty?.map((member) => {
        const workloadStatus = getWorkloadStatus(member?.workloadHours, member?.maxWorkload);
        
        return (
          <div key={member?.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{member?.name}</h3>
                  <p className="text-sm text-muted-foreground">{member?.designation}</p>
                </div>
              </div>
              {getAvailabilityBadge(member?.availabilityStatus)}
            </div>
            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Mail" size={14} />
                <span className="truncate">{member?.email}</span>
              </div>
              {member?.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Phone" size={14} />
                  <span>{member?.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Building2" size={14} />
                <span>{member?.department}</span>
              </div>
            </div>
            {/* Workload */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Workload</span>
                <span className={`text-sm font-medium ${workloadStatus?.color}`}>
                  {member?.workloadHours}/{member?.maxWorkload}h
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    workloadStatus?.status === 'overloaded' ? 'bg-error' :
                    workloadStatus?.status === 'high' ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min((member?.workloadHours / member?.maxWorkload) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {Math.round((member?.workloadHours / member?.maxWorkload) * 100)}% utilized
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${workloadStatus?.bgColor} ${workloadStatus?.color}`}>
                  {workloadStatus?.status === 'overloaded' ? 'Overloaded' :
                   workloadStatus?.status === 'high' ? 'High Load' : 'Normal'}
                </span>
              </div>
            </div>
            {/* Expertise */}
            <div className="mb-6">
              <span className="text-sm font-medium text-foreground mb-2 block">Expertise</span>
              <div className="flex flex-wrap gap-1">
                {member?.expertise?.slice(0, 3)?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-md"
                  >
                    {skill}
                  </span>
                ))}
                {member?.expertise?.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
                    +{member?.expertise?.length - 3} more
                  </span>
                )}
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewAvailability(member)}
                iconName="Calendar"
                iconPosition="left"
                className="flex-1"
              >
                Schedule
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onEditFaculty(member)}
                iconName="Edit"
                iconPosition="left"
                className="flex-1"
              >
                Edit
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FacultyCards;