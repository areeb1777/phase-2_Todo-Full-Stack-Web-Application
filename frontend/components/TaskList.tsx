import { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({ tasks, onToggleComplete, onDelete, onEdit }: TaskListProps) {
  // Sort tasks: incomplete first, then by creation date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Incomplete tasks first
    }
    return b.createdAt.getTime() - a.createdAt.getTime(); // Newest first
  });

  return (
    <div className="p-6">
      {sortedTasks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}