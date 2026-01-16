'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { todoApi } from '@/lib/api';
import { Task } from '@/lib/types';
import { LogOut, User, Mail, Calendar, CheckCircle, Clock, Trash2, Edit3, Camera, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, updateProfilePicture } = useAuth();
  const router = useRouter();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (user) {
          const userTasks = await todoApi.getAll();
          setTasks(userTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadTasks();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    // In a real app, you would call an API to delete the account
    // For now, just log out
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Account deletion error:', error);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        await updateProfilePicture(file);
        // The user context is updated automatically by the updateProfilePicture function
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Calculate stats from actual tasks
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  // Sort tasks by creation date (most recent first) for activity feed
  const sortedTasks = [...tasks].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 relative">
            <button
              onClick={() => router.push('/')}
              className="absolute top-4 left-4 p-2 rounded-full bg-card/80 hover:bg-card text-foreground shadow-md transition-colors flex items-center"
              aria-label="Go back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 pb-6 -mt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full border-4 border-card shadow-lg cursor-pointer group overflow-hidden"
                  onClick={handleProfilePictureClick}
                >
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture.startsWith('data:image') ? user.profile_picture :
                           user.profile_picture.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture}` :
                           user.profile_picture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-2xl font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-card"></div>

                {/* Hidden file input for profile picture upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
                <h1 className="text-2xl font-bold text-foreground">
                  {user.email.split('@')[0]}
                </h1>
                <p className="text-foreground/70 flex items-center justify-center sm:justify-start">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                </p>
                <p className="text-sm text-foreground/60 mt-1 flex items-center justify-center sm:justify-start">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{completedTasks}</p>
                <p className="text-sm text-foreground/60">Completed Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
            <div className="flex items-center">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Clock className="w-6 h-6 text-foreground/70" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{pendingTasks}</p>
                <p className="text-sm text-foreground/60">Pending Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
            <div className="flex items-center">
              <div className="p-3 bg-accent/10 rounded-lg">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
                <p className="text-sm text-foreground/60">Total Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-colors">
                <span className="text-foreground">Change Password</span>
                <Edit3 className="w-4 h-4 text-foreground/60" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-colors">
                <span className="text-foreground">Notification Preferences</span>
                <Edit3 className="w-4 h-4 text-foreground/60" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-colors">
                <span className="text-foreground">Privacy Settings</span>
                <Edit3 className="w-4 h-4 text-foreground/60" />
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
              >
                <span>Logout</span>
                <LogOut className="w-4 h-4" />
              </button>

              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-between px-4 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
              >
                <span>Delete Account</span>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {sortedTasks.slice(0, 5).map((task, index) => (
              <div key={`${task.id}-${index}`} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${task.completed ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <div>
                  <p className="text-foreground font-medium">
                    {task.completed ? 'Completed task' : 'Created task'}
                  </p>
                  <p className="text-sm text-foreground/60">
                    "{task.title}" on {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {sortedTasks.length === 0 && (
              <div className="text-center py-4 text-foreground/60">
                <p>No recent activity yet. Create your first task!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}