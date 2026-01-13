import {ClipboardList} from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <div className="flex justify-center mb-4">
        <ClipboardList className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
      <p className="text-gray-500">Add your first task to get started</p>
    </div>
  );
}