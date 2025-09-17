import React from 'react';
import Icon from '../../../components/AppIcon';

const InstitutionalBranding = () => {
  const certifications = [
    {
      id: 1,
      name: 'NEP 2020 Compliant',
      icon: 'Award',
      description: 'Fully aligned with National Education Policy 2020'
    },
    {
      id: 2,
      name: 'UGC Approved',
      icon: 'Shield',
      description: 'University Grants Commission certified'
    },
    {
      id: 3,
      name: 'NAAC Accredited',
      icon: 'CheckCircle',
      description: 'National Assessment and Accreditation Council'
    }
  ];

  const features = [
    'Automated Timetable Generation',
    'Multi-Role Access Control',
    'Real-time Conflict Detection',
    'NEP 2020 Course Categories',
    'Faculty Workload Management',
    'Student Elective Tracking'
  ];

  return (
    <div className="space-y-8">
      {/* Main Branding */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Icon name="Calendar" size={28} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">NEP Timetable Generator</h1>
            <p className="text-sm text-muted-foreground">Smart Academic Scheduling System</p>
          </div>
        </div>
        
        <p className="text-muted-foreground max-w-md mx-auto">
          Streamline your academic operations with AI-powered timetable generation 
          that ensures optimal resource allocation and conflict-free scheduling.
        </p>
      </div>
      {/* Certifications */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground mb-3">Compliance & Certifications</h3>
        <div className="space-y-2">
          {certifications?.map((cert) => (
            <div key={cert?.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name={cert?.icon} size={16} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{cert?.name}</p>
                <p className="text-xs text-muted-foreground">{cert?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Key Features */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground mb-3">Key Features</h3>
        <div className="grid grid-cols-1 gap-2">
          {features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Icon name="Check" size={14} className="text-success flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Users" size={12} />
            <span>500+ Institutions</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Clock" size={12} />
            <span>99.9% Uptime</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Shield" size={12} />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalBranding;