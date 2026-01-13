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
    <div className={`bg-white rounded-lg shadow p-4 mb-3 flex items-start border-l-4 transition-all hover:shadow-md ${task.completed ? 'border-gray-300' : 'border-blue-500'}`}>
      <button
        onClick={() => onToggleComplete(task.id)}
        className={`mr-3 mt-1 flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
          task.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-blue-500'
        }`}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && <Check className="h-3 w-3" />}
      </button>
      <div className="flex-1 min-w-0">
        <h3
          className={`text-lg font-medium ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-800'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className={`mt-1 text-sm ${
            task.completed ? 'line-through text-gray-400' : 'text-gray-600'
          }`}>
            {task.description}
          </p>
        )}
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => onEdit(task)}
          className="p-1 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Edit task"
        >
          <SquarePen className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Delete task"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}