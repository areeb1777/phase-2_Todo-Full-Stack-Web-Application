import { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import { CreateTaskInput } from '@/lib/types';

interface TaskInputProps {
  id?: string;
  onAddTask: (taskData: CreateTaskInput) => void;
  initialData?: {
    title: string;
    description?: string;
  };
}

export default function TaskInput({ id, onAddTask, initialData }: TaskInputProps) {
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
    <form id={id} onSubmit={handleSubmit} className="bg-card rounded-xl shadow-lg border border-border/50 p-6 transition-all duration-200">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-foreground/80 mb-2">
          Task Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 bg-background/50 border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary/50 rounded-lg transition-all text-foreground placeholder-foreground/50"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-foreground/80 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details..."
          rows={3}
          className="w-full px-4 py-3 bg-background/50 border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary/50 rounded-lg transition-all text-foreground placeholder-foreground/50 resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
      >
        {initialData ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {initialData ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
}