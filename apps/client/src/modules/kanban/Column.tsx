import { useDroppable } from '@dnd-kit/core';
import type { Status, Task } from '../../types/task';
import TaskCard from './TaskCard';

export default function Column({ id, title, tasks }: { id: Status; title: string; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div className="flex w-full min-w-[320px] flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-500">{tasks.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 rounded-2xl bg-gray-50 p-3 ${isOver ? 'outline outline-2 outline-blue-400' : ''}`}
      >
        {tasks.map((t) => (
          <div key={t._id ?? t.title}>
            <TaskCard task={t} />
          </div>
        ))}
      </div>
    </div>
  );
}
