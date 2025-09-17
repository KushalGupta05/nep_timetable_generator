import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AvailabilityGrid = ({ isOpen, onClose, faculty, onSave }) => {
  const [availability, setAvailability] = useState({});
  const [selectionMode, setSelectionMode] = useState('available'); // available, preferred, unavailable
  const [isSelecting, setIsSelecting] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' }
  ];

  useEffect(() => {
    if (faculty && isOpen) {
      // Initialize with existing availability or default to available
      const initialAvailability = {};
      days?.forEach(day => {
        initialAvailability[day.key] = {};
        timeSlots?.forEach(time => {
          initialAvailability[day.key][time] = faculty?.availability?.[day?.key]?.[time] || 'available';
        });
      });
      setAvailability(initialAvailability);
    }
  }, [faculty, isOpen]);

  const getSlotClass = (status) => {
    const baseClass = "w-full h-8 border border-border rounded text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-105";
    
    switch (status) {
      case 'preferred':
        return `${baseClass} bg-success text-white border-success`;
      case 'available':
        return `${baseClass} bg-accent/20 text-accent border-accent/30 hover:bg-accent/30`;
      case 'unavailable':
        return `${baseClass} bg-error/20 text-error border-error/30`;
      default:
        return `${baseClass} bg-muted text-muted-foreground`;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'preferred': return 'P';
      case 'available': return 'A';
      case 'unavailable': return 'U';
      default: return '';
    }
  };

  const handleSlotClick = (day, time) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev?.[day],
        [time]: selectionMode
      }
    }));
  };

  const handleSlotMouseDown = (day, time) => {
    setIsSelecting(true);
    handleSlotClick(day, time);
  };

  const handleSlotMouseEnter = (day, time) => {
    if (isSelecting) {
      handleSlotClick(day, time);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const handleBulkUpdate = (day, status) => {
    setAvailability(prev => ({
      ...prev,
      [day]: Object.keys(prev?.[day])?.reduce((acc, time) => ({
        ...acc,
        [time]: status
      }), {})
    }));
  };

  const handleSave = () => {
    onSave({
      ...faculty,
      availability
    });
    onClose();
  };

  const getAvailabilityStats = () => {
    let preferred = 0, available = 0, unavailable = 0;
    
    Object.values(availability)?.forEach(daySlots => {
      Object.values(daySlots)?.forEach(status => {
        if (status === 'preferred') preferred++;
        else if (status === 'available') available++;
        else if (status === 'unavailable') unavailable++;
      });
    });

    const total = preferred + available + unavailable;
    return { preferred, available, unavailable, total };
  };

  if (!isOpen) return null;

  const stats = getAvailabilityStats();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Availability Schedule - {faculty?.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Set preferred, available, and unavailable time slots
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(90vh-140px)]">
          {/* Controls Sidebar */}
          <div className="lg:w-80 p-6 border-b lg:border-b-0 lg:border-r border-border bg-muted/30">
            <div className="space-y-6">
              {/* Selection Mode */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Selection Mode</h3>
                <div className="space-y-2">
                  {[
                    { value: 'preferred', label: 'Preferred', color: 'bg-success', icon: 'Heart' },
                    { value: 'available', label: 'Available', color: 'bg-accent', icon: 'Check' },
                    { value: 'unavailable', label: 'Unavailable', color: 'bg-error', icon: 'X' }
                  ]?.map(mode => (
                    <button
                      key={mode?.value}
                      onClick={() => setSelectionMode(mode?.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-md border transition-colors ${
                        selectionMode === mode?.value
                          ? 'border-primary bg-primary/10 text-primary' :'border-border hover:bg-muted'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded ${mode?.color}`} />
                      <Icon name={mode?.icon} size={16} />
                      <span className="text-sm font-medium">{mode?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {days?.map(day => (
                    <div key={day?.key} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-16 flex-shrink-0">
                        {day?.label?.slice(0, 3)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleBulkUpdate(day?.key, 'preferred')}
                          className="text-success hover:bg-success/10"
                        >
                          P
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleBulkUpdate(day?.key, 'available')}
                          className="text-accent hover:bg-accent/10"
                        >
                          A
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleBulkUpdate(day?.key, 'unavailable')}
                          className="text-error hover:bg-error/10"
                        >
                          U
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Availability Summary</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Preferred:</span>
                    <span className="text-success font-medium">{stats?.preferred}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="text-accent font-medium">{stats?.available}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Unavailable:</span>
                    <span className="text-error font-medium">{stats?.unavailable}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-foreground">Total Slots:</span>
                      <span className="text-foreground">{stats?.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="min-w-[800px]">
              {/* Legend */}
              <div className="flex items-center gap-6 mb-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success rounded" />
                  <span className="text-sm">Preferred (P)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-accent/40 border border-accent rounded" />
                  <span className="text-sm">Available (A)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-error/40 border border-error rounded" />
                  <span className="text-sm">Unavailable (U)</span>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Click and drag to select multiple slots
                </div>
              </div>

              {/* Time Grid */}
              <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-2" onMouseUp={handleMouseUp}>
                {/* Header */}
                <div className="font-medium text-sm text-center p-2">Time</div>
                {days?.map(day => (
                  <div key={day?.key} className="font-medium text-sm text-center p-2">
                    {day?.label}
                  </div>
                ))}

                {/* Time slots */}
                {timeSlots?.map(time => (
                  <React.Fragment key={time}>
                    <div className="text-sm text-muted-foreground text-right p-2 font-mono">
                      {time}
                    </div>
                    {days?.map(day => (
                      <button
                        key={`${day?.key}-${time}`}
                        className={getSlotClass(availability?.[day?.key]?.[time])}
                        onMouseDown={() => handleSlotMouseDown(day?.key, time)}
                        onMouseEnter={() => handleSlotMouseEnter(day?.key, time)}
                        title={`${day?.label} ${time} - ${availability?.[day?.key]?.[time]}`}
                      >
                        {getStatusLabel(availability?.[day?.key]?.[time])}
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} iconName="Save" iconPosition="left">
            Save Availability
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityGrid;