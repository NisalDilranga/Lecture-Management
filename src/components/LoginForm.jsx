import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ onLoginSuccess, onForgotPassword }) => {
  const { login, forgotPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.email && formData.password) {
        await login(formData.email, formData.password);
        console.log('Login successful');
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.code ? getErrorMessage(err.code) : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to convert Firebase error codes to user-friendly messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address format';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      default:
        return 'Login failed. Please try again.';
    }
  };
    const handleForgotPassword = async (e) => {
    if (e) e.preventDefault(); // Prevent form submission if called from form
    
    // If not in reset mode, just switch to reset mode
    if (!isResetMode) {
      setIsResetMode(true);
      setError('');
      return;
    }
    
    // Check if email is provided
    if (!formData.email) {
      setError('Please enter your email address to reset your password');
      return;
    }
    
    setIsResetLoading(true);
    setError('');
    setResetSuccess(false);
    
    try {
      // Call forgotPassword function
      await forgotPassword(formData.email);
      
      // For security reasons, Firebase doesn't tell us if the email exists or not
      // It always returns success to prevent email enumeration attacks
      // So we'll show a generic success message
      setResetSuccess(true);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setResetSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Password reset error:', err);
      const errorMessage = err.code ? getResetErrorMessage(err.code) : 'Password reset failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsResetLoading(false);
    }
  };
  
  // Helper function to convert Firebase reset password error codes to user-friendly messages
  const getResetErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address format';
      case 'auth/user-not-found':
        return 'No account found with this email address';
      default:
        return 'Password reset failed. Please try again.';
    }
  };
  
  // Function to go back to login mode
  const handleBackToLogin = () => {
    setIsResetMode(false);
    setError('');
    setResetSuccess(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center"
        >
          <FiAlertCircle className="mr-2 flex-shrink-0" />
          {error}
        </motion.div>
      )}
        {resetSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-2 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm flex items-center"
        >
          <FiCheckCircle className="mr-2 flex-shrink-0" />
          If an account exists with this email, a password reset link has been sent. Please check your inbox.
        </motion.div>
      )}
      
      {isResetMode ? (
        // Password Reset Form
        <form onSubmit={handleForgotPassword} className="space-y-6">          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
            <p className="text-sm text-gray-500 mt-1">
              Enter your registered email and we'll send you a link to reset your password.
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FiMail />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B0000] focus:border-[#8B0000] sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <motion.button
              type="submit"
              disabled={isResetLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B0000] hover:bg-[#A52A2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] ${isResetLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isResetLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : null}
              {isResetLoading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>
            
            <button 
              type="button"
              onClick={handleBackToLogin}
              className="text-sm flex items-center justify-center font-medium text-[#8B0000] hover:text-[#A52A2A] focus:outline-none"
            >
              <FiArrowLeft className="mr-1" /> Back to Login
            </button>
          </div>
        </form>
      ) : (
        // Login Form
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FiMail />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B0000] focus:border-[#8B0000] sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FiLock />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B0000] focus:border-[#8B0000] sm:text-sm"
                placeholder="Enter your password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#8B0000] focus:ring-[#8B0000] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-[#8B0000] hover:text-[#A52A2A] focus:outline-none"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B0000] hover:bg-[#A52A2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm;