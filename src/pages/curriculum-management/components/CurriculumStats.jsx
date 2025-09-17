import React from 'react';
import Icon from '../../../components/AppIcon';

const CurriculumStats = ({ courses, programs }) => {
  const totalCourses = courses?.length;
  const totalCredits = courses?.reduce((sum, course) => sum + course?.credits, 0);
  const electiveCourses = courses?.filter(course => course?.isElective)?.length;
  const activePrograms = programs?.length;

  const categoryStats = courses?.reduce((acc, course) => {
    acc[course.category] = (acc?.[course?.category] || 0) + 1;
    return acc;
  }, {});

  const typeStats = courses?.reduce((acc, course) => {
    acc[course.type] = (acc?.[course?.type] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      label: 'Total Courses',
      value: totalCourses,
      icon: 'BookOpen',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Total Credits',
      value: totalCredits,
      icon: 'Award',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Elective Courses',
      value: electiveCourses,
      icon: 'Star',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Active Programs',
      value: activePrograms,
      icon: 'GraduationCap',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className={`bg-card rounded-lg border ${stat?.borderColor} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat?.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat?.value}</p>
              </div>
              <div className={`${stat?.bgColor} ${stat?.color} p-3 rounded-lg`}>
                <Icon name={stat?.icon} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="PieChart" size={20} />
            NEP 2020 Category Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryStats)?.map(([category, count]) => {
              const percentage = totalCourses > 0 ? ((count / totalCourses) * 100)?.toFixed(1) : 0;
              const categoryLabels = {
                'major': 'Major Courses',
                'minor': 'Minor Courses',
                'ability-enhancement': 'Ability Enhancement',
                'skill': 'Skill Enhancement',
                'value-added': 'Value Added',
                'foundation': 'Foundation'
              };
              
              const categoryColors = {
                'major': 'bg-blue-500',
                'minor': 'bg-green-500',
                'ability-enhancement': 'bg-purple-500',
                'skill': 'bg-orange-500',
                'value-added': 'bg-pink-500',
                'foundation': 'bg-gray-500'
              };

              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${categoryColors?.[category] || 'bg-gray-500'}`}></div>
                    <span className="text-sm text-foreground">{categoryLabels?.[category] || category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{count}</span>
                    <span className="text-xs text-muted-foreground">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course Type Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="BarChart3" size={20} />
            Course Type Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(typeStats)?.map(([type, count]) => {
              const percentage = totalCourses > 0 ? ((count / totalCourses) * 100)?.toFixed(1) : 0;
              const typeLabels = {
                'theory': 'Theory',
                'practical': 'Practical',
                'theory-practical': 'Theory + Practical'
              };
              
              const typeColors = {
                'theory': 'bg-blue-500',
                'practical': 'bg-green-500',
                'theory-practical': 'bg-purple-500'
              };

              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${typeColors?.[type] || 'bg-gray-500'}`}></div>
                    <span className="text-sm text-foreground">{typeLabels?.[type] || type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{count}</span>
                    <span className="text-xs text-muted-foreground">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumStats;