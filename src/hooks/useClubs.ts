import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Club } from '../types';

export function useClubs() {
  return useQuery<Club[]>({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('finance_clubs')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });
}
