import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CourseDetailModal = ({ course, isOpen, onClose }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{course?.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{course?.code}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Course Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="text-foreground">{course?.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground capitalize">{course?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="text-foreground">{course?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="text-foreground">{course?.duration} minutes</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Schedule Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Day:</span>
                    <span className="text-foreground">{course?.day}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="text-foreground">{course?.startTime} - {course?.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room:</span>
                    <span className="text-foreground">{course?.room}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Faculty Information</h3>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{course?.faculty}</p>
                      <p className="text-sm text-muted-foreground">{course?.facultyDepartment}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Mail" size={14} className="text-muted-foreground" />
                      <span className="text-foreground">{course?.facultyEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Phone" size={14} className="text-muted-foreground" />
                      <span className="text-foreground">{course?.facultyPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Room Details</h3>
                <div className="bg-muted rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="text-foreground">{course?.roomCapacity} students</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Building:</span>
                      <span className="text-foreground">{course?.building}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Floor:</span>
                      <span className="text-foreground">{course?.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Facilities:</span>
                      <span className="text-foreground">{course?.facilities}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {course?.description && (
            <div>
              <h3 className="font-medium text-foreground mb-2">Course Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {course?.description}
              </p>
            </div>
          )}

          {course?.prerequisites && course?.prerequisites?.length > 0 && (
            <div>
              <h3 className="font-medium text-foreground mb-2">Prerequisites</h3>
              <div className="flex flex-wrap gap-2">
                {course?.prerequisites?.map((prereq, index) => (
                  <span
                    key={index}
                    className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="default"
            iconName="ExternalLink"
            iconPosition="right"
            iconSize={16}
          >
            View Full Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;