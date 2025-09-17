import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CourseTable = ({ courses, onEdit, onDelete, onBulkAction, selectedCourses, onSelectCourse, onSelectAll }) => {
  const [sortField, setSortField] = useState('courseCode');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCourses = [...courses]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getCategoryBadge = (category) => {
    const categoryStyles = {
      'major': 'bg-blue-100 text-blue-800 border-blue-200',
      'minor': 'bg-green-100 text-green-800 border-green-200',
      'ability-enhancement': 'bg-purple-100 text-purple-800 border-purple-200',
      'skill': 'bg-orange-100 text-orange-800 border-orange-200',
      'value-added': 'bg-pink-100 text-pink-800 border-pink-200',
      'foundation': 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const categoryLabels = {
      'major': 'Major',
      'minor': 'Minor',
      'ability-enhancement': 'AEC',
      'skill': 'SEC',
      'value-added': 'VAC',
      'foundation': 'Foundation'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${categoryStyles?.[category] || categoryStyles?.foundation}`}>
        {categoryLabels?.[category] || category}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeStyles = {
      'theory': 'bg-blue-50 text-blue-700 border-blue-200',
      'practical': 'bg-green-50 text-green-700 border-green-200',
      'theory-practical': 'bg-purple-50 text-purple-700 border-purple-200'
    };

    const typeLabels = {
      'theory': 'Theory',
      'practical': 'Practical',
      'theory-practical': 'Theory + Practical'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${typeStyles?.[type] || typeStyles?.theory}`}>
        {typeLabels?.[type] || type}
      </span>
    );
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-medium text-foreground hover:text-primary transition-colors"
    >
      {children}
      <Icon 
        name={sortField === field ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
        size={14} 
      />
    </button>
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedCourses?.length > 0 && (
        <div className="bg-muted px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedCourses?.length} course{selectedCourses?.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onBulkAction('export')}>
                <Icon name="Download" size={16} />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => onBulkAction('duplicate')}>
                <Icon name="Copy" size={16} />
                Duplicate
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onBulkAction('delete')}>
                <Icon name="Trash2" size={16} />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedCourses?.length === courses?.length && courses?.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="courseCode">Course Code</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="title">Course Title</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="credits">Credits</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="type">Type</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="category">Category</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="program">Program</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="semester">Semester</SortButton>
              </th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedCourses?.map((course) => (
              <tr key={course?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedCourses?.includes(course?.id)}
                    onChange={() => onSelectCourse(course?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{course?.courseCode}</div>
                  {course?.isElective && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 mt-1">
                      Elective
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{course?.title}</div>
                  {course?.description && (
                    <div className="text-sm text-muted-foreground mt-1 truncate max-w-xs">
                      {course?.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-foreground">{course?.credits}</span>
                </td>
                <td className="px-4 py-3">
                  {getTypeBadge(course?.type)}
                </td>
                <td className="px-4 py-3">
                  {getCategoryBadge(course?.category)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-foreground">{course?.program}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-foreground">Sem {course?.semester}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(course)}>
                      <Icon name="Edit2" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(course?.id)}>
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedCourses?.map((course) => (
          <div key={course?.id} className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCourses?.includes(course?.id)}
                  onChange={() => onSelectCourse(course?.id)}
                  className="rounded border-border mt-1"
                />
                <div>
                  <h3 className="font-medium text-foreground">{course?.courseCode}</h3>
                  <p className="text-sm text-muted-foreground">{course?.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(course)}>
                  <Icon name="Edit2" size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(course?.id)}>
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Credits:</span>
                <span className="ml-2 font-medium text-foreground">{course?.credits}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Semester:</span>
                <span className="ml-2 font-medium text-foreground">Sem {course?.semester}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {getTypeBadge(course?.type)}
              {getCategoryBadge(course?.category)}
              {course?.isElective && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  Elective
                </span>
              )}
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Program:</span>
              <span className="ml-2 text-foreground">{course?.program}</span>
            </div>
          </div>
        ))}
      </div>
      {courses?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
          <p className="text-muted-foreground">Add your first course to get started with curriculum management.</p>
        </div>
      )}
    </div>
  );
};

export default CourseTable;