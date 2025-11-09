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

import TaskActionMenu from './TaskActionMenu';
import EditTaskModal from '../task/EditTaskModal';
import ConfirmModal from '../../components/ConfirmModal';
import { useDeleteTask } from '../task/useTasks';

const COLUMNS: Array<{ id: Status; title: string }> = [
  { id: 'todo',        title: 'Todo' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done',        title: 'Done' },
];

export default function KanbanBoard() {
  const [menu, setMenu] = React.useState<{ x: number; y: number; task: TaskDTO; rect: DOMRect | null } | null>(null);
  const [edit, setEdit] = React.useState<{ task: TaskDTO; rect: DOMRect | null } | null>(null);
  const [confirmDel, setConfirmDel] = React.useState<TaskDTO | null>(null);
  const delTask = useDeleteTask();

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

  const handleCardDoubleClick = (task: TaskDTO, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenu({ x: e.clientX, y: e.clientY, task, rect });
  };

  if (isLoading) return <div className="p-6">Loading…</div>;

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            items={grouped[col.id]}
            onCardDoubleClick={handleCardDoubleClick}
          />
        ))}
      </div>

      {menu && (
        <TaskActionMenu
          x={menu.x}
          y={menu.y}
          onEdit={() => { setEdit({ task: menu.task, rect: menu.rect }); setMenu(null); }}
          onDelete={() => { setConfirmDel(menu.task); setMenu(null); }}
          onClose={() => setMenu(null)}
        />
      )}

      {edit && (
        <EditTaskModal
          open={true}
          onClose={() => setEdit(null)}
          task={edit.task}
          fromRect={edit.rect}
        />
      )}

      {confirmDel && (
        <ConfirmModal
          open={true}
          onClose={() => setConfirmDel(null)}
          title="Delete task"
          text={`Are you sure you want to delete "${confirmDel.title}"?`}
          onConfirm={async () => {
            await delTask.mutateAsync(confirmDel._id);
            setConfirmDel(null);
          }}
        />
      )}
    </DndContext>
  );
}

function Column({
                  id, title, items, onCardDoubleClick,
                }: {
  id: Status;
  title: string;
  items: TaskDTO[];
  onCardDoubleClick: (task: TaskDTO, e: React.MouseEvent) => void;
}) {
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
          <Card key={t._id} task={t} col={id} onDoubleClick={onCardDoubleClick} />
        ))}
      </div>
    </div>
  );
}

function Card({
                task, col, onDoubleClick,
              }: {
  task: TaskDTO;
  col: Status;
  onDoubleClick: (task: TaskDTO, e: React.MouseEvent) => void;
}) {
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
      onDoubleClick={(e) => onDoubleClick(task, e)}
      style={style}
      className="rounded-xl border border-zinc-200 bg-white p-3 cursor-grab"
    >
      <div className="text-sm font-medium">{task.title}</div>
      {task.assignee?.name && (
        <div className="text-xs opacity-70 mt-0.5">@{task.assignee.name}</div>
      )}
      {task.description && (
        <div className="text-xs opacity-70 mt-0.5">{task.description}</div>
      )}
    </div>
  );
}
