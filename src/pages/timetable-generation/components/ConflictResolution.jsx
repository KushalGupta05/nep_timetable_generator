import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConflictResolution = ({ conflicts, onResolveConflict, onResolveAll }) => {
  const [expandedConflict, setExpandedConflict] = useState(null);

  const mockConflicts = conflicts || [
    {
      id: 1,
      type: 'faculty_overlap',
      severity: 'high',
      title: 'Faculty Double Booking',
      description: 'Dr. Sharma is assigned to two classes at the same time',
      details: {
        time: 'Monday 9:00-10:00',
        courses: ['Data Structures (CS-101)', 'Algorithm Design (CS-102)'],
        affectedStudents: 87
      },
      suggestions: [
        { action: 'Reassign Dr. Patel to Algorithm Design', impact: 'No schedule changes needed' },
        { action: 'Move Data Structures to 10:00-11:00', impact: '45 students affected' },
        { action: 'Split Algorithm Design into two sections', impact: 'Requires additional room' }
      ]
    },
    {
      id: 2,
      type: 'room_capacity',
      severity: 'medium',
      title: 'Room Capacity Exceeded',
      description: 'CS-103 has 50 seats but 62 students enrolled',
      details: {
        time: 'Tuesday 11:00-12:00',
        course: 'Machine Learning',
        capacity: 50,
        enrolled: 62
      },
      suggestions: [
        { action: 'Move to Lecture Hall LH-201 (100 seats)', impact: 'No other changes needed' },
        { action: 'Split into two sections', impact: 'Requires additional faculty time' },
        { action: 'Use hybrid mode (30 in-person, 32 online)', impact: 'Technology setup required' }
      ]
    },
    {
      id: 3,
      type: 'resource_conflict',
      severity: 'low',
      title: 'Lab Equipment Shortage',
      description: 'AI Lab requires 30 workstations but only 25 available',
      details: {
        time: 'Wednesday 15:00-16:00',
        course: 'Artificial Intelligence Lab',
        required: 30,
        available: 25
      },
      suggestions: [
        { action: 'Pair programming (2 students per workstation)', impact: 'Adjusted lab methodology' },
        { action: 'Move to Lab-C with 35 workstations', impact: 'Different software configuration' },
        { action: 'Reduce batch size to 25 students', impact: 'Some students move to next batch' }
      ]
    }
  ];

  const severityConfig = {
    high: { color: 'text-red-600 bg-red-50 border-red-200', icon: 'AlertCircle' },
    medium: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: 'AlertTriangle' },
    low: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: 'Info' }
  };

  const handleResolveConflict = (conflictId, suggestionIndex) => {
    onResolveConflict && onResolveConflict(conflictId, suggestionIndex);
  };

  if (!mockConflicts?.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} color="white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Conflicts Detected</h3>
        <p className="text-muted-foreground">
          Your timetable has been generated successfully without any scheduling conflicts.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Conflict Resolution</h3>
              <p className="text-sm text-muted-foreground">
                {mockConflicts?.length} conflicts detected - review and resolve
              </p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            iconName="Zap"
            iconPosition="left"
            onClick={() => onResolveAll && onResolveAll()}
          >
            Auto-Resolve All
          </Button>
        </div>
      </div>
      {/* Conflicts List */}
      <div className="divide-y divide-border">
        {mockConflicts?.map((conflict) => {
          const isExpanded = expandedConflict === conflict?.id;
          const severityStyle = severityConfig?.[conflict?.severity];

          return (
            <div key={conflict?.id} className="p-6">
              <div className="flex items-start gap-4">
                {/* Severity Indicator */}
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${severityStyle?.color}`}>
                  <Icon name={severityStyle?.icon} size={20} />
                </div>

                {/* Conflict Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-base font-semibold text-foreground">{conflict?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{conflict?.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityStyle?.color}`}>
                        {conflict?.severity?.toUpperCase()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                        onClick={() => setExpandedConflict(isExpanded ? null : conflict?.id)}
                      >
                        {isExpanded ? 'Less' : 'More'}
                      </Button>
                    </div>
                  </div>

                  {/* Conflict Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={14} />
                      <span>{conflict?.details?.time}</span>
                    </div>
                    {conflict?.details?.courses && (
                      <div className="flex items-center gap-2">
                        <Icon name="BookOpen" size={14} />
                        <span>{conflict?.details?.courses?.length} courses affected</span>
                      </div>
                    )}
                    {conflict?.details?.affectedStudents && (
                      <div className="flex items-center gap-2">
                        <Icon name="Users" size={14} />
                        <span>{conflict?.details?.affectedStudents} students</span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="bg-muted rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-foreground mb-3">Resolution Suggestions</h5>
                      <div className="space-y-3">
                        {conflict?.suggestions?.map((suggestion, index) => (
                          <div key={index} className="flex items-start justify-between p-3 bg-card rounded border border-border">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground mb-1">
                                {suggestion?.action}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Impact: {suggestion?.impact}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolveConflict(conflict?.id, index)}
                            >
                              Apply
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="RotateCcw"
                      iconPosition="left"
                    >
                      Skip for Now
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      iconName="CheckCircle"
                      iconPosition="left"
                    >
                      Auto-Resolve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer Actions */}
      <div className="p-6 border-t border-border bg-muted">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <Icon name="Info" size={16} className="inline mr-2" />
            Auto-resolution uses AI to find optimal solutions based on your constraints
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Export Conflict Report
            </Button>
            <Button variant="default" size="sm">
              Regenerate Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolution;