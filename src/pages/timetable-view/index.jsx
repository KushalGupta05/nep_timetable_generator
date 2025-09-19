import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ViewToggle from './components/ViewToggle';
import FilterPanel from './components/FilterPanel';
import GridView from './components/GridView';
import CalendarView from './components/CalendarView';
import CourseDetailModal from './components/CourseDetailModal';
import ExportPanel from './components/ExportPanel';
import RoleBasedView from './components/RoleBasedView';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';

const TimetableView = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('grid');
  const [userRole, setUserRole] = useState('admin');
  const [filters, setFilters] = useState({
    program: 'all',
    semester: 'all',
    faculty: 'all',
    room: 'all',
    courseType: 'all'
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);
  const [showRoleView, setShowRoleView] = useState(false);

  // Mock timetable data
  const mockTimetableData = [
    {
      id: 1,
      code: 'CS309',
      name: 'Data Structures and Algorithms',
      day: 'Monday',
      timeSlot: '09:00 - 10:00',
      startTime: '09:00',
      endTime: '10:00',
      faculty: 'Dr. Rajesh Sharma',
      facultyDepartment: 'Computer Science',
      facultyEmail: 'rajesh.sharma@university.edu',
      facultyPhone: '+91 98765 43210',
      room: 'Room 101',
      roomCapacity: 60,
      building: 'Academic Block A',
      floor: 'Ground Floor',
      facilities: 'Projector, AC, WiFi',
      type: 'theory',
      category: 'Major',
      credits: 4,
      duration: 60,
      studentEnrolled: true,
      description: `This course covers fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Students will learn to analyze algorithms and implement efficient solutions to computational problems.`,
      prerequisites: ['CS101 - Programming Fundamentals', 'MATH201 - Discrete Mathematics']
    },
    {
      id: 2,
      code: 'CS302L',
      name: 'Data Structures Lab',
      day: 'Monday',
      timeSlot: '10:00 - 11:00',
      startTime: '10:00',
      endTime: '12:00',
      faculty: 'Prof. Priya Gupta',
      facultyDepartment: 'Computer Science',
      facultyEmail: 'priya.gupta@university.edu',
      facultyPhone: '+91 98765 43211',
      room: 'CS Lab 1',
      roomCapacity: 30,
      building: 'Academic Block B',
      floor: 'First Floor',
      facilities: 'Computers, Projector, AC',
      type: 'lab',
      category: 'Major',
      credits: 2,
      duration: 120,
      studentEnrolled: true,
      description: `Practical implementation of data structures concepts learned in theory. Students will code various data structures and algorithms using C++ programming language.`,
      prerequisites: ['CS301 - Data Structures and Algorithms']
    },
    {
      id: 2,
      code: 'CS302L',
      name: 'Data Structures Lab',
      day: 'Tuesday',
      timeSlot: '10:00 - 11:00',
      startTime: '10:00',
      endTime: '12:00',
      faculty: 'Prof. Priya Gupta',
      facultyDepartment: 'Computer Science',
      facultyEmail: 'priya.gupta@university.edu',
      facultyPhone: '+91 98765 43211',
      room: 'CS Lab 1',
      roomCapacity: 30,
      building: 'Academic Block B',
      floor: 'First Floor',
      facilities: 'Computers, Projector, AC',
      type: 'lab',
      category: 'Major',
      credits: 2,
      duration: 120,
      studentEnrolled: true,
      description: `Practical implementation of data structures concepts learned in theory. Students will code various data structures and algorithms using C++ programming language.`,
      prerequisites: ['CS301 - Data Structures and Algorithms']
    },
    {
      id: 3,
      code: 'MATH301',
      name: 'Linear Algebra',
      day: 'Tuesday',
      timeSlot: '09:00 - 10:00',
      startTime: '09:00',
      endTime: '10:00',
      faculty: 'Dr. Amit Singh',
      facultyDepartment: 'Mathematics',
      facultyEmail: 'amit.singh@university.edu',
      facultyPhone: '+91 98765 43212',
      room: 'Room 102',
      roomCapacity: 80,
      building: 'Academic Block A',
      floor: 'First Floor',
      facilities: 'Smart Board, AC, WiFi',
      type: 'theory',
      category: 'Minor',
      credits: 3,
      duration: 60,
      studentEnrolled: true,
      description: `Introduction to vector spaces, linear transformations, matrices, determinants, eigenvalues and eigenvectors with applications to computer science.`,
      prerequisites: ['MATH101 - Calculus I']
    },
    {
      id: 4,
      code: 'ENG201',
      name: 'Technical Communication',
      day: 'Wednesday',
      timeSlot: '11:00 - 12:00',
      startTime: '11:00',
      endTime: '12:00',
      faculty: 'Prof. Sunita Verma',
      facultyDepartment: 'English',
      facultyEmail: 'sunita.verma@university.edu',
      facultyPhone: '+91 98765 43213',
      room: 'Room 201',
      roomCapacity: 50,
      building: 'Academic Block C',
      floor: 'Second Floor',
      facilities: 'Audio System, Projector, AC',
      type: 'theory',
      category: 'Ability Enhancement',
      credits: 2,
      duration: 60,
      studentEnrolled: true,
      description: `Development of technical writing skills, presentation techniques, and professional communication for engineering students.`,
      prerequisites: []
    },
    {
      id: 5,
      code: 'CS303',
      name: 'Database Management Systems',
      day: 'Thursday',
      timeSlot: '14:00 - 15:00',
      startTime: '14:00',
      endTime: '15:00',
      faculty: 'Dr. Vikash Kumar',
      facultyDepartment: 'Computer Science',
      facultyEmail: 'vikash.kumar@university.edu',
      facultyPhone: '+91 98765 43214',
      room: 'Room 103',
      roomCapacity: 70,
      building: 'Academic Block A',
      floor: 'Ground Floor',
      facilities: 'Projector, AC, WiFi, Smart Board',
      type: 'theory',
      category: 'Major',
      credits: 4,
      duration: 60,
      studentEnrolled: true,
      description: `Comprehensive study of database concepts, relational model, SQL, normalization, transaction processing, and database design principles.`,
      prerequisites: ['CS201 - Programming in Java']
    },
    {
      id: 6,
      code: 'CS304L',
      name: 'DBMS Lab',
      day: 'Friday',
      timeSlot: '15:00 - 16:00',
      startTime: '15:00',
      endTime: '17:00',
      faculty: 'Dr. Vikash Kumar',
      facultyDepartment: 'Computer Science',
      facultyEmail: 'vikash.kumar@university.edu',
      facultyPhone: '+91 98765 43214',
      room: 'CS Lab 2',
      roomCapacity: 30,
      building: 'Academic Block B',
      floor: 'First Floor',
      facilities: 'Database Servers, Computers, Projector',
      type: 'lab',
      category: 'Major',
      credits: 2,
      duration: 120,
      studentEnrolled: true,
      description: `Hands-on experience with database creation, SQL queries, stored procedures, triggers, and database administration using MySQL and Oracle.`,
      prerequisites: ['CS303 - Database Management Systems']
    }
  ];

  const [filteredData, setFilteredData] = useState(mockTimetableData);

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'faculty', label: 'Faculty Member' },
    { value: 'student', label: 'Student' }
  ];

  useEffect(() => {
    // Apply filters to timetable data
    let filtered = mockTimetableData;

    if (filters?.program !== 'all') {
      // Filter by program logic would go here
      filtered = filtered?.filter(course => {
        // Mock program filtering
        return true;
      });
    }

    if (filters?.semester !== 'all') {
      // Filter by semester logic would go here
      filtered = filtered?.filter(course => {
        // Mock semester filtering
        return true;
      });
    }

    if (filters?.faculty !== 'all') {
      const facultyNames = {
        'dr-sharma': 'Dr. Rajesh Sharma',
        'prof-gupta': 'Prof. Priya Gupta',
        'dr-singh': 'Dr. Amit Singh',
        'prof-verma': 'Prof. Sunita Verma',
        'dr-kumar': 'Dr. Vikash Kumar'
      };
      const selectedFacultyName = facultyNames?.[filters?.faculty];
      if (selectedFacultyName) {
        filtered = filtered?.filter(course => course?.faculty === selectedFacultyName);
      }
    }

    if (filters?.room !== 'all') {
      const roomNames = {
        'room-101': 'Room 101',
        'room-102': 'Room 102',
        'lab-cs1': 'CS Lab 1',
        'lab-cs2': 'CS Lab 2',
        'auditorium': 'Main Auditorium'
      };
      const selectedRoomName = roomNames?.[filters?.room];
      if (selectedRoomName) {
        filtered = filtered?.filter(course => course?.room === selectedRoomName);
      }
    }

    if (filters?.courseType !== 'all') {
      const typeMapping = {
        'major': 'Major',
        'minor': 'Minor',
        'ability': 'Ability Enhancement',
        'skill': 'Skill Enhancement',
        'value': 'Value Added'
      };
      const selectedType = typeMapping?.[filters?.courseType];
      if (selectedType) {
        filtered = filtered?.filter(course => course?.category === selectedType);
      }
    }

    setFilteredData(filtered);
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      program: 'all',
      semester: 'all',
      faculty: 'all',
      room: 'all',
      courseType: 'all'
    });
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleViewChange = (view) => {
    if (view === 'role') {
      setShowRoleView(true);
    } else {
      setShowRoleView(false);
      setCurrentView(view);
    }
  };

  const sidebarWidth = isSidebarCollapsed ? 'ml-16' : 'ml-60';

  return (
    <div className="min-h-screen bg-background">
      {/* <Header 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      /> */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`pt-16 transition-all duration-300 ${sidebarWidth} lg:${sidebarWidth}`}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Timetable View</h1>
              <p className="text-muted-foreground mt-1">
                Interactive schedule visualization with comprehensive filtering and export options
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select
                options={roleOptions}
                value={userRole}
                onChange={setUserRole}
                className="w-40"
              />
              
              <Button
                variant={showRoleView ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('role')}
                iconName="User"
                iconPosition="left"
                iconSize={16}
              >
                Role View
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExportPanelOpen(true)}
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export
              </Button>
            </div>
          </div>

          {showRoleView ? (
            <RoleBasedView
              userRole={userRole}
              timetableData={filteredData}
              onViewChange={handleViewChange}
            />
          ) : (
            <>
              {/* View Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <ViewToggle
                  currentView={currentView}
                  onViewChange={setCurrentView}
                />
                
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredData?.length} of {mockTimetableData?.length} classes
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location?.reload()}
                    iconName="RefreshCw"
                    iconSize={16}
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isExpanded={isFilterExpanded}
                onToggleExpanded={() => setIsFilterExpanded(!isFilterExpanded)}
              />

              {/* Main Content */}
              <div className="bg-card border border-border rounded-lg p-6">
                {currentView === 'grid' ? (
                  <GridView
                    timetableData={filteredData}
                    onCourseClick={handleCourseClick}
                  />
                ) : (
                  <CalendarView
                    timetableData={filteredData}
                    onCourseClick={handleCourseClick}
                  />
                )}
              </div>

              {/* Empty State */}
              {filteredData?.length === 0 && (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <Icon name="Calendar" size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Classes Found</h3>
                  <p className="text-muted-foreground mb-6">
                    No classes match your current filter criteria. Try adjusting your filters or clearing them to see all classes.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    iconName="RotateCcw"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {/* Modals */}
      <CourseDetailModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
      <ExportPanel
        isOpen={isExportPanelOpen}
        onClose={() => setIsExportPanelOpen(false)}
      />
    </div>
  );
};

export default TimetableView;
