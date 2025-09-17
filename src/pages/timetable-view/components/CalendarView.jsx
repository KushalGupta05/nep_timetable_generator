import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarView = ({ timetableData, onCourseClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getCoursesForDate = (date) => {
    if (!date) return [];
    const dayName = date?.toLocaleDateString('en-US', { weekday: 'long' });
    return timetableData?.filter(course => course?.day === dayName);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setMonth(currentDate?.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDay) return false;
    return date?.toDateString() === selectedDay?.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate?.toLocaleDateString('en-IN', { 
    month: 'long', 
    year: 'numeric' 
  });

  const selectedDayCourses = selectedDay ? getCoursesForDate(selectedDay) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{monthYear}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
            iconName="ChevronLeft"
            iconSize={16}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
            iconName="ChevronRight"
            iconSize={16}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-muted">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map(day => (
                <div key={day} className="p-3 text-center font-medium text-foreground border-r border-border last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {days?.map((date, index) => {
                const courses = getCoursesForDate(date);
                const hasClasses = courses?.length > 0;
                
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border-r border-b border-border last:border-r-0 ${
                      date ? 'cursor-pointer hover:bg-muted/50' : 'bg-gray-50'
                    } ${isSelected(date) ? 'bg-primary/10' : ''}`}
                    onClick={() => date && setSelectedDay(date)}
                  >
                    {date && (
                      <div className="h-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${
                            isToday(date) 
                              ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' 
                              : 'text-foreground'
                          }`}>
                            {date?.getDate()}
                          </span>
                          {hasClasses && (
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                          )}
                        </div>
                        
                        {/* Course indicators */}
                        <div className="space-y-1">
                          {courses?.slice(0, 2)?.map((course, courseIndex) => (
                            <div
                              key={courseIndex}
                              className="text-xs p-1 bg-accent/10 text-accent rounded truncate"
                              title={`${course?.code} - ${course?.name}`}
                            >
                              {course?.code}
                            </div>
                          ))}
                          {courses?.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{courses?.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Day Details Panel */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h4 className="font-medium text-foreground">
                {selectedDay 
                  ? selectedDay?.toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })
                  : 'Select a day to view schedule'
                }
              </h4>
            </div>

            <div className="p-4">
              {selectedDay ? (
                selectedDayCourses?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDayCourses?.map((course, index) => (
                      <button
                        key={index}
                        onClick={() => onCourseClick(course)}
                        className="w-full text-left p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm text-foreground">{course?.code}</p>
                            <p className="text-xs text-muted-foreground">{course?.name}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            course?.type === 'theory' ? 'bg-blue-100 text-blue-800' :
                            course?.type === 'practical' ? 'bg-green-100 text-green-800' :
                            course?.type === 'lab'? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {course?.type}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Icon name="Clock" size={12} />
                            <span>{course?.startTime} - {course?.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="MapPin" size={12} />
                            <span>{course?.room}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Icon name="User" size={12} />
                          <span>{course?.faculty}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No classes scheduled for this day</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <Icon name="CalendarDays" size={48} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Click on a date to view the schedule</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;