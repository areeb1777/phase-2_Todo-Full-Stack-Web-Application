'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import { Task, CreateTaskInput } from '@/lib/types';
import { todoApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load todos from backend on component mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      const loadTodos = async () => {
        try {
          setLoading(true);
          const todos = await todoApi.getAll();
          // Convert backend todo format to frontend format
          const frontendTasks = todos.map(todo => ({
            id: todo.id,
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            createdAt: new Date(todo.created_at)
          }));
          setTasks(frontendTasks);
        } catch (err) {
          setError('Failed to load todos from server');
          console.error('Error loading todos:', err);
        } finally {
          setLoading(false);
        }
      };

      loadTodos();
    }
  }, [isAuthenticated]);

  const addTask = async (taskData: CreateTaskInput) => {
    try {
      const newTodo = await todoApi.create(taskData);
      // Convert backend todo format to frontend format
      const newTask = {
        id: newTodo.id,
        title: newTodo.title,
        description: newTodo.description,
        completed: newTodo.completed,
        createdAt: new Date(newTodo.created_at)
      };

      if (editingTask) {
        // Update existing task
        setTasks(tasks.map(task =>
          task.id === editingTask.id ? newTask : task
        ));
        setEditingTask(null);
      } else {
        // Add new task to the beginning to show newest first
        setTasks([newTask, ...tasks]);
      }
    } catch (err) {
      setError('Failed to save task to server');
      console.error('Error saving task:', err);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      // Optimistically update UI
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ));

      // Update on server
      await todoApi.update(id, { completed: !task.completed });
    } catch (err) {
      // Revert if update failed
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
      setError('Failed to update task completion status');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      // Optimistically update UI
      setTasks(tasks.filter(task => task.id !== id));

      // Delete from server
      await todoApi.delete(id);
    } catch (err) {
      // Revert if delete failed
      setError('Failed to delete task from server');
      console.error('Error deleting task:', err);
    }
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      setError('Failed to logout');
      console.error('Error logging out:', err);
    }
  };

  // Show loading if auth status is still being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground/70">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground/70">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-destructive/70 hover:text-destructive transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 mb-8 border border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.email.split('@')[0]}!</h1>
              <p className="text-foreground/70 mt-1">Manage your tasks efficiently and boost your productivity.</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="flex items-center text-sm text-foreground/70">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">
                  {tasks.filter(t => t.completed).length}
                </p>
                <p className="text-sm text-foreground/60">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
            <div className="flex items-center">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <svg className="w-6 h-6 text-foreground/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">
                  {tasks.filter(t => !t.completed).length}
                </p>
                <p className="text-sm text-foreground/60">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
            <div className="flex items-center">
              <div className="p-3 bg-accent/10 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
                <p className="text-sm text-foreground/60">Total Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Input */}
        <div className="mb-8">
          <TaskInput
            id="task-input"
            onAddTask={addTask}
            initialData={editingTask ? { title: editingTask.title, description: editingTask.description } : undefined}
          />
        </div>

        {/* Task List */}
        <div className="bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-semibold text-foreground">Your Tasks</h2>
            <p className="text-foreground/70 text-sm mt-1">Manage your daily activities and stay organized</p>
          </div>
          <TaskList
            tasks={tasks}
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        </div>
      </div>
    </div>
  );
}
