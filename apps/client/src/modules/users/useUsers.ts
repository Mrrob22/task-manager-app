import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../../services/api';

export function useUsers(q: string) {
  return useQuery({
    queryKey: ['users', q],
    queryFn: () => searchUsers(q),
    staleTime: 60_000,
  });
}
