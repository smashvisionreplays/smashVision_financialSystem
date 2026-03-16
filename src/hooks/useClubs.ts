import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Club } from '../types';

export function useClubs() {
  return useQuery<Club[]>({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });
}
