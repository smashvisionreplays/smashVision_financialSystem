import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Person } from '../types';

export interface PersonFormData {
  name: string;
  role: Person['role'];
}

export function usePeople() {
  return useQuery<Person[]>({
    queryKey: ['people'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PersonFormData) => {
      const { data: result, error } = await supabase
        .from('people')
        .insert({ name: data.name.trim(), role: data.role })
        .select()
        .single();
      if (error) throw error;
      return result as Person;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PersonFormData }) => {
      const { data: result, error } = await supabase
        .from('people')
        .update({ name: data.name.trim(), role: data.role })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result as Person;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeletePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('people').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
