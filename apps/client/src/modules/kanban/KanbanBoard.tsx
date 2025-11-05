import React from 'react';
import { DndContext,
  // type DragEndEvent
} from '@dnd-kit/core';
import type { Status, Task } from '../../types/task';

const demo: Task[] = [
  { title: 'Demo task A', priority: 'medium', status: 'todo' },
  { title: 'Demo task B', priority: 'low', status: 'progress' },
  { title: 'Demo task C', priority: 'high', status: 'done' }
];

import Column from './Column';

export default function KanbanBoard() {
  const [tasks] = React.useState<Task[]>(demo);

  const cols: { id: Status; title: string }[] = [
    { id: 'todo',        title: 'Todo' },
    { id: 'progress', title: 'In Progress' },
    { id: 'done',        title: 'Done' }
  ];

  // const onDragEnd = (_e: DragEndEvent) => {
  //   // will be
  // };

  return (
    <DndContext
      // onDragEnd={onDragEnd}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cols.map(c => (
          <Column
            key={c.id}
            id={c.id}
            title={c.title}
            tasks={tasks.filter(t => t.status === c.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}
