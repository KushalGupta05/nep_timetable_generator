import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FacultyTable from './components/FacultyTable';
import FacultyModal from './components/FacultyModal';
import AvailabilityGrid from './components/AvailabilityGrid';
import WorkloadSummary from './components/WorkloadSummary';
import FacultyCards from './components/FacultyCards';

const FacultyManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');
  const [viewMode, setViewMode] = useState('table'); // table or cards
  const [facultyModal, setFacultyModal] = useState({ isOpen: false, faculty: null, mode: 'add' });
  const [availabilityModal, setAvailabilityModal] = useState({ isOpen: false, faculty: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  // Mock faculty data
  const [faculty, setFaculty] = useState([
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@university.edu",
      phone: "+91 98765 43210",
      department: "Computer Science",
      designation: "Professor",
      expertise: ["Data Structures", "Algorithms", "Machine Learning", "Database Systems"],
      workloadHours: 18,
      maxWorkload: 20,
      availabilityStatus: "available",
      specialRequirements: "Prefers morning slots",
      availability: {
        monday: { "09:00": "preferred", "10:00": "available", "11:00": "unavailable" },
        tuesday: { "09:00": "available", "10:00": "preferred", "11:00": "available" }
      }
    },
    {
      id: 2,
      name: "Prof. Priya Sharma",
      email: "priya.sharma@university.edu",
      phone: "+91 87654 32109",
      department: "Mathematics",
      designation: "Associate Professor",
      expertise: ["Calculus", "Linear Algebra", "Statistics", "Discrete Mathematics"],
      workloadHours: 16,
      maxWorkload: 18,
      availabilityStatus: "partial",
      specialRequirements: "No classes after 4 PM",
      availability: {}
    },
    {
      id: 3,
      name: "Dr. Amit Patel",
      email: "amit.patel@university.edu",
      phone: "+91 76543 21098",
      department: "Physics",
      designation: "Assistant Professor",
      expertise: ["Quantum Physics", "Thermodynamics", "Electromagnetism"],
      workloadHours: 22,
      maxWorkload: 20,
      availabilityStatus: "available",
      specialRequirements: "",
      availability: {}
    },
    {
      id: 4,
      name: "Dr. Sunita Verma",
      email: "sunita.verma@university.edu",
      phone: "+91 65432 10987",
      department: "Chemistry",
      designation: "Professor",
      expertise: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
      workloadHours: 14,
      maxWorkload: 20,
      availabilityStatus: "available",
      specialRequirements: "Lab sessions only in afternoon",
      availability: {}
    },
    {
      id: 5,
      name: "Prof. Vikram Singh",
      email: "vikram.singh@university.edu",
      phone: "+91 54321 09876",
      department: "English",
      designation: "Associate Professor",
      expertise: ["Literature", "Grammar", "Creative Writing", "Linguistics"],
      workloadHours: 12,
      maxWorkload: 18,
      availabilityStatus: "partial",
      specialRequirements: "Prefers 2-hour continuous slots",
      availability: {}
    },
    {
      id: 6,
      name: "Dr. Meera Joshi",
      email: "meera.joshi@university.edu",
      phone: "+91 43210 98765",
      department: "History",
      designation: "Assistant Professor",
      expertise: ["Ancient History", "Modern History", "Archaeological Studies"],
      workloadHours: 15,
      maxWorkload: 18,
      availabilityStatus: "available",
      specialRequirements: "",
      availability: {}
    }
  ]);

  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' }
  ];

  const tabs = [
    { id: 'directory', label: 'Faculty Directory', icon: 'Users' },
    { id: 'workload', label: 'Workload Summary', icon: 'BarChart3' }
  ];

  // Filter faculty based on search and department
  const filteredFaculty = faculty?.filter(member => {
    const matchesDepartment = !filterDepartment || member?.department === filterDepartment;
    const matchesSearch = !searchQuery || 
      member?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      member?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      member?.department?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const handleAddFaculty = () => {
    setFacultyModal({ isOpen: true, faculty: null, mode: 'add' });
  };

  const handleEditFaculty = (facultyMember) => {
    setFacultyModal({ isOpen: true, faculty: facultyMember, mode: 'edit' });
  };

  const handleViewAvailability = (facultyMember) => {
    setAvailabilityModal({ isOpen: true, faculty: facultyMember });
  };

  const handleSaveFaculty = (facultyData) => {
    if (facultyModal?.mode === 'add') {
      setFaculty(prev => [...prev, { ...facultyData, id: Date.now() }]);
    } else {
      setFaculty(prev => prev?.map(f => f?.id === facultyData?.id ? facultyData : f));
    }
  };

  const handleSaveAvailability = (updatedFaculty) => {
    setFaculty(prev => prev?.map(f => f?.id === updatedFaculty?.id ? updatedFaculty : f));
  };

  const handleBulkImport = () => {
    // Mock bulk import functionality
    console.log('Bulk import functionality would be implemented here');
  };

  const handleExportData = () => {
    // Mock export functionality
    console.log('Export functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Faculty Management - NEP Timetable Generator</title>
        <meta name="description" content="Manage faculty profiles, availability, workload, and course assignments for efficient timetable generation." />
      </Helmet>
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isMenuOpen={sidebarOpen}
      />
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-16`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Faculty Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage faculty profiles, availability preferences, and workload assignments
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleBulkImport}
                  iconName="Upload"
                  iconPosition="left"
                >
                  Bulk Import
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export Data
                </Button>
                <Button
                  onClick={handleAddFaculty}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Faculty
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{faculty?.length}</p>
                  <p className="text-sm text-muted-foreground">Total Faculty</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {faculty?.filter(f => f?.availabilityStatus === 'available')?.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {faculty?.reduce((sum, f) => sum + f?.workloadHours, 0)}h
                  </p>
                  <p className="text-sm text-muted-foreground">Total Workload</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {faculty?.filter(f => (f?.workloadHours / f?.maxWorkload) > 0.9)?.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Overloaded</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'directory' && (
            <div className="space-y-6">
              {/* Filters and View Toggle */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <Input
                      type="search"
                      placeholder="Search faculty..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      className="w-full sm:w-64"
                    />
                    
                    <Select
                      options={departments}
                      value={filterDepartment}
                      onChange={setFilterDepartment}
                      placeholder="Filter by department"
                      className="w-full sm:w-48"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                      iconName="Table"
                    >
                      Table
                    </Button>
                    <Button
                      variant={viewMode === 'cards' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('cards')}
                      iconName="Grid3X3"
                    >
                      Cards
                    </Button>
                  </div>
                </div>
              </div>

              {/* Faculty List */}
              {viewMode === 'table' ? (
                <FacultyTable
                  faculty={filteredFaculty}
                  onEditFaculty={handleEditFaculty}
                  onViewAvailability={handleViewAvailability}
                />
              ) : (
                <FacultyCards
                  faculty={filteredFaculty}
                  onEditFaculty={handleEditFaculty}
                  onViewAvailability={handleViewAvailability}
                />
              )}
            </div>
          )}

          {activeTab === 'workload' && (
            <WorkloadSummary faculty={faculty} />
          )}
        </div>
      </main>
      {/* Modals */}
      <FacultyModal
        isOpen={facultyModal?.isOpen}
        onClose={() => setFacultyModal({ isOpen: false, faculty: null, mode: 'add' })}
        faculty={facultyModal?.faculty}
        onSave={handleSaveFaculty}
        mode={facultyModal?.mode}
      />
      <AvailabilityGrid
        isOpen={availabilityModal?.isOpen}
        onClose={() => setAvailabilityModal({ isOpen: false, faculty: null })}
        faculty={availabilityModal?.faculty}
        onSave={handleSaveAvailability}
      />
    </div>
  );
};

export default FacultyManagement;