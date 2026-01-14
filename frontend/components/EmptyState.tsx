import {ClipboardList} from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="bg-card rounded-xl p-8 text-center border border-border/50">
      <div className="flex justify-center mb-4">
        <ClipboardList className="h-12 w-12 text-foreground/30" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">No tasks yet</h3>
      <p className="text-foreground/70">Add your first task to get started</p>
    </div>
  );
}