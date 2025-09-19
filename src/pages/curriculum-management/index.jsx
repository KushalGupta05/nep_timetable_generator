import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CourseFormModal from './components/CourseFormModal';
import CourseTable from './components/CourseTable';
import CategoryTabs from './components/CategoryTabs';
import CurriculumStats from './components/CurriculumStats';
import BulkImportModal from './components/BulkImportModal';

const CurriculumManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showStats, setShowStats] = useState(false);

  // Mock data
  const [courses, setCourses] = useState([
    {
      id: 1,
      courseCode: "CS101",
      title: "Introduction to Computer Science",
      credits: 4,
      type: "theory",
      category: "major",
      program: "B.Tech CSE",
      semester: 1,
      prerequisites: [],
      facultyRequirements: "PhD in Computer Science, 3+ years experience",
      description: "Fundamental concepts of computer science including programming basics, data structures, and algorithms.",
      isElective: false,
      maxStudents: 60,
      resourceRequirements: "Computer Lab, Projector",
      lastModified: "2024-09-15T10:30:00Z"
    },
    {
      id: 2,
      courseCode: "MATH101",
      title: "Calculus I",
      credits: 4,
      type: "theory",
      category: "major",
      program: "B.Tech CSE",
      semester: 1,
      prerequisites: [],
      facultyRequirements: "PhD in Mathematics",
      description: "Differential and integral calculus with applications to engineering problems.",
      isElective: false,
      maxStudents: 80,
      resourceRequirements: "Classroom, Whiteboard",
      lastModified: "2024-09-14T14:20:00Z"
    },
    {
      id: 3,
      courseCode: "PHY101L",
      title: "Physics Laboratory I",
      credits: 2,
      type: "practical",
      category: "major",
      program: "B.Tech CSE",
      semester: 1,
      prerequisites: [],
      facultyRequirements: "PhD in Physics, Lab experience",
      description: "Hands-on experiments in mechanics, thermodynamics, and wave physics.",
      isElective: false,
      maxStudents: 30,
      resourceRequirements: "Physics Lab, Equipment",
      lastModified: "2024-09-13T09:15:00Z"
    },
    {
      id: 4,
      courseCode: "ENG101",
      title: "Technical Communication",
      credits: 3,
      type: "theory",
      category: "ability-enhancement",
      program: "B.Tech CSE",
      semester: 2,
      prerequisites: [],
      facultyRequirements: "Masters in English, Communication skills",
      description: "Development of technical writing and presentation skills for engineering professionals.",
      isElective: false,
      maxStudents: 50,
      resourceRequirements: "Classroom, Audio-Visual aids",
      lastModified: "2024-09-12T16:45:00Z"
    },
    {
      id: 5,
      courseCode: "CS201",
      title: "Data Structures and Algorithms",
      credits: 4,
      type: "theory-practical",
      category: "major",
      program: "B.Tech CSE",
      semester: 3,
      prerequisites: ["CS101"],
      facultyRequirements: "PhD in Computer Science, Algorithm expertise",
      description: "Advanced data structures, algorithm design and analysis, complexity theory.",
      isElective: false,
      maxStudents: 60,
      resourceRequirements: "Computer Lab, Programming environment",
      lastModified: "2024-09-11T11:30:00Z"
    },
    {
      id: 6,
      courseCode: "MGT201",
      title: "Entrepreneurship Development",
      credits: 2,
      type: "theory",
      category: "skill",
      program: "B.Tech CSE",
      semester: 4,
      prerequisites: [],
      facultyRequirements: "MBA, Industry experience",
      description: "Fundamentals of entrepreneurship, business planning, and startup ecosystem.",
      isElective: true,
      maxStudents: 40,
      resourceRequirements: "Classroom, Case study materials",
      lastModified: "2024-09-10T13:20:00Z"
    },
    {
      id: 7,
      courseCode: "ENV101",
      title: "Environmental Studies",
      credits: 2,
      type: "theory",
      category: "value-added",
      program: "B.Tech CSE",
      semester: 5,
      prerequisites: [],
      facultyRequirements: "PhD in Environmental Science",
      description: "Environmental awareness, sustainability, and ecological conservation principles.",
      isElective: false,
      maxStudents: 70,
      resourceRequirements: "Classroom, Multimedia",
      lastModified: "2024-09-09T08:45:00Z"
    },
    {
      id: 8,
      courseCode: "PHIL101",
      title: "Ethics and Human Values",
      credits: 2,
      type: "theory",
      category: "foundation",
      program: "B.Tech CSE",
      semester: 6,
      prerequisites: [],
      facultyRequirements: "PhD in Philosophy or Ethics",
      description: "Moral philosophy, ethical decision-making, and human values in technology.",
      isElective: false,
      maxStudents: 60,
      resourceRequirements: "Classroom, Discussion materials",
      lastModified: "2024-09-08T15:10:00Z"
    }
  ]);

  const programs = [
    { value: 'all', label: 'All Programs' },
    { value: 'B.Tech CSE', label: 'B.Tech Computer Science' },
    { value: 'B.Tech ECE', label: 'B.Tech Electronics' },
    { value: 'B.Tech ME', label: 'B.Tech Mechanical' },
    { value: 'B.Ed', label: 'Bachelor of Education' },
    { value: 'M.Ed', label: 'Master of Education' },
    { value: 'ITEP', label: 'Integrated Teacher Education Program' }
  ];

  // Filter courses based on active filters
  const filteredCourses = courses?.filter(course => {
    const matchesCategory = activeCategory === 'all' || course?.category === activeCategory;
    const matchesProgram = selectedProgram === 'all' || course?.program === selectedProgram;
    const matchesSearch = !searchQuery || 
      course?.courseCode?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      course?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    return matchesCategory && matchesProgram && matchesSearch;
  });

  // Calculate course counts for category tabs
  const courseCounts = {
    all: courses?.length,
    major: courses?.filter(c => c?.category === 'major')?.length,
    minor: courses?.filter(c => c?.category === 'minor')?.length,
    'ability-enhancement': courses?.filter(c => c?.category === 'ability-enhancement')?.length,
    skill: courses?.filter(c => c?.category === 'skill')?.length,
    'value-added': courses?.filter(c => c?.category === 'value-added')?.length,
    foundation: courses?.filter(c => c?.category === 'foundation')?.length
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowCourseModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  const handleSaveCourse = (courseData) => {
    if (editingCourse) {
      setCourses(prev => prev?.map(course => 
        course?.id === editingCourse?.id ? { ...courseData, id: editingCourse?.id } : course
      ));
    } else {
      setCourses(prev => [...prev, { ...courseData, id: Date.now() }]);
    }
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev?.filter(course => course?.id !== courseId));
      setSelectedCourses(prev => prev?.filter(id => id !== courseId));
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourses(prev => 
      prev?.includes(courseId) 
        ? prev?.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses?.length === filteredCourses?.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses?.map(course => course?.id));
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedCourses?.length} courses?`)) {
          setCourses(prev => prev?.filter(course => !selectedCourses?.includes(course?.id)));
          setSelectedCourses([]);
        }
        break;
      case 'export':
        // Mock export functionality
        console.log('Exporting courses:', selectedCourses);
        break;
      case 'duplicate':
        const coursesToDuplicate = courses?.filter(course => selectedCourses?.includes(course?.id));
        const duplicatedCourses = coursesToDuplicate?.map(course => ({
          ...course,
          id: Date.now() + Math.random(),
          courseCode: course?.courseCode + '_COPY',
          title: course?.title + ' (Copy)',
          lastModified: new Date()?.toISOString()
        }));
        setCourses(prev => [...prev, ...duplicatedCourses]);
        setSelectedCourses([]);
        break;
      default:
        break;
    }
  };

  const handleBulkImport = (importData) => {
    // Mock import functionality
    console.log('Importing courses:', importData);
    // In real implementation, parse the file and add courses
  };

  const handleExportCurriculum = () => {
    // Mock export functionality
    const csvContent = courses?.map(course => 
      `${course?.courseCode},${course?.title},${course?.credits},${course?.type},${course?.category},${course?.program},${course?.semester}`
    )?.join('\n');
    
    const blob = new Blob([`Course Code,Title,Credits,Type,Category,Program,Semester\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'curriculum_export.csv';
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isMenuOpen={sidebarOpen}
      /> */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-16`}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Curriculum Management</h1>
              <p className="text-muted-foreground">
                Manage course structure and NEP 2020 compliant curriculum
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setShowStats(!showStats)}>
                <Icon name="BarChart3" size={16} />
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </Button>
              <Button variant="outline" onClick={() => setShowBulkImportModal(true)}>
                <Icon name="Upload" size={16} />
                Bulk Import
              </Button>
              <Button variant="outline" onClick={handleExportCurriculum}>
                <Icon name="Download" size={16} />
                Export
              </Button>
              <Button onClick={handleAddCourse}>
                <Icon name="Plus" size={16} />
                Add Course
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          {showStats && (
            <CurriculumStats courses={courses} programs={programs?.filter(p => p?.value !== 'all')} />
          )}

          {/* Filters Section */}
          <div className="space-y-4">
            <CategoryTabs 
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              courseCounts={courseCounts}
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Search courses by code or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                />
              </div>
              <div className="sm:w-64">
                <Select
                  options={programs}
                  value={selectedProgram}
                  onChange={setSelectedProgram}
                  placeholder="Filter by program"
                />
              </div>
            </div>
          </div>

          {/* Course Table */}
          <CourseTable
            courses={filteredCourses}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
            onBulkAction={handleBulkAction}
            selectedCourses={selectedCourses}
            onSelectCourse={handleSelectCourse}
            onSelectAll={handleSelectAll}
          />

          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/faculty-management">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Users" size={16} />
                  Manage Faculty
                </Button>
              </Link>
              <Link to="/timetable-generation">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Calendar" size={16} />
                  Generate Timetable
                </Button>
              </Link>
              <Link to="/data-management">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Database" size={16} />
                  Data Management
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={() => setShowBulkImportModal(true)}>
                <Icon name="FileSpreadsheet" size={16} />
                Import Template
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <CourseFormModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        course={editingCourse}
        onSave={handleSaveCourse}
        programs={programs?.filter(p => p?.value !== 'all')}
      />
      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onImport={handleBulkImport}
        programs={programs?.filter(p => p?.value !== 'all')}
      />
    </div>
  );
};

export default CurriculumManagement;