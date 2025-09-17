import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FacultyModal = ({ isOpen, onClose, faculty, onSave, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    expertise: [],
    maxWorkload: 20,
    specialRequirements: ''
  });

  const [errors, setErrors] = useState({});

  const departments = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' }
  ];

  const designations = [
    { value: 'Professor', label: 'Professor' },
    { value: 'Associate Professor', label: 'Associate Professor' },
    { value: 'Assistant Professor', label: 'Assistant Professor' },
    { value: 'Lecturer', label: 'Lecturer' },
    { value: 'Guest Faculty', label: 'Guest Faculty' }
  ];

  const expertiseOptions = [
    'Data Structures', 'Algorithms', 'Database Systems', 'Web Development',
    'Machine Learning', 'Artificial Intelligence', 'Computer Networks',
    'Operating Systems', 'Software Engineering', 'Calculus', 'Linear Algebra',
    'Statistics', 'Discrete Mathematics', 'Quantum Physics', 'Thermodynamics',
    'Organic Chemistry', 'Inorganic Chemistry', 'Literature', 'Grammar',
    'Ancient History', 'Modern History'
  ];

  useEffect(() => {
    if (faculty && mode === 'edit') {
      setFormData({
        name: faculty?.name || '',
        email: faculty?.email || '',
        phone: faculty?.phone || '',
        department: faculty?.department || '',
        designation: faculty?.designation || '',
        expertise: faculty?.expertise || [],
        maxWorkload: faculty?.maxWorkload || 20,
        specialRequirements: faculty?.specialRequirements || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        expertise: [],
        maxWorkload: 20,
        specialRequirements: ''
      });
    }
    setErrors({});
  }, [faculty, mode, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleExpertiseChange = (skill, checked) => {
    setFormData(prev => ({
      ...prev,
      expertise: checked 
        ? [...prev?.expertise, skill]
        : prev?.expertise?.filter(s => s !== skill)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) newErrors.name = 'Name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Invalid email format';
    if (!formData?.department) newErrors.department = 'Department is required';
    if (!formData?.designation) newErrors.designation = 'Designation is required';
    if (formData?.expertise?.length === 0) newErrors.expertise = 'At least one expertise area is required';
    if (!formData?.maxWorkload || formData?.maxWorkload < 1) newErrors.maxWorkload = 'Valid workload limit is required';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        id: faculty?.id || Date.now(),
        workloadHours: faculty?.workloadHours || 0,
        availabilityStatus: faculty?.availabilityStatus || 'available'
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {mode === 'edit' ? 'Edit Faculty Member' : 'Add New Faculty'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === 'edit' ? 'Update faculty information and preferences' : 'Add a new faculty member to the system'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter faculty name"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  error={errors?.name}
                  required
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="faculty@university.edu"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                />
                
                <Input
                  label="Maximum Workload (hours/week)"
                  type="number"
                  min="1"
                  max="40"
                  placeholder="20"
                  value={formData?.maxWorkload}
                  onChange={(e) => handleInputChange('maxWorkload', parseInt(e?.target?.value))}
                  error={errors?.maxWorkload}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Department"
                  options={departments}
                  value={formData?.department}
                  onChange={(value) => handleInputChange('department', value)}
                  placeholder="Select department"
                  error={errors?.department}
                  required
                />
                
                <Select
                  label="Designation"
                  options={designations}
                  value={formData?.designation}
                  onChange={(value) => handleInputChange('designation', value)}
                  placeholder="Select designation"
                  error={errors?.designation}
                  required
                />
              </div>
            </div>

            {/* Expertise Areas */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">Expertise Areas</h3>
                <p className="text-sm text-muted-foreground">Select subjects and areas of expertise</p>
                {errors?.expertise && (
                  <p className="text-sm text-error mt-1">{errors?.expertise}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-border rounded-md p-4">
                {expertiseOptions?.map((skill) => (
                  <Checkbox
                    key={skill}
                    label={skill}
                    checked={formData?.expertise?.includes(skill)}
                    onChange={(e) => handleExpertiseChange(skill, e?.target?.checked)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Special Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Special Requirements</h3>
              
              <div className="space-y-4">
                <Input
                  label="Special Scheduling Requirements"
                  type="text"
                  placeholder="e.g., No classes before 10 AM, Prefer morning slots"
                  value={formData?.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
                  description="Optional notes about scheduling preferences or constraints"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" iconName="Save" iconPosition="left">
              {mode === 'edit' ? 'Update Faculty' : 'Add Faculty'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyModal;