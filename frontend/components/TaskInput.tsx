import { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import { CreateTaskInput } from '@/lib/types';

interface TaskInputProps {
  onAddTask: (taskData: CreateTaskInput) => void;
  initialData?: {
    title: string;
    description?: string;
  };
}

export default function TaskInput({ onAddTask, initialData }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Update form fields when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
    } else {
      setTitle('');
    }
    if (initialData?.description) {
      setDescription(initialData.description);
    } else {
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onAddTask({ title: title.trim(), description: description.trim() || undefined });

    // Only reset if not in editing mode
    if (!initialData) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 transition-shadow hover:shadow-lg">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details..."
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
      >
        {initialData ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {initialData ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
}