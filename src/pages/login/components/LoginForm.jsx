import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.email || !formData?.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      const { error } = await signIn(formData?.email, formData?.password);
      
      if (error) {
        if (error?.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (error?.message?.includes('Email not confirmed')) {
          setError('Please verify your email address before signing in.');
        } else {
          setError(error?.message || 'Failed to sign in');
        }
        return;
      }

      // Successful login - redirect will be handled by auth state change
      navigate('/');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e?.target?.value }))}
            required
            disabled={loading}
            iconName="Mail"
            iconPosition="left"
            className="w-full"
          />
        </div>

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData?.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e?.target?.value }))}
            required
            disabled={loading}
            iconName="Lock"
            iconPosition="left"
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={16} className="text-red-500 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          iconName={loading ? "Loader2" : "LogIn"}
          iconPosition="left"
          iconSize={16}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
      {/* Demo Credentials */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
          <Icon name="Info" size={16} className="mr-2" />
          Demo Credentials
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-blue-700">
              <strong>Admin:</strong> admin@nep.edu.in
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDemoLogin('admin@nep.edu.in', 'Admin@123')}
              className="text-xs h-6 px-2"
            >
              Use
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">
              <strong>Faculty:</strong> faculty@nep.edu.in
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDemoLogin('faculty@nep.edu.in', 'Faculty@123')}
              className="text-xs h-6 px-2"
            >
              Use
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">
              <strong>Student:</strong> student@nep.edu.in
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDemoLogin('student@nep.edu.in', 'Student@123')}
              className="text-xs h-6 px-2"
            >
              Use
            </Button>
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Password for all demo accounts: Check the respective @123 format
        </p>
      </div>
    </div>
  );
};

export default LoginForm;