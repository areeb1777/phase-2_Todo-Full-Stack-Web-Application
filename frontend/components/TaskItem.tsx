import { Check, Trash2, SquarePen } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) {
  return (
    <div className={`bg-card rounded-xl p-4 border border-border/50 transition-all hover:shadow-md hover:border-border/70 ${task.completed ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center mt-0.5 transition-colors ${
            task.completed
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-border hover:border-primary/50'
          }`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && <Check className="h-4 w-4" />}
        </button>
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium ${
              task.completed ? 'line-through text-foreground/60' : 'text-foreground'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm ${
              task.completed ? 'line-through text-foreground/50' : 'text-foreground/70'
            }`}>
              {task.description}
            </p>
          )}
          <p className="text-xs text-foreground/50 mt-2">
            {task.createdAt.toLocaleDateString()} • {task.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-foreground/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
            aria-label="Edit task"
          >
            <SquarePen className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}