import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const GenerationControls = ({ onGenerate, isGenerating }) => {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [constraints, setConstraints] = useState({
    avoidMorningClasses: false,
    balanceWorkload: true,
    prioritizeLabSlots: false,
    minimizeGaps: true
  });
  const [optimizationLevel, setOptimizationLevel] = useState('balanced');

  const programOptions = [
    { value: 'btech-cse', label: 'B.Tech Computer Science' },
    { value: 'btech-ece', label: 'B.Tech Electronics' },
    { value: 'mtech-cse', label: 'M.Tech Computer Science' },
    { value: 'bed-math', label: 'B.Ed Mathematics' },
    { value: 'med-english', label: 'M.Ed English' }
  ];

  const semesterOptions = [
    { value: 'sem1', label: 'Semester 1' },
    { value: 'sem2', label: 'Semester 2' },
    { value: 'sem3', label: 'Semester 3' },
    { value: 'sem4', label: 'Semester 4' },
    { value: 'sem5', label: 'Semester 5' },
    { value: 'sem6', label: 'Semester 6' },
    { value: 'sem7', label: 'Semester 7' },
    { value: 'sem8', label: 'Semester 8' }
  ];

  const optimizationOptions = [
    { value: 'fast', label: 'Fast Generation' },
    { value: 'balanced', label: 'Balanced Optimization' },
    { value: 'thorough', label: 'Thorough Analysis' }
  ];

  const handleConstraintChange = (key, checked) => {
    setConstraints(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleGenerate = () => {
    if (!selectedProgram || !selectedSemester) {
      alert('Please select both program and semester');
      return;
    }
    
    onGenerate({
      program: selectedProgram,
      semester: selectedSemester,
      constraints,
      optimizationLevel
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Generation Controls</h2>
          <p className="text-sm text-muted-foreground">Configure parameters for AI-assisted timetable generation</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program and Semester Selection */}
        <div className="space-y-4">
          <Select
            label="Select Program"
            placeholder="Choose academic program"
            options={programOptions}
            value={selectedProgram}
            onChange={setSelectedProgram}
            required
            searchable
          />
          
          <Select
            label="Select Semester"
            placeholder="Choose semester"
            options={semesterOptions}
            value={selectedSemester}
            onChange={setSelectedSemester}
            required
          />
        </div>

        {/* Constraints and Optimization */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Scheduling Constraints
            </label>
            <div className="space-y-3">
              <Checkbox
                label="Avoid early morning classes (before 9 AM)"
                checked={constraints?.avoidMorningClasses}
                onChange={(e) => handleConstraintChange('avoidMorningClasses', e?.target?.checked)}
              />
              <Checkbox
                label="Balance faculty workload distribution"
                checked={constraints?.balanceWorkload}
                onChange={(e) => handleConstraintChange('balanceWorkload', e?.target?.checked)}
              />
              <Checkbox
                label="Prioritize lab slots in afternoon"
                checked={constraints?.prioritizeLabSlots}
                onChange={(e) => handleConstraintChange('prioritizeLabSlots', e?.target?.checked)}
              />
              <Checkbox
                label="Minimize gaps between classes"
                checked={constraints?.minimizeGaps}
                onChange={(e) => handleConstraintChange('minimizeGaps', e?.target?.checked)}
              />
            </div>
          </div>

          <Select
            label="Optimization Level"
            description="Higher levels take more time but provide better results"
            options={optimizationOptions}
            value={optimizationLevel}
            onChange={setOptimizationLevel}
          />
        </div>
      </div>
      {/* Generation Button */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <Icon name="Info" size={16} className="inline mr-2" />
            Generation typically takes 2-5 minutes depending on complexity
          </div>
          <Button
            variant="default"
            size="lg"
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!selectedProgram || !selectedSemester}
            iconName="Zap"
            iconPosition="left"
          >
            {isGenerating ? 'Generating Schedule...' : 'Generate Timetable'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerationControls;