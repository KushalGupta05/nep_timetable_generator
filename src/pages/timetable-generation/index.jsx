import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GenerationControls from './components/GenerationControls';
import GenerationProgress from './components/GenerationProgress';
import TimetableGrid from './components/TimetableGrid';
import ConflictResolution from './components/ConflictResolution';
import ScenarioSimulation from './components/ScenarioSimulation';

const TimetableGeneration = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [generationState, setGenerationState] = useState({
    isGenerating: false,
    progress: 0,
    currentStep: 'data',
    schedule: null,
    conflicts: []
  });

  // Simulate generation process
  useEffect(() => {
    if (generationState?.isGenerating) {
      const steps = ['data', 'analysis', 'generation', 'optimization', 'validation'];
      const currentIndex = steps?.indexOf(generationState?.currentStep);
      
      if (currentIndex < steps?.length - 1) {
        const timer = setTimeout(() => {
          setGenerationState(prev => ({
            ...prev,
            progress: Math.min(prev?.progress + 20, 100),
            currentStep: steps?.[currentIndex + 1]
          }));
        }, 2000);
        
        return () => clearTimeout(timer);
      } else {
        // Generation complete
        setTimeout(() => {
          setGenerationState(prev => ({
            ...prev,
            isGenerating: false,
            progress: 100,
            schedule: {}, // Mock schedule data will be handled by TimetableGrid
            conflicts: [] // Mock conflicts will be handled by ConflictResolution
          }));
          setActiveTab('results');
        }, 1000);
      }
    }
  }, [generationState?.isGenerating, generationState?.currentStep]);

  const handleGenerate = (params) => {
    setGenerationState({
      isGenerating: true,
      progress: 0,
      currentStep: 'data',
      schedule: null,
      conflicts: []
    });
  };

  const handleExport = (format) => {
    // Mock export functionality
    const filename = `timetable_${new Date()?.toISOString()?.split('T')?.[0]}.${format}`;
    alert(`Exporting timetable as ${filename}`);
  };

  const handleConflictResolve = (conflictId, suggestionIndex) => {
    // Mock conflict resolution
    console.log(`Resolving conflict ${conflictId} with suggestion ${suggestionIndex}`);
  };

  const handleSimulation = (params) => {
    // Mock simulation
    console.log('Running simulation with params:', params);
  };

  const tabs = [
    { id: 'generate', label: 'Generate', icon: 'Zap' },
    { id: 'results', label: 'Results', icon: 'Calendar' },
    { id: 'conflicts', label: 'Conflicts', icon: 'AlertTriangle' },
    { id: 'simulation', label: 'Simulation', icon: 'Play' }
  ];

  const sidebarWidth = isSidebarCollapsed ? 'ml-16' : 'ml-60';

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`pt-16 transition-all duration-300 ${sidebarWidth} lg:${sidebarWidth}`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Timetable Generation</h1>
                <p className="text-muted-foreground">
                  AI-assisted automatic schedule creation with real-time conflict detection
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ArrowLeft"
                  iconPosition="left"
                  onClick={() => navigate('/')}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                  onClick={() => navigate('/timetable-view')}
                >
                  View Schedules
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
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
          <div className="space-y-6">
            {activeTab === 'generate' && (
              <>
                <GenerationControls 
                  onGenerate={handleGenerate}
                  isGenerating={generationState?.isGenerating}
                />
                {generationState?.isGenerating && (
                  <GenerationProgress
                    isGenerating={generationState?.isGenerating}
                    progress={generationState?.progress}
                    currentStep={generationState?.currentStep}
                    conflicts={generationState?.conflicts}
                    estimatedTime="2-3 minutes"
                  />
                )}
              </>
            )}

            {activeTab === 'results' && (
              <TimetableGrid
                schedule={generationState?.schedule}
                conflicts={generationState?.conflicts}
                onCellClick={(day, time, classData) => {
                  console.log('Cell clicked:', day, time, classData);
                }}
                onExport={handleExport}
              />
            )}

            {activeTab === 'conflicts' && (
              <ConflictResolution
                conflicts={generationState?.conflicts}
                onResolveConflict={handleConflictResolve}
                onResolveAll={() => {
                  console.log('Auto-resolving all conflicts');
                }}
              />
            )}

            {activeTab === 'simulation' && (
              <ScenarioSimulation
                onRunSimulation={handleSimulation}
                simulationResults={null}
              />
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-muted rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Database"
                iconPosition="left"
                onClick={() => navigate('/data-management')}
              >
                Manage Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="BookOpen"
                iconPosition="left"
                onClick={() => navigate('/curriculum-management')}
              >
                Edit Curriculum
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Users"
                iconPosition="left"
                onClick={() => navigate('/faculty-management')}
              >
                Faculty Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Download"
                iconPosition="left"
                onClick={() => handleExport('pdf')}
              >
                Export Results
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="HelpCircle" size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Generation Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ensure all faculty availability data is up-to-date before generation</li>
                  <li>• Review room capacities and equipment requirements for lab sessions</li>
                  <li>• Use simulation mode to test different scenarios before final generation</li>
                  <li>• Higher optimization levels provide better results but take more time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimetableGeneration;