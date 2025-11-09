import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTask,
  deleteTask,
  listTasks,
  patchTask,
  reorderTasks,
  type TaskDTO,
  type Status,
  type ReorderPayload,
} from '../../services/api';

const PRIORITY_RANK: Record<'low' | 'medium' | 'high', number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const QK = {
  tasks: ['tasks'] as const,
};

function sortByPriorityThenOrder(a: TaskDTO, b: TaskDTO) {
  const pa = PRIORITY_RANK[a.priority] ?? 0;
  const pb = PRIORITY_RANK[b.priority] ?? 0;
  if (pa !== pb) return pb - pa;
  return (a.order ?? 0) - (b.order ?? 0);
}

function moveOptimistic(
  tasks: TaskDTO[],
  changes: ReorderPayload['items']
): TaskDTO[] {
  const map = new Map(tasks.map((t) => [t._id, { ...t }]));
  for (const { id, status, order } of changes) {
    const t = map.get(id);
    if (!t) continue;
    t.status = status;
    t.order = order;
    map.set(id, t);
  }

  const byStatus: Record<Status, TaskDTO[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };

  for (const t of map.values()) byStatus[t.status].push(t);

  (Object.keys(byStatus) as Status[]).forEach((s) => {
    byStatus[s].sort(sortByPriorityThenOrder);
    byStatus[s].forEach((t, idx) => (t.order = idx + 1));
  });

  return [...byStatus.todo, ...byStatus.in_progress, ...byStatus.done];
}


export function useTasks() {
  return useQuery({ queryKey: QK.tasks, queryFn: listTasks });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<TaskDTO>) => createTask(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.tasks }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskDTO> }) => patchTask(id, data),

    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: QK.tasks });
      const prev = qc.getQueryData<TaskDTO[]>(QK.tasks) ?? [];

      let next = prev.map((t) => (t._id === id ? ({ ...t, ...data } as TaskDTO) : t));

      if (data.priority) {
        const byStatus: Record<Status, TaskDTO[]> = {
          todo: [],
          in_progress: [],
          done: [],
        };
        for (const t of next) byStatus[t.status].push(t);

        (Object.keys(byStatus) as Status[]).forEach((s) => {
          byStatus[s].sort(sortByPriorityThenOrder);
          byStatus[s].forEach((t, idx) => (t.order = idx + 1));
        });

        next = [...byStatus.todo, ...byStatus.in_progress, ...byStatus.done];
      }

      qc.setQueryData<TaskDTO[]>(QK.tasks, next);
      return { prev, changedPriority: Boolean(data.priority), snapshot: next, id };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK.tasks, ctx.prev);
    },

    onSuccess: async (_res, _vars, ctx) => {
      if (ctx?.changedPriority && ctx.snapshot) {
        const changed = ctx.snapshot.find((t) => t._id === ctx.id);
        if (changed) {
          const sameCol = ctx.snapshot
            .filter((t) => t.status === changed.status)
            .sort(sortByPriorityThenOrder);

          await reorderTasks({
            items: sameCol.map((t, idx) => ({
              id: t._id,
              status: t.status,
              order: idx + 1,
            })),
          });
        }
      }
    },

    onSettled: () => qc.invalidateQueries({ queryKey: QK.tasks }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.tasks }),
  });
}

export function useReorderTasks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderPayload) => reorderTasks(payload),

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: QK.tasks });
      const prev = qc.getQueryData<TaskDTO[]>(QK.tasks) ?? [];

      qc.setQueryData<TaskDTO[]>(
        QK.tasks,
        (old = []) => moveOptimistic(old, payload.items)
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK.tasks, ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: QK.tasks });
    },
  });
}

