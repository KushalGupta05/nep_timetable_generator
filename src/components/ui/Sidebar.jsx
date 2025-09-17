import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isOpen = false, onClose, isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: 'LayoutDashboard',
      tooltip: 'System overview and quick access'
    },
    { 
      path: '/data-management', 
      label: 'Data Management', 
      icon: 'Database',
      tooltip: 'Bulk upload and data entry operations'
    },
    { 
      path: '/curriculum-management', 
      label: 'Curriculum', 
      icon: 'BookOpen',
      tooltip: 'Course structure and NEP 2020 categories'
    },
    { 
      path: '/faculty-management', 
      label: 'Faculty', 
      icon: 'Users',
      tooltip: 'Availability and workload management'
    },
    { 
      path: '/timetable-generation', 
      label: 'Generate Schedule', 
      icon: 'Calendar',
      tooltip: 'AI-assisted timetable creation'
    },
    { 
      path: '/timetable-view', 
      label: 'View Schedule', 
      icon: 'Eye',
      tooltip: 'Interactive schedule display'
    }
  ];

  const secondaryItems = [
    { path: '/settings', label: 'Settings', icon: 'Settings' },
    { path: '/help', label: 'Help & Support', icon: 'HelpCircle' },
    { path: '/admin', label: 'Admin Panel', icon: 'Shield' }
  ];

  const isActive = (path) => location?.pathname === path;

  const handleLogout = () => {
    navigate('/login');
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-60';
  const sidebarClass = `fixed left-0 top-0 h-full bg-card border-r border-border shadow-lg z-40 transition-all duration-300 ${sidebarWidth}`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside className={`${sidebarClass} ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <Icon name="Calendar" size={20} color="white" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-foreground">NEP Timetable</h1>
                  <p className="text-xs text-muted-foreground">Generator</p>
                </div>
              </Link>
            )}
            
            {isCollapsed && (
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mx-auto">
                <Icon name="Calendar" size={20} color="white" />
              </div>
            )}

            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>

            {/* Collapse toggle for desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="hidden lg:flex"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={16} color="white" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">Dr. Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                )}
                {!isCollapsed && (
                  <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                )}
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className={`absolute z-20 mt-2 bg-popover border border-border rounded-md shadow-lg ${
                    isCollapsed ? 'left-16 top-0' : 'left-0 right-0'
                  }`}>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/profile');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                      >
                        <Icon name="User" size={16} />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                      >
                        <Icon name="LogOut" size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems?.map((item) => (
              <div key={item?.path} className="relative group">
                <Link
                  to={item?.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  onClick={() => onClose && onClose()}
                >
                  <Icon name={item?.icon} size={20} />
                  {!isCollapsed && <span>{item?.label}</span>}
                </Link>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-popover border border-border rounded-md px-3 py-2 text-sm text-popover-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item?.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover"></div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Secondary Navigation */}
          <div className="p-4 border-t border-border space-y-1">
            {secondaryItems?.map((item) => (
              <div key={item?.path} className="relative group">
                <Link
                  to={item?.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  onClick={() => onClose && onClose()}
                >
                  <Icon name={item?.icon} size={20} />
                  {!isCollapsed && <span>{item?.label}</span>}
                </Link>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-popover border border-border rounded-md px-3 py-2 text-sm text-popover-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item?.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;