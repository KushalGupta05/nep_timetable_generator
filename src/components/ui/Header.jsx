import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onMenuToggle, isMenuOpen = false }) => {
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const primaryNavItems = [
    { path: '/data-management', label: 'Data Management', icon: 'Database' },
    { path: '/curriculum-management', label: 'Curriculum', icon: 'BookOpen' },
    { path: '/faculty-management', label: 'Faculty', icon: 'Users' },
    { path: '/timetable-generation', label: 'Generate', icon: 'Calendar' },
    { path: '/timetable-view', label: 'View Schedule', icon: 'Eye' }
  ];

  const secondaryNavItems = [
    { path: '/settings', label: 'Settings', icon: 'Settings' },
    { path: '/help', label: 'Help', icon: 'HelpCircle' },
    { path: '/admin', label: 'Admin', icon: 'Shield' }
  ];

  const isActive = (path) => location?.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} />
          </Button>
          
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon name="Calendar" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">NEP Timetable</h1>
              <p className="text-xs text-muted-foreground -mt-1">Generator</p>
            </div>
          </Link>
        </div>

        {/* Center Section - Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              {item?.label}
            </Link>
          ))}
        </nav>

        {/* Right Section - More Menu and User Actions */}
        <div className="flex items-center gap-2">
          {/* More Menu (Desktop) */}
          <div className="hidden lg:block relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex items-center gap-2"
            >
              <Icon name="MoreHorizontal" size={16} />
              More
            </Button>
            
            {showMoreMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-20">
                  <div className="py-1">
                    {secondaryNavItems?.map((item) => (
                      <Link
                        key={item?.path}
                        to={item?.path}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowMoreMenu(false)}
                      >
                        <Icon name={item?.icon} size={16} />
                        {item?.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">Dr. Sarah Johnson</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;