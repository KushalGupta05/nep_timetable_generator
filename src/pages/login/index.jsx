import React from 'react';
import { Helmet } from 'react-helmet';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import InstitutionalBranding from './components/InstitutionalBranding';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Login - NEP Timetable Generator</title>
        <meta name="description" content="Secure login to NEP 2020 compliant timetable management system for administrators, faculty, and students." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen">
          {/* Left Panel - Branding (Hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border">
            <div className="flex items-center justify-center w-full p-12">
              <div className="max-w-md">
                <InstitutionalBranding />
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex-1 lg:w-1/2">
            <div className="flex items-center justify-center min-h-screen p-6">
              <div className="w-full max-w-md">
                <LoginHeader />
                <div className="bg-card border border-border rounded-xl shadow-sm p-8">
                  <LoginForm />
                </div>

                {/* Mobile Branding */}
                <div className="lg:hidden mt-8 p-6 bg-card border border-border rounded-xl">
                  <InstitutionalBranding />
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-xs text-muted-foreground">
                    © {new Date()?.getFullYear()} NEP Timetable Generator. All rights reserved.
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Privacy Policy
                    </a>
                    <span className="text-xs text-muted-foreground">•</span>
                    <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Terms of Service
                    </a>
                    <span className="text-xs text-muted-foreground">•</span>
                    <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;