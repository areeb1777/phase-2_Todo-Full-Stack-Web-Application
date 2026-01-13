'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import { Task, CreateTaskInput } from '@/lib/types';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const addTask = (taskData: CreateTaskInput) => {
    const newTask: Task = {
      id: `task-${Date.now()}`, // Simple ID generation
      title: taskData.title,
      description: taskData.description,
      completed: false,
      createdAt: new Date(),
    };

    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => task.id === editingTask.id ? {...newTask, id: editingTask.id} : task));
      setEditingTask(null);
    } else {
      // Add new task
      setTasks([newTask, ...tasks]); // Add to the beginning to show newest first
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    // In a real app, we might want to populate the form with the task data
    // For now, we'll just set the editing task so the UI can indicate editing mode
  };

  return (
    <div className="w-full">
      <Header />
      <TaskInput
        onAddTask={addTask}
        initialData={editingTask ? { title: editingTask.title, description: editingTask.description } : undefined}
      />
      <TaskList
        tasks={tasks}
        onToggleComplete={toggleTaskCompletion}
        onDelete={deleteTask}
        onEdit={editTask}
      />
    </div>
  );
}
