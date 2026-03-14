import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Person } from '../types';

export function usePeople() {
  return useQuery<Person[]>({
    queryKey: ['people'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('finance_people')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });
}
