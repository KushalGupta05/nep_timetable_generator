import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ScenarioSimulation = ({ onRunSimulation, simulationResults }) => {
  const [selectedScenario, setSelectedScenario] = useState('');
  const [simulationParams, setSimulationParams] = useState({
    facultyUnavailable: [],
    roomsUnavailable: [],
    additionalConstraints: []
  });
  const [isRunning, setIsRunning] = useState(false);

  const scenarioOptions = [
    { value: 'faculty_leave', label: 'Faculty on Leave' },
    { value: 'room_maintenance', label: 'Room Maintenance' },
    { value: 'exam_period', label: 'Exam Period Adjustments' },
    { value: 'holiday_makeup', label: 'Holiday Makeup Classes' },
    { value: 'guest_lecture', label: 'Guest Lecture Integration' }
  ];

  const facultyOptions = [
    { value: 'dr_sharma', label: 'Dr. Sharma (Data Structures)' },
    { value: 'prof_kumar', label: 'Prof. Kumar (Database Systems)' },
    { value: 'dr_patel', label: 'Dr. Patel (Web Development)' },
    { value: 'dr_singh', label: 'Dr. Singh (Machine Learning)' },
    { value: 'prof_gupta', label: 'Prof. Gupta (Communication)' }
  ];

  const roomOptions = [
    { value: 'cs_101', label: 'CS-101 (50 seats)' },
    { value: 'cs_102', label: 'CS-102 (45 seats)' },
    { value: 'cs_103', label: 'CS-103 (50 seats)' },
    { value: 'lab_a', label: 'Lab-A (30 workstations)' },
    { value: 'lab_b', label: 'Lab-B (25 workstations)' },
    { value: 'lh_201', label: 'LH-201 (100 seats)' }
  ];

  const constraintOptions = [
    { value: 'no_back_to_back', label: 'No back-to-back classes for same faculty' },
    { value: 'lunch_break', label: 'Mandatory lunch break 12:00-13:00' },
    { value: 'lab_afternoon', label: 'All lab sessions in afternoon only' },
    { value: 'senior_morning', label: 'Senior faculty prefer morning slots' }
  ];

  const mockSimulationResults = simulationResults || {
    scenario: 'Faculty on Leave',
    impact: {
      classesAffected: 12,
      studentsImpacted: 245,
      roomChanges: 3,
      facultyReassignments: 2
    },
    alternatives: [
      {
        option: 'Substitute Faculty Assignment',
        feasibility: 85,
        changes: ['Dr. Verma covers Data Structures', 'Prof. Jain handles Database Systems'],
        pros: ['Minimal schedule disruption', 'Qualified substitutes available'],
        cons: ['Increased workload for substitute faculty']
      },
      {
        option: 'Schedule Rearrangement',
        feasibility: 70,
        changes: ['Move 4 classes to different time slots', 'Combine 2 theory sessions'],
        pros: ['No additional faculty needed', 'Better resource utilization'],
        cons: ['Students need to adjust schedules', 'Some preferred time slots lost']
      },
      {
        option: 'Online Mode Transition',
        feasibility: 95,
        changes: ['Convert 6 classes to online delivery', 'Hybrid mode for lab sessions'],
        pros: ['No faculty substitution needed', 'Flexible delivery mode'],
        cons: ['Technology requirements', 'Reduced hands-on experience']
      }
    ]
  };

  const handleRunSimulation = async () => {
    if (!selectedScenario) {
      alert('Please select a scenario to simulate');
      return;
    }

    setIsRunning(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRunning(false);
      onRunSimulation && onRunSimulation({
        scenario: selectedScenario,
        params: simulationParams
      });
    }, 3000);
  };

  const handleConstraintChange = (constraint, checked) => {
    setSimulationParams(prev => ({
      ...prev,
      additionalConstraints: checked 
        ? [...prev?.additionalConstraints, constraint]
        : prev?.additionalConstraints?.filter(c => c !== constraint)
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Play" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Scenario Simulation</h3>
            <p className="text-sm text-muted-foreground">
              Test different scenarios and view their impact on your timetable
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Simulation Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <Select
              label="Select Scenario"
              placeholder="Choose simulation scenario"
              options={scenarioOptions}
              value={selectedScenario}
              onChange={setSelectedScenario}
              required
            />

            {selectedScenario === 'faculty_leave' && (
              <Select
                label="Faculty Unavailable"
                placeholder="Select faculty members"
                options={facultyOptions}
                value={simulationParams?.facultyUnavailable}
                onChange={(value) => setSimulationParams(prev => ({
                  ...prev,
                  facultyUnavailable: value
                }))}
                multiple
                searchable
              />
            )}

            {selectedScenario === 'room_maintenance' && (
              <Select
                label="Rooms Unavailable"
                placeholder="Select rooms under maintenance"
                options={roomOptions}
                value={simulationParams?.roomsUnavailable}
                onChange={(value) => setSimulationParams(prev => ({
                  ...prev,
                  roomsUnavailable: value
                }))}
                multiple
                searchable
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Additional Constraints
              </label>
              <div className="space-y-3">
                {constraintOptions?.map((constraint) => (
                  <Checkbox
                    key={constraint?.value}
                    label={constraint?.label}
                    checked={simulationParams?.additionalConstraints?.includes(constraint?.value)}
                    onChange={(e) => handleConstraintChange(constraint?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              fullWidth
              loading={isRunning}
              disabled={!selectedScenario}
              iconName="Play"
              iconPosition="left"
              onClick={handleRunSimulation}
            >
              {isRunning ? 'Running Simulation...' : 'Run Simulation'}
            </Button>
          </div>
        </div>

        {/* Simulation Results */}
        {mockSimulationResults && !isRunning && (
          <div className="border-t border-border pt-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">Simulation Results</h4>
            
            {/* Impact Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {mockSimulationResults?.impact?.classesAffected}
                </div>
                <div className="text-sm text-muted-foreground">Classes Affected</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {mockSimulationResults?.impact?.studentsImpacted}
                </div>
                <div className="text-sm text-muted-foreground">Students Impacted</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {mockSimulationResults?.impact?.roomChanges}
                </div>
                <div className="text-sm text-muted-foreground">Room Changes</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {mockSimulationResults?.impact?.facultyReassignments}
                </div>
                <div className="text-sm text-muted-foreground">Faculty Changes</div>
              </div>
            </div>

            {/* Alternative Solutions */}
            <div className="space-y-4">
              <h5 className="font-semibold text-foreground">Alternative Solutions</h5>
              {mockSimulationResults?.alternatives?.map((alternative, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h6 className="font-medium text-foreground">{alternative?.option}</h6>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        alternative?.feasibility >= 80 ? 'bg-success' :
                        alternative?.feasibility >= 60 ? 'bg-warning' : 'bg-error'
                      }`} />
                      <span className="text-sm text-muted-foreground">
                        {alternative?.feasibility}% feasible
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-foreground mb-2">Changes Required:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        {alternative?.changes?.map((change, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Icon name="ArrowRight" size={12} className="mt-1 flex-shrink-0" />
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium text-foreground mb-2">Pros:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        {alternative?.pros?.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Icon name="Plus" size={12} className="mt-1 flex-shrink-0 text-success" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium text-foreground mb-2">Cons:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        {alternative?.cons?.map((con, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Icon name="Minus" size={12} className="mt-1 flex-shrink-0 text-error" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="default" size="sm">
                      Apply Solution
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioSimulation;