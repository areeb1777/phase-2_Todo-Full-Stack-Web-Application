'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, Shield, Key, Globe, Moon, Sun, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call an API to change the password
    alert('Password change functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-foreground/70 mt-1">Manage your account preferences and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-lg border border-border/50 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{user?.email.split('@')[0]}</h3>
                  <p className="text-sm text-foreground/60">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg">
                  <Globe className="w-4 h-4 mr-3" />
                  General
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/20 rounded-lg transition-colors">
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/20 rounded-lg transition-colors">
                  <Shield className="w-4 h-4 mr-3" />
                  Privacy & Security
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/20 rounded-lg transition-colors">
                  <Key className="w-4 h-4 mr-3" />
                  Change Password
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Settings */}
            <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-xl font-semibold text-foreground">General Settings</h2>
                <p className="text-foreground/70 text-sm mt-1">Configure your account preferences</p>
              </div>
              <form onSubmit={handleSaveSettings} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Dark Mode</h3>
                      <p className="text-sm text-foreground/70">Switch between light and dark themes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-primary' : 'bg-border'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Email Notifications</h3>
                      <p className="text-sm text-foreground/70">Receive notifications via email</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifications(!notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications ? 'bg-primary' : 'bg-border'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  >
                    {showSuccess ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Settings */}
            <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-xl font-semibold text-foreground">Security</h2>
                <p className="text-foreground/70 text-sm mt-1">Manage your password and security settings</p>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-foreground/80 mb-2">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition"
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-foreground/80 mb-2">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition"
                      placeholder="Enter your new password"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground/80 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition"
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}