import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  const currentDate = new Date()?.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="GraduationCap" size={24} color="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-3 mb-6">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Access Your Dashboard</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Enter your credentials to access the NEP 2020 compliant timetable management system
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;