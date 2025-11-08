import React from 'react';
import KanbanBoard from './modules/kanban/KanbanBoard';
import CreateTaskModal from './modules/task/CreateTaskModal';

export default function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="p-4 flex justify-between items-center">
        <h1 className="font-bold">Task Manager</h1>
        <button
          className="px-3 py-1 rounded-md bg-black text-white"
          onClick={() => setOpen(true)}
        >
          Створити задачу
        </button>
      </header>

      <KanbanBoard />

      <CreateTaskModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
