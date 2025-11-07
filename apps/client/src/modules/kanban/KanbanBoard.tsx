// apps/client/src/modules/kanban/KanbanBoard.tsx
import * as React from 'react';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type Over,
} from '@dnd-kit/core';
import { CSS, type Transform } from '@dnd-kit/utilities';
import { useTasks, useUpdateTask } from '../task/useTasks';
import type { TaskDTO, Status } from '../../services/api';

const COLUMNS: Array<{ id: Status; title: string }> = [
  { id: 'todo',        title: 'Todo' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done',        title: 'Done' },
];

export default function KanbanBoard() {
  const { data: tasks = [], isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const grouped = React.useMemo(() => ({
    todo:        tasks.filter(t => t.status === 'todo').sort((a,b)=>a.order-b.order),
    in_progress: tasks.filter(t => t.status === 'in_progress').sort((a,b)=>a.order-b.order),
    done:        tasks.filter(t => t.status === 'done').sort((a,b)=>a.order-b.order),
  }), [tasks]);

  const onDragEnd = (e: DragEndEvent) => {
    const taskId = e.active.id as string;
    const over = e.over as Over | null;
    const overCol = (over?.data.current as { col: Status } | undefined)?.col;
    if (!overCol) return;

    const task = tasks.find(t => t._id === taskId);
    if (!task || task.status === overCol) return;

    updateTask.mutate({ id: taskId, data: { status: overCol } });
  };

  if (isLoading) return <div className="p-6">Loading…</div>;

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {COLUMNS.map(col => (
          <Column key={col.id} id={col.id} title={col.title} items={grouped[col.id]} />
        ))}
      </div>
    </DndContext>
  );
}

function Column({ id, title, items }: { id: Status; title: string; items: TaskDTO[] }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-${id}`,
    data: { col: id },
  });

  return (
    <div
      ref={setNodeRef}
      className="rounded-2xl bg-white p-3 shadow min-h-[200px] border"
      style={{ outline: isOver ? '2px solid #4f46e5' : undefined }}
    >
      <div className="font-semibold mb-2">{title}</div>
      <div className="space-y-2">
        {items.map(t => (
          <Card key={t._id} task={t} col={id} />
        ))}
      </div>
    </div>
  );
}

function Card({ task, col }: { task: TaskDTO; col: Status }) {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: task._id,
    data: { from: col },
  });

  const style = {
    transform: CSS.Transform.toString(
      (transform ?? { x: 0, y: 0, scaleX: 1, scaleY: 1 }) as Transform
    ),
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="rounded-xl border border-zinc-200 bg-white p-3 cursor-grab"
    >
      <div className="text-sm font-medium">{task.title}</div>
      {task.description && <div className="text-xs opacity-70">{task.description}</div>}
    </div>
  );
}
