import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimetableGrid = ({ schedule, conflicts, onCellClick, onExport }) => {
  const [selectedCell, setSelectedCell] = useState(null);

  const timeSlots = [
    '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const courseCategories = {
    'major': { color: 'bg-blue-100 border-blue-300 text-blue-800', label: 'Major' },
    'minor': { color: 'bg-green-100 border-green-300 text-green-800', label: 'Minor' },
    'skill': { color: 'bg-purple-100 border-purple-300 text-purple-800', label: 'Skill' },
    'value': { color: 'bg-orange-100 border-orange-300 text-orange-800', label: 'Value Added' },
    'lab': { color: 'bg-red-100 border-red-300 text-red-800', label: 'Laboratory' }
  };

  const mockSchedule = schedule || {
    'Monday': {
      '9:00-10:00': { 
        course: 'Data Structures', 
        faculty: 'Dr. Sharma', 
        room: 'CS-101', 
        category: 'major',
        students: 45 
      },
      '10:00-11:00': { 
        course: 'Database Systems', 
        faculty: 'Prof. Kumar', 
        room: 'CS-102', 
        category: 'major',
        students: 42 
      },
      '14:00-15:00': { 
        course: 'Web Development Lab', 
        faculty: 'Dr. Patel', 
        room: 'Lab-A', 
        category: 'lab',
        students: 30 
      }
    },
    'Tuesday': {
      '9:00-10:00': { 
        course: 'Machine Learning', 
        faculty: 'Dr. Singh', 
        room: 'CS-103', 
        category: 'major',
        students: 38 
      },
      '11:00-12:00': { 
        course: 'Communication Skills', 
        faculty: 'Prof. Gupta', 
        room: 'LH-201', 
        category: 'skill',
        students: 50 
      }
    },
    'Wednesday': {
      '10:00-11:00': { 
        course: 'Environmental Studies', 
        faculty: 'Dr. Verma', 
        room: 'GH-101', 
        category: 'value',
        students: 60 
      },
      '15:00-16:00': { 
        course: 'AI Lab', 
        faculty: 'Dr. Sharma', 
        room: 'Lab-B', 
        category: 'lab',
        students: 25 
      }
    }
  };

  const mockConflicts = conflicts || [
    { day: 'Monday', time: '9:00-10:00', type: 'faculty', message: 'Dr. Sharma has overlapping classes' },
    { day: 'Tuesday', time: '11:00-12:00', type: 'room', message: 'Room capacity exceeded by 10 students' }
  ];

  const hasConflict = (day, time) => {
    return mockConflicts?.some(conflict => conflict?.day === day && conflict?.time === time);
  };

  const getConflictDetails = (day, time) => {
    return mockConflicts?.find(conflict => conflict?.day === day && conflict?.time === time);
  };

  const handleCellClick = (day, time, classData) => {
    setSelectedCell({ day, time, classData });
    onCellClick && onCellClick(day, time, classData);
  };

  if (!schedule && !mockSchedule) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Schedule Generated</h3>
        <p className="text-muted-foreground">
          Use the generation controls above to create your timetable
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Generated Timetable</h3>
              <p className="text-sm text-muted-foreground">
                B.Tech Computer Science - Semester 5
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onExport && onExport('pdf')}
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="FileSpreadsheet"
              iconPosition="left"
              onClick={() => onExport && onExport('excel')}
            >
              Export Excel
            </Button>
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="p-4 bg-muted border-b border-border">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-foreground">Course Categories:</span>
          {Object.entries(courseCategories)?.map(([key, category]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded border ${category?.color}`} />
              <span className="text-xs text-muted-foreground">{category?.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 ml-4">
            <Icon name="AlertTriangle" size={12} className="text-warning" />
            <span className="text-xs text-muted-foreground">Conflict</span>
          </div>
        </div>
      </div>
      {/* Desktop Grid */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 text-left text-sm font-medium text-foreground bg-muted">
                Time
              </th>
              {days?.map(day => (
                <th key={day} className="p-4 text-left text-sm font-medium text-foreground bg-muted min-w-[200px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots?.map(time => (
              <tr key={time} className="border-b border-border">
                <td className="p-4 text-sm font-medium text-foreground bg-muted whitespace-nowrap">
                  {time}
                </td>
                {days?.map(day => {
                  const classData = mockSchedule?.[day]?.[time];
                  const conflict = hasConflict(day, time);
                  
                  return (
                    <td key={`${day}-${time}`} className="p-2 align-top">
                      {classData ? (
                        <div
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                            courseCategories?.[classData?.category]?.color || 'bg-gray-100 border-gray-300 text-gray-800'
                          } ${conflict ? 'ring-2 ring-warning' : ''}`}
                          onClick={() => handleCellClick(day, time, classData)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold leading-tight">
                              {classData?.course}
                            </h4>
                            {conflict && (
                              <Icon name="AlertTriangle" size={14} className="text-warning flex-shrink-0 ml-1" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs opacity-80 flex items-center gap-1">
                              <Icon name="User" size={10} />
                              {classData?.faculty}
                            </p>
                            <p className="text-xs opacity-80 flex items-center gap-1">
                              <Icon name="MapPin" size={10} />
                              {classData?.room}
                            </p>
                            <p className="text-xs opacity-80 flex items-center gap-1">
                              <Icon name="Users" size={10} />
                              {classData?.students} students
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-20 border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Free</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {days?.map(day => (
          <div key={day} className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted p-3 border-b border-border">
              <h4 className="font-semibold text-foreground">{day}</h4>
            </div>
            <div className="p-3 space-y-3">
              {timeSlots?.map(time => {
                const classData = mockSchedule?.[day]?.[time];
                const conflict = hasConflict(day, time);
                
                if (!classData) return null;
                
                return (
                  <div
                    key={time}
                    className={`p-3 rounded-lg border-2 ${
                      courseCategories?.[classData?.category]?.color || 'bg-gray-100 border-gray-300 text-gray-800'
                    } ${conflict ? 'ring-2 ring-warning' : ''}`}
                    onClick={() => handleCellClick(day, time, classData)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-sm">{classData?.course}</h5>
                        <p className="text-xs opacity-80">{time}</p>
                      </div>
                      {conflict && (
                        <Icon name="AlertTriangle" size={16} className="text-warning" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs opacity-80">
                      <div className="flex items-center gap-1">
                        <Icon name="User" size={10} />
                        {classData?.faculty}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={10} />
                        {classData?.room}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* Conflict Details Modal */}
      {selectedCell && hasConflict(selectedCell?.day, selectedCell?.time) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-foreground">Conflict Details</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCell(null)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-warning">
                <Icon name="AlertTriangle" size={16} />
                <span className="font-medium">Scheduling Conflict</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getConflictDetails(selectedCell?.day, selectedCell?.time)?.message}
              </p>
              <div className="pt-4 border-t border-border">
                <Button variant="outline" size="sm" fullWidth>
                  View Resolution Suggestions
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableGrid;