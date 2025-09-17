import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const GridView = ({ timetableData, onCourseClick }) => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const weekOptions = [
    { value: 'current', label: 'Current Week' },
    { value: 'next', label: 'Next Week' },
    { value: 'previous', label: 'Previous Week' }
  ];

  const getCourseForSlot = (day, timeSlot) => {
    return timetableData?.find(course => 
      course?.day === day && 
      course?.timeSlot === timeSlot
    );
  };

  const getCourseTypeColor = (type) => {
    const colors = {
      'theory': 'bg-blue-100 border-blue-300 text-blue-800',
      'practical': 'bg-green-100 border-green-300 text-green-800',
      'tutorial': 'bg-purple-100 border-purple-300 text-purple-800',
      'lab': 'bg-orange-100 border-orange-300 text-orange-800'
    };
    return colors?.[type] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-foreground">Weekly Schedule</h3>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm"
          >
            {weekOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconName="ChevronLeft" iconSize={16}>
            Previous
          </Button>
          <Button variant="outline" size="sm" iconName="ChevronRight" iconSize={16}>
            Next
          </Button>
        </div>
      </div>
      {/* Timetable Grid */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-muted">
                <th className="w-32 p-4 text-left font-medium text-foreground border-r border-border">
                  Time
                </th>
                {days?.map(day => (
                  <th key={day} className="p-4 text-center font-medium text-foreground border-r border-border last:border-r-0">
                    <div className="flex flex-col">
                      <span>{day}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {new Date()?.toLocaleDateString('en-IN', { 
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short'
                        })}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots?.map((timeSlot, timeIndex) => (
                <tr key={timeSlot} className="border-t border-border">
                  <td className="p-4 font-medium text-sm text-muted-foreground bg-muted/50 border-r border-border">
                    {timeSlot}
                  </td>
                  {days?.map(day => {
                    const course = getCourseForSlot(day, timeSlot);
                    return (
                      <td key={`${day}-${timeSlot}`} className="p-2 border-r border-border last:border-r-0 h-20">
                        {course ? (
                          <button
                            onClick={() => onCourseClick(course)}
                            className={`w-full h-full p-2 rounded-md border-2 transition-all hover:shadow-md ${getCourseTypeColor(course?.type)}`}
                          >
                            <div className="text-left">
                              <p className="font-medium text-xs truncate">{course?.code}</p>
                              <p className="text-xs truncate">{course?.name}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs truncate">{course?.faculty}</span>
                                <span className="text-xs">{course?.room}</span>
                              </div>
                            </div>
                          </button>
                        ) : (
                          <div className="w-full h-full bg-gray-50 rounded-md border border-dashed border-gray-200"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
        <span className="text-sm font-medium text-foreground">Course Types:</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-sm text-muted-foreground">Theory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-muted-foreground">Practical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
            <span className="text-sm text-muted-foreground">Tutorial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
            <span className="text-sm text-muted-foreground">Lab</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridView;