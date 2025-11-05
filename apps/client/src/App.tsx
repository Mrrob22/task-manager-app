import React from 'react';
import KanbanBoard from './modules/kanban/KanbanBoard';
import CreateTaskModal from './modules/task/CreateTaskModal';

export default function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Manager · Kanban</h1>
        <button
          className="btn bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
