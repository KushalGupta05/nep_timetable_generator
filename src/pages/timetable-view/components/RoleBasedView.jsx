import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoleBasedView = ({ userRole, timetableData, onViewChange }) => {
  const getCurrentUser = () => {
    const users = {
      admin: {
        name: 'Dr. Sarah Johnson',
        role: 'Administrator',
        department: 'Academic Affairs',
        avatar: 'SJ'
      },
      faculty: {
        name: 'Prof. Rajesh Sharma',
        role: 'Faculty Member',
        department: 'Computer Science',
        avatar: 'RS'
      },
      student: {
        name: 'Priya Patel',
        role: 'Student',
        department: 'B.Tech CSE - Semester 5',
        avatar: 'PP'
      }
    };
    return users?.[userRole] || users?.admin;
  };

  const getPersonalizedData = () => {
    const user = getCurrentUser();
    
    switch (userRole) {
      case 'faculty':
        return {
          title: 'My Teaching Schedule',
          subtitle: `${user?.name} - ${user?.department}`,
          stats: [
            { label: 'Total Classes', value: '18', icon: 'BookOpen' },
            { label: 'Weekly Hours', value: '24', icon: 'Clock' },
            { label: 'Courses', value: '4', icon: 'GraduationCap' },
            { label: 'Students', value: '156', icon: 'Users' }
          ],
          courses: timetableData?.filter(course => course?.faculty === user?.name)
        };
      
      case 'student':
        return {
          title: 'My Class Schedule',
          subtitle: `${user?.name} - ${user?.department}`,
          stats: [
            { label: 'Total Credits', value: '22', icon: 'Award' },
            { label: 'Core Courses', value: '5', icon: 'BookOpen' },
            { label: 'Electives', value: '3', icon: 'Star' },
            { label: 'Labs', value: '2', icon: 'Cpu' }
          ],
          courses: timetableData?.filter(course => course?.studentEnrolled)
        };
      
      default: // admin
        return {
          title: 'Institution Overview',
          subtitle: `${user?.name} - ${user?.department}`,
          stats: [
            { label: 'Total Classes', value: '245', icon: 'Calendar' },
            { label: 'Active Faculty', value: '42', icon: 'Users' },
            { label: 'Programs', value: '8', icon: 'GraduationCap' },
            { label: 'Rooms Utilized', value: '28', icon: 'Building' }
          ],
          courses: timetableData
        };
    }
  };

  const personalizedData = getPersonalizedData();
  const user = getCurrentUser();

  const getUpcomingClasses = () => {
    const now = new Date();
    const today = now?.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now?.getHours() * 60 + now?.getMinutes();
    
    return personalizedData?.courses?.filter(course => {
        if (course?.day !== today) return false;
        const [startHour, startMin] = course?.startTime?.split(':')?.map(Number);
        const startTimeMinutes = startHour * 60 + startMin;
        return startTimeMinutes > currentTime;
      })?.slice(0, 3);
  };

  const upcomingClasses = getUpcomingClasses();

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
              {user?.avatar}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{personalizedData?.title}</h2>
              <p className="text-muted-foreground">{personalizedData?.subtitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-success">Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconSize={16}
            >
              Preferences
            </Button>
            {userRole === 'admin' && (
              <Button
                variant="default"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                onClick={() => onViewChange('manage')}
              >
                Manage Schedule
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {personalizedData?.stats?.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat?.label}</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stat?.value}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={stat?.icon} size={20} className="text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Upcoming Classes */}
      {upcomingClasses?.length > 0 && (
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Icon name="Clock" size={20} className="text-accent" />
              <h3 className="font-medium text-foreground">Upcoming Classes Today</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {upcomingClasses?.map((course, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="BookOpen" size={20} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground">{course?.code}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      course?.type === 'theory' ? 'bg-blue-100 text-blue-800' :
                      course?.type === 'practical' ? 'bg-green-100 text-green-800' :
                      course?.type === 'lab'? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {course?.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{course?.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      <span>{course?.startTime} - {course?.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="MapPin" size={12} />
                      <span>{course?.room}</span>
                    </div>
                    {userRole !== 'faculty' && (
                      <div className="flex items-center gap-1">
                        <Icon name="User" size={12} />
                        <span>{course?.faculty}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {(() => {
                      const [startHour, startMin] = course?.startTime?.split(':')?.map(Number);
                      const now = new Date();
                      const startTime = new Date(now);
                      startTime?.setHours(startHour, startMin, 0, 0);
                      const diffMs = startTime - now;
                      const diffMins = Math.floor(diffMs / (1000 * 60));
                      
                      if (diffMins < 60) return `${diffMins}m`;
                      const hours = Math.floor(diffMins / 60);
                      const mins = diffMins % 60;
                      return `${hours}h ${mins}m`;
                    })()}
                  </p>
                  <p className="text-xs text-muted-foreground">remaining</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {userRole === 'admin' && (
            <>
              <Button
                variant="outline"
                className="justify-start"
                iconName="Calendar"
                iconPosition="left"
                iconSize={16}
              >
                Generate New Schedule
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                iconName="Users"
                iconPosition="left"
                iconSize={16}
              >
                Manage Faculty
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                iconName="BarChart"
                iconPosition="left"
                iconSize={16}
              >
                View Analytics
              </Button>
            </>
          )}
          
          {userRole === 'faculty' && (
            <>
              <Button
                variant="outline"
                className="justify-start"
                iconName="Clock"
                iconPosition="left"
                iconSize={16}
              >
                Update Availability
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                iconName="FileText"
                iconPosition="left"
                iconSize={16}
              >
                View Workload Report
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                iconName="MessageSquare"
                iconPosition="left"
                iconSize={16}
              >
                Contact Admin
              </Button>
            </>
          )}
          
          {userRole === 'student' && (
            <>
              <Button
                variant="outline"
                className="justify-start"
                iconName="Star"
                iconPosition="left"
                iconSize={16}
              >
                Manage Electives
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Download Schedule
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                iconName="Bell"
                iconPosition="left"
                iconSize={16}
              >
                Set Reminders
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleBasedView;