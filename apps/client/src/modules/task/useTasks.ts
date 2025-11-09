import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, listTasks, patchTask, type TaskDTO } from '../../services/api';

export function useTasks() {
  return useQuery({ queryKey: ['tasks'], queryFn: listTasks });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<TaskDTO>) => createTask(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskDTO> }) =>
      patchTask(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['tasks'] });
      const prev = qc.getQueryData<TaskDTO[]>(['tasks']) || [];
      qc.setQueryData<TaskDTO[]>(['tasks'], prev.map(t => (t._id === id ? { ...t, ...data } as TaskDTO : t)));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(['tasks'], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
