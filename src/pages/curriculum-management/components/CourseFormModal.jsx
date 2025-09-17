import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CourseFormModal = ({ isOpen, onClose, course, onSave, programs }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    credits: '',
    type: 'theory',
    category: 'major',
    program: '',
    semester: '',
    prerequisites: [],
    facultyRequirements: '',
    description: '',
    isElective: false,
    maxStudents: '',
    resourceRequirements: ''
  });

  const [errors, setErrors] = useState({});

  const nepCategories = [
    { value: 'major', label: 'Major Course' },
    { value: 'minor', label: 'Minor Course' },
    { value: 'ability-enhancement', label: 'Ability Enhancement Course' },
    { value: 'skill', label: 'Skill Enhancement Course' },
    { value: 'value-added', label: 'Value Added Course' },
    { value: 'foundation', label: 'Foundation Course' }
  ];

  const courseTypes = [
    { value: 'theory', label: 'Theory' },
    { value: 'practical', label: 'Practical' },
    { value: 'theory-practical', label: 'Theory + Practical' }
  ];

  const semesterOptions = [
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Semester 3' },
    { value: '4', label: 'Semester 4' },
    { value: '5', label: 'Semester 5' },
    { value: '6', label: 'Semester 6' },
    { value: '7', label: 'Semester 7' },
    { value: '8', label: 'Semester 8' }
  ];

  useEffect(() => {
    if (course) {
      setFormData({
        courseCode: course?.courseCode || '',
        title: course?.title || '',
        credits: course?.credits?.toString() || '',
        type: course?.type || 'theory',
        category: course?.category || 'major',
        program: course?.program || '',
        semester: course?.semester?.toString() || '',
        prerequisites: course?.prerequisites || [],
        facultyRequirements: course?.facultyRequirements || '',
        description: course?.description || '',
        isElective: course?.isElective || false,
        maxStudents: course?.maxStudents?.toString() || '',
        resourceRequirements: course?.resourceRequirements || ''
      });
    } else {
      setFormData({
        courseCode: '',
        title: '',
        credits: '',
        type: 'theory',
        category: 'major',
        program: '',
        semester: '',
        prerequisites: [],
        facultyRequirements: '',
        description: '',
        isElective: false,
        maxStudents: '',
        resourceRequirements: ''
      });
    }
    setErrors({});
  }, [course, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.courseCode?.trim()) {
      newErrors.courseCode = 'Course code is required';
    }
    if (!formData?.title?.trim()) {
      newErrors.title = 'Course title is required';
    }
    if (!formData?.credits || formData?.credits < 1 || formData?.credits > 10) {
      newErrors.credits = 'Credits must be between 1 and 10';
    }
    if (!formData?.program) {
      newErrors.program = 'Program selection is required';
    }
    if (!formData?.semester) {
      newErrors.semester = 'Semester selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      const courseData = {
        ...formData,
        credits: parseInt(formData?.credits),
        semester: parseInt(formData?.semester),
        maxStudents: formData?.maxStudents ? parseInt(formData?.maxStudents) : null,
        id: course?.id || Date.now(),
        lastModified: new Date()?.toISOString()
      };
      onSave(courseData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Course Code"
              type="text"
              placeholder="e.g., CS101"
              value={formData?.courseCode}
              onChange={(e) => handleInputChange('courseCode', e?.target?.value)}
              error={errors?.courseCode}
              required
            />

            <Select
              label="Program"
              options={programs}
              value={formData?.program}
              onChange={(value) => handleInputChange('program', value)}
              error={errors?.program}
              required
            />
          </div>

          <Input
            label="Course Title"
            type="text"
            placeholder="e.g., Introduction to Computer Science"
            value={formData?.title}
            onChange={(e) => handleInputChange('title', e?.target?.value)}
            error={errors?.title}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Credits"
              type="number"
              min="1"
              max="10"
              placeholder="4"
              value={formData?.credits}
              onChange={(e) => handleInputChange('credits', e?.target?.value)}
              error={errors?.credits}
              required
            />

            <Select
              label="Course Type"
              options={courseTypes}
              value={formData?.type}
              onChange={(value) => handleInputChange('type', value)}
            />

            <Select
              label="Semester"
              options={semesterOptions}
              value={formData?.semester}
              onChange={(value) => handleInputChange('semester', value)}
              error={errors?.semester}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="NEP 2020 Category"
              options={nepCategories}
              value={formData?.category}
              onChange={(value) => handleInputChange('category', value)}
            />

            <Input
              label="Max Students"
              type="number"
              placeholder="60"
              value={formData?.maxStudents}
              onChange={(e) => handleInputChange('maxStudents', e?.target?.value)}
            />
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Elective Course"
              description="Students can choose this course as an elective"
              checked={formData?.isElective}
              onChange={(e) => handleInputChange('isElective', e?.target?.checked)}
            />
          </div>

          <Input
            label="Faculty Requirements"
            type="text"
            placeholder="e.g., PhD in Computer Science, 5+ years experience"
            value={formData?.facultyRequirements}
            onChange={(e) => handleInputChange('facultyRequirements', e?.target?.value)}
          />

          <Input
            label="Resource Requirements"
            type="text"
            placeholder="e.g., Computer Lab, Projector, Software licenses"
            value={formData?.resourceRequirements}
            onChange={(e) => handleInputChange('resourceRequirements', e?.target?.value)}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Course Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={4}
              placeholder="Brief description of the course content and objectives..."
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {course ? 'Update Course' : 'Add Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;