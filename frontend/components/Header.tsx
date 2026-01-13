import { ListTodo } from 'lucide-react';

export default function Header() {
  return (
    <header className="mb-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <ListTodo className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-800">Todo App</h1>
      </div>
      <p className="text-gray-600">Manage your tasks efficiently</p>
    </header>
  );
}