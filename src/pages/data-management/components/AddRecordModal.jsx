import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AddRecordModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  recordType, 
  editData = null 
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData(getDefaultFormData(recordType));
    }
    setErrors({});
  }, [editData, recordType, isOpen]);

  const getDefaultFormData = (type) => {
    const defaults = {
      students: {
        name: '',
        email: '',
        rollNumber: '',
        department: '',
        semester: '',
        program: '',
        phone: '',
        status: 'active'
      },
      faculty: {
        name: '',
        email: '',
        employeeId: '',
        department: '',
        designation: '',
        phone: '',
        expertise: '',
        maxHours: '',
        status: 'active'
      },
      rooms: {
        name: '',
        type: '',
        capacity: '',
        building: '',
        floor: '',
        equipment: '',
        status: 'available'
      },
      courses: {
        code: '',
        name: '',
        credits: '',
        type: '',
        department: '',
        semester: '',
        category: '',
        description: ''
      }
    };
    return defaults?.[type] || {};
  };

  const getFormFields = (type) => {
    const fields = {
      students: [
        { key: 'name', label: 'Full Name', type: 'text', required: true },
        { key: 'email', label: 'Email Address', type: 'email', required: true },
        { key: 'rollNumber', label: 'Roll Number', type: 'text', required: true },
        { 
          key: 'department', 
          label: 'Department', 
          type: 'select', 
          required: true,
          options: [
            { value: 'cse', label: 'Computer Science' },
            { value: 'ece', label: 'Electronics & Communication' },
            { value: 'me', label: 'Mechanical Engineering' },
            { value: 'ce', label: 'Civil Engineering' },
            { value: 'ee', label: 'Electrical Engineering' }
          ]
        },
        { 
          key: 'semester', 
          label: 'Semester', 
          type: 'select', 
          required: true,
          options: Array.from({length: 8}, (_, i) => ({ 
            value: (i + 1)?.toString(), 
            label: `Semester ${i + 1}` 
          }))
        },
        { 
          key: 'program', 
          label: 'Program', 
          type: 'select', 
          required: true,
          options: [
            { value: 'btech', label: 'B.Tech' },
            { value: 'mtech', label: 'M.Tech' },
            { value: 'bed', label: 'B.Ed' },
            { value: 'med', label: 'M.Ed' }
          ]
        },
        { key: 'phone', label: 'Phone Number', type: 'tel', required: false }
      ],
      faculty: [
        { key: 'name', label: 'Full Name', type: 'text', required: true },
        { key: 'email', label: 'Email Address', type: 'email', required: true },
        { key: 'employeeId', label: 'Employee ID', type: 'text', required: true },
        { 
          key: 'department', 
          label: 'Department', 
          type: 'select', 
          required: true,
          options: [
            { value: 'cse', label: 'Computer Science' },
            { value: 'ece', label: 'Electronics & Communication' },
            { value: 'me', label: 'Mechanical Engineering' },
            { value: 'ce', label: 'Civil Engineering' },
            { value: 'ee', label: 'Electrical Engineering' }
          ]
        },
        { 
          key: 'designation', 
          label: 'Designation', 
          type: 'select', 
          required: true,
          options: [
            { value: 'professor', label: 'Professor' },
            { value: 'associate_professor', label: 'Associate Professor' },
            { value: 'assistant_professor', label: 'Assistant Professor' },
            { value: 'lecturer', label: 'Lecturer' }
          ]
        },
        { key: 'phone', label: 'Phone Number', type: 'tel', required: false },
        { key: 'expertise', label: 'Area of Expertise', type: 'text', required: false },
        { key: 'maxHours', label: 'Max Hours per Week', type: 'number', required: true }
      ],
      rooms: [
        { key: 'name', label: 'Room Name/Number', type: 'text', required: true },
        { 
          key: 'type', 
          label: 'Room Type', 
          type: 'select', 
          required: true,
          options: [
            { value: 'classroom', label: 'Classroom' },
            { value: 'laboratory', label: 'Laboratory' },
            { value: 'seminar_hall', label: 'Seminar Hall' },
            { value: 'auditorium', label: 'Auditorium' },
            { value: 'library', label: 'Library' }
          ]
        },
        { key: 'capacity', label: 'Seating Capacity', type: 'number', required: true },
        { key: 'building', label: 'Building', type: 'text', required: true },
        { key: 'floor', label: 'Floor', type: 'text', required: false },
        { key: 'equipment', label: 'Available Equipment', type: 'text', required: false }
      ],
      courses: [
        { key: 'code', label: 'Course Code', type: 'text', required: true },
        { key: 'name', label: 'Course Name', type: 'text', required: true },
        { key: 'credits', label: 'Credit Hours', type: 'number', required: true },
        { 
          key: 'type', 
          label: 'Course Type', 
          type: 'select', 
          required: true,
          options: [
            { value: 'theory', label: 'Theory' },
            { value: 'practical', label: 'Practical' },
            { value: 'project', label: 'Project' }
          ]
        },
        { 
          key: 'department', 
          label: 'Department', 
          type: 'select', 
          required: true,
          options: [
            { value: 'cse', label: 'Computer Science' },
            { value: 'ece', label: 'Electronics & Communication' },
            { value: 'me', label: 'Mechanical Engineering' },
            { value: 'ce', label: 'Civil Engineering' },
            { value: 'ee', label: 'Electrical Engineering' }
          ]
        },
        { 
          key: 'semester', 
          label: 'Semester', 
          type: 'select', 
          required: true,
          options: Array.from({length: 8}, (_, i) => ({ 
            value: (i + 1)?.toString(), 
            label: `Semester ${i + 1}` 
          }))
        },
        { 
          key: 'category', 
          label: 'NEP Category', 
          type: 'select', 
          required: true,
          options: [
            { value: 'major', label: 'Major' },
            { value: 'minor', label: 'Minor' },
            { value: 'ability_enhancement', label: 'Ability Enhancement' },
            { value: 'skill', label: 'Skill Enhancement' },
            { value: 'value_added', label: 'Value Added' }
          ]
        },
        { key: 'description', label: 'Description', type: 'text', required: false }
      ]
    };
    return fields?.[type] || [];
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = getFormFields(recordType);
    
    fields?.forEach(field => {
      if (field?.required && !formData?.[field?.key]) {
        newErrors[field.key] = `${field?.label} is required`;
      }
      
      if (field?.type === 'email' && formData?.[field?.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex?.test(formData?.[field?.key])) {
          newErrors[field.key] = 'Please enter a valid email address';
        }
      }
      
      if (field?.type === 'number' && formData?.[field?.key]) {
        if (isNaN(formData?.[field?.key]) || Number(formData?.[field?.key]) <= 0) {
          newErrors[field.key] = 'Please enter a valid positive number';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors?.[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const fields = getFormFields(recordType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editData ? 'Edit' : 'Add'} {recordType?.charAt(0)?.toUpperCase() + recordType?.slice(1, -1)}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields?.map((field) => (
                <div key={field?.key} className={field?.key === 'description' ? 'md:col-span-2' : ''}>
                  {field?.type === 'select' ? (
                    <Select
                      label={field?.label}
                      required={field?.required}
                      options={field?.options}
                      value={formData?.[field?.key] || ''}
                      onChange={(value) => handleInputChange(field?.key, value)}
                      error={errors?.[field?.key]}
                    />
                  ) : (
                    <Input
                      label={field?.label}
                      type={field?.type}
                      required={field?.required}
                      value={formData?.[field?.key] || ''}
                      onChange={(e) => handleInputChange(field?.key, e?.target?.value)}
                      error={errors?.[field?.key]}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
            >
              {editData ? 'Update' : 'Save'} Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;