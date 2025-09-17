import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';

import DataTypeTab from './components/DataTypeTab';
import UploadSection from './components/UploadSection';
import DataTable from './components/DataTable';
import AddRecordModal from './components/AddRecordModal';
import ValidationResults from './components/ValidationResults';

const DataManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for different record types
  const [studentsData, setStudentsData] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@college.edu",
      rollNumber: "CS2021001",
      department: "Computer Science",
      semester: "6",
      program: "B.Tech",
      phone: "+91 9876543210",
      status: "Active"
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@college.edu",
      rollNumber: "CS2021002",
      department: "Computer Science",
      semester: "6",
      program: "B.Tech",
      phone: "+91 9876543211",
      status: "Active"
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit.kumar@college.edu",
      rollNumber: "EC2021001",
      department: "Electronics & Communication",
      semester: "4",
      program: "B.Tech",
      phone: "+91 9876543212",
      status: "Active"
    }
  ]);

  const [facultyData, setFacultyData] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@college.edu",
      employeeId: "FAC001",
      department: "Computer Science",
      designation: "Professor",
      phone: "+91 9876543220",
      expertise: "Machine Learning, Data Science",
      maxHours: "20",
      status: "Active"
    },
    {
      id: 2,
      name: "Prof. Rajesh Gupta",
      email: "rajesh.gupta@college.edu",
      employeeId: "FAC002",
      department: "Computer Science",
      designation: "Associate Professor",
      phone: "+91 9876543221",
      expertise: "Software Engineering, Web Development",
      maxHours: "18",
      status: "Active"
    }
  ]);

  const [roomsData, setRoomsData] = useState([
    {
      id: 1,
      name: "Room 101",
      type: "Classroom",
      capacity: "60",
      building: "Academic Block A",
      floor: "1st Floor",
      equipment: "Projector, Whiteboard, AC",
      status: "Available"
    },
    {
      id: 2,
      name: "Lab 201",
      type: "Laboratory",
      capacity: "30",
      building: "Academic Block B",
      floor: "2nd Floor",
      equipment: "Computers, Projector, AC",
      status: "Available"
    }
  ]);

  const [coursesData, setCoursesData] = useState([
    {
      id: 1,
      code: "CS301",
      name: "Data Structures and Algorithms",
      credits: "4",
      type: "Theory",
      department: "Computer Science",
      semester: "3",
      category: "Major",
      description: "Fundamental data structures and algorithmic techniques"
    },
    {
      id: 2,
      code: "CS302",
      name: "Database Management Systems",
      credits: "3",
      type: "Theory",
      department: "Computer Science",
      semester: "4",
      category: "Major",
      description: "Design and implementation of database systems"
    }
  ]);

  // Tab configuration
  const tabs = [
    { 
      id: 'students', 
      label: 'Students', 
      icon: 'Users', 
      count: studentsData?.length 
    },
    { 
      id: 'faculty', 
      label: 'Faculty', 
      icon: 'UserCheck', 
      count: facultyData?.length 
    },
    { 
      id: 'rooms', 
      label: 'Rooms', 
      icon: 'Building', 
      count: roomsData?.length 
    },
    { 
      id: 'courses', 
      label: 'Courses', 
      icon: 'BookOpen', 
      count: coursesData?.length 
    }
  ];

  // Column configurations for different data types
  const getColumns = (type) => {
    const columns = {
      students: [
        { key: 'name', label: 'Name' },
        { key: 'rollNumber', label: 'Roll Number' },
        { key: 'department', label: 'Department' },
        { key: 'semester', label: 'Semester' },
        { key: 'program', label: 'Program' },
        { 
          key: 'status', 
          label: 'Status',
          render: (value) => (
            <span className={`px-2 py-1 text-xs rounded-full ${
              value === 'Active' ?'bg-success/10 text-success' :'bg-error/10 text-error'
            }`}>
              {value}
            </span>
          )
        }
      ],
      faculty: [
        { key: 'name', label: 'Name' },
        { key: 'employeeId', label: 'Employee ID' },
        { key: 'department', label: 'Department' },
        { key: 'designation', label: 'Designation' },
        { key: 'maxHours', label: 'Max Hours/Week' },
        { 
          key: 'status', 
          label: 'Status',
          render: (value) => (
            <span className={`px-2 py-1 text-xs rounded-full ${
              value === 'Active' ?'bg-success/10 text-success' :'bg-error/10 text-error'
            }`}>
              {value}
            </span>
          )
        }
      ],
      rooms: [
        { key: 'name', label: 'Room Name' },
        { key: 'type', label: 'Type' },
        { key: 'capacity', label: 'Capacity' },
        { key: 'building', label: 'Building' },
        { key: 'floor', label: 'Floor' },
        { 
          key: 'status', 
          label: 'Status',
          render: (value) => (
            <span className={`px-2 py-1 text-xs rounded-full ${
              value === 'Available' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
            }`}>
              {value}
            </span>
          )
        }
      ],
      courses: [
        { key: 'code', label: 'Course Code' },
        { key: 'name', label: 'Course Name' },
        { key: 'credits', label: 'Credits' },
        { key: 'type', label: 'Type' },
        { key: 'department', label: 'Department' },
        { key: 'category', label: 'NEP Category' }
      ]
    };
    return columns?.[type] || [];
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    const dataMap = {
      students: studentsData,
      faculty: facultyData,
      rooms: roomsData,
      courses: coursesData
    };
    return dataMap?.[activeTab] || [];
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    setIsUploading(true);
    
    // Simulate file processing and validation
    setTimeout(() => {
      const mockValidationResults = {
        totalRecords: 150,
        validRecords: 142,
        invalidRecords: 8,
        errors: [
          { row: 5, message: "Invalid email format" },
          { row: 12, message: "Missing required field: Department" },
          { row: 23, message: "Duplicate roll number" },
          { row: 34, message: "Invalid phone number format" },
          { row: 45, message: "Semester value out of range" }
        ],
        warnings: [
          { row: 8, message: "Phone number format inconsistent" },
          { row: 15, message: "Department name case mismatch" }
        ]
      };
      
      setValidationResults(mockValidationResults);
      setIsUploading(false);
    }, 3000);
  };

  // Handle record operations
  const handleAddRecord = () => {
    setEditingRecord(null);
    setShowAddModal(true);
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setShowAddModal(true);
  };

  const handleDeleteRecord = (record) => {
    if (window.confirm(`Are you sure you want to delete ${record?.name}?`)) {
      const setterMap = {
        students: setStudentsData,
        faculty: setFacultyData,
        rooms: setRoomsData,
        courses: setCoursesData
      };
      
      const setter = setterMap?.[activeTab];
      if (setter) {
        setter(prev => prev?.filter(item => item?.id !== record?.id));
      }
    }
  };

  const handleSaveRecord = async (formData) => {
    const setterMap = {
      students: setStudentsData,
      faculty: setFacultyData,
      rooms: setRoomsData,
      courses: setCoursesData
    };
    
    const setter = setterMap?.[activeTab];
    if (!setter) return;

    if (editingRecord) {
      // Update existing record
      setter(prev => prev?.map(item => 
        item?.id === editingRecord?.id ? { ...formData, id: editingRecord?.id } : item
      ));
    } else {
      // Add new record
      const newId = Math.max(...getCurrentData()?.map(item => item?.id)) + 1;
      setter(prev => [...prev, { ...formData, id: newId }]);
    }
  };

  const handleBulkAction = (action, selectedIds) => {
    if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedIds?.length} records?`)) {
        const setterMap = {
          students: setStudentsData,
          faculty: setFacultyData,
          rooms: setRoomsData,
          courses: setCoursesData
        };
        
        const setter = setterMap?.[activeTab];
        if (setter) {
          setter(prev => prev?.filter(item => !selectedIds?.includes(item?.id)));
        }
      }
    } else if (action === 'export') {
      // Simulate export functionality
      alert(`Exporting ${selectedIds?.length} records...`);
    }
  };

  const handleValidationProceed = () => {
    // Simulate importing valid records
    alert(`Successfully imported ${validationResults?.validRecords} records!`);
    setValidationResults(null);
    
    // Refresh data (in real app, this would fetch from server)
    // For demo, we'll just close the validation results
  };

  const handleDownloadErrors = () => {
    // Simulate downloading error report
    alert('Downloading error report...');
  };

  return (
    <div className="min-h-screen bg-background">
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

      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Data Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage student, faculty, room, and course data with bulk upload capabilities
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                >
                  Export Data
                </Button>
                <Button
                  onClick={handleAddRecord}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Record
                </Button>
              </div>
            </div>
          </div>

          {/* Data Type Tabs */}
          <DataTypeTab
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          <div className="mt-6 space-y-6">
            {/* Upload Section */}
            <UploadSection
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
            />

            {/* Validation Results */}
            {validationResults && (
              <ValidationResults
                results={validationResults}
                onClose={() => setValidationResults(null)}
                onProceed={handleValidationProceed}
                onDownloadErrors={handleDownloadErrors}
              />
            )}

            {/* Data Table */}
            <DataTable
              data={getCurrentData()}
              columns={getColumns(activeTab)}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
              onBulkAction={handleBulkAction}
            />
          </div>
        </div>
      </main>

      {/* Add/Edit Record Modal */}
      <AddRecordModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        recordType={activeTab}
        editData={editingRecord}
      />
    </div>
  );
};

export default DataManagement;