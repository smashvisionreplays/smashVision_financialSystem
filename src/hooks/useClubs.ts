import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Club } from '../types';

export interface ClubFormData {
  name: string;
  country: string;
  city: string;
  status: 'active' | 'inactive';
  number_cameras: number;
}

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

function toPayload(data: ClubFormData) {
  return {
    name: data.name.trim(),
    country: data.country.trim() || null,
    city: data.city.trim() || null,
    status: data.status,
    number_cameras: data.number_cameras,
  };
}

export function useCreateClub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ClubFormData) => {
      const { data: result, error } = await supabase
        .from('clubs')
        .insert(toPayload(data))
        .select()
        .single();
      if (error) throw error;
      return result as Club;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useUpdateClub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClubFormData }) => {
      const { data: result, error } = await supabase
        .from('clubs')
        .update(toPayload(data))
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result as Club;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeleteClub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clubs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
