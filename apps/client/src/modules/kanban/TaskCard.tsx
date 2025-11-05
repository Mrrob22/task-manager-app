import type { Task } from '../../types/task';

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between">
        <h4 className="font-medium">{task.title}</h4>
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs uppercase">
          {task.priority}
        </span>
      </div>
      {task.assignee?.name && (
        <div className="mt-1 text-sm text-gray-600">Executor: {task.assignee.name}</div>
      )}
      {task.dueDate && (
        <div className="text-xs text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
