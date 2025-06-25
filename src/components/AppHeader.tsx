import React, { useState, useEffect } from 'react';
import { ClipboardList, LogOut, Menu, User, Sun, Moon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProjectPersistence } from '../hooks/useProjectPersistence';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Use the actual deployed URL or fallback to current origin
const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

const AppHeader = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const { isAuthenticated } = useProjectPersistence();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Reset login attempts after lockout period
    if (lockoutUntil && Date.now() >= lockoutUntil) {
      setLockoutUntil(null);
      setLoginAttempts(0);
    }
  }, [lockoutUntil]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setAuthError(null);
  };

  const closeAuthDialog = () => {
    setShowAuthDialog(false);
    resetForm();
  };
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (lockoutUntil && Date.now() < lockoutUntil) {
      const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / 60000);
      setAuthError(`Too many attempts. Try again in ${minutesLeft} minutes`);
      return;
    }

    if (isSignUp && !PASSWORD_REGEX.test(password)) {
      setAuthError('Password must be at least 8 characters and contain uppercase, lowercase and numbers');
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${SITE_URL}`,
            data: {
              email_confirmed: false
            }
          }
        });
        
        if (error) throw error;
        
        toast.success('Check your email to confirm your account');
        closeAuthDialog();
      } else {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        // Check if email is confirmed
        const { data: profile } = await supabase
          .from('auth.users')
          .select('email_confirmed_at')
          .eq('id', user.id)
          .single();

        if (!profile?.email_confirmed_at) {
          setAuthError('Please verify your email before signing in');
          return;
        }
        
        toast.success('Signed in successfully');
        closeAuthDialog();
        setLoginAttempts(0);
      }
    } catch (error: any) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockoutUntil(Date.now() + LOCKOUT_TIME);
        setLoginAttempts(0);
        setAuthError('Too many failed attempts. Account locked for 15 minutes');
      } else {
        setAuthError(error.message || 'Authentication failed');
      }
      console.error('Auth error:', error);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email) {
      setAuthError('Please enter your email address');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset instructions sent to your email');
      setShowResetDialog(false);
      resetForm();
    } catch (error: any) {
      setAuthError(error.message || 'Failed to send reset instructions');
      console.error('Password reset error:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      setShowUserMenu(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to log out');
    }
  };
  
  return (
    <header className="bg-light-card dark:bg-slate-900 text-light-text-primary dark:text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList size={28} className="text-space-blue-light" />
          <h1 className="text-xl font-bold">Proposal Calculator</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-light-text-secondary dark:text-slate-300">
            Professional project estimation made simple
          </span>
          
          <button
            className="p-2 rounded-full hover:bg-light-border dark:hover:bg-slate-800 transition-colors"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-space-blue-light" />
            ) : (
              <Moon size={20} className="text-space-blue" />
            )}
          </button>
          
          {isAuthenticated ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-light-border dark:hover:bg-slate-800 transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 bg-space-blue rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-light-bg dark:bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm text-light-text-primary dark:text-slate-700 hover:bg-light-card dark:hover:bg-slate-100 w-full"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="px-4 py-2 bg-space-blue text-white rounded-md hover:bg-space-blue-light transition-colors"
              onClick={() => setShowAuthDialog(true)}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Auth Dialog */}
      {showAuthDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-light-bg dark:bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-light-text-primary dark:text-slate-800">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h3>
            {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                {authError}
              </div>
            )}
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-2 border rounded-md text-light-text-primary dark:text-slate-900 bg-light-card dark:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="w-full p-2 border rounded-md text-light-text-primary dark:text-slate-900 bg-light-card dark:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && (
                  <p className="mt-1 text-sm text-light-text-secondary dark:text-slate-500">
                    Password must be at least 8 characters and contain uppercase, lowercase and numbers
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <button
                    type="button"
                    className="text-sm text-space-blue hover:text-space-blue-light"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setAuthError(null);
                    }}
                  >
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </button>
                  {!isSignUp && (
                    <button
                      type="button"
                      className="block text-sm text-space-blue hover:text-space-blue-light"
                      onClick={() => {
                        setShowAuthDialog(false);
                        setShowResetDialog(true);
                        resetForm();
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-light-text-secondary dark:text-slate-600 hover:text-light-text-primary dark:hover:text-slate-800"
                    onClick={closeAuthDialog}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-space-blue text-white rounded-md hover:bg-space-blue-light"
                  >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-light-bg dark:bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-light-text-primary dark:text-slate-800">
              Reset Password
            </h3>
            {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                {authError}
              </div>
            )}
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-2 border rounded-md text-light-text-primary dark:text-slate-900 bg-light-card dark:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-light-text-secondary dark:text-slate-600 hover:text-light-text-primary dark:hover:text-slate-800"
                  onClick={() => {
                    setShowResetDialog(false);
                    setShowAuthDialog(true);
                    resetForm();
                  }}
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-space-blue text-white rounded-md hover:bg-space-blue-light"
                >
                  Send Reset Instructions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;