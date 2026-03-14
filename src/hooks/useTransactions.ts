import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Transaction, TransactionFormData, TransactionFilters } from '../types';

export function useTransactions(filters?: TransactionFilters) {
  return useQuery<Transaction[]>({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('finance_transactions')
        .select(`
          *,
          club:finance_clubs(*),
          person:finance_people(*),
          category:finance_categories(*)
        `)
        .order('date', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.club_id) {
        query = query.eq('club_id', filters.club_id);
      }
      if (filters?.person_id) {
        query = query.eq('person_id', filters.person_id);
      }
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters?.date_from) {
        query = query.gte('date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('date', filters.date_to);
      }
      if (filters?.search) {
        query = query.ilike('description', `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TransactionFormData) => {
      const payload = {
        ...data,
        club_id: data.club_id || null,
        person_id: data.person_id || null,
        category_id: data.category_id || null,
        notes: data.notes || null,
      };
      const { data: result, error } = await supabase
        .from('finance_transactions')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TransactionFormData> }) => {
      const payload = {
        ...data,
        club_id: data.club_id || null,
        person_id: data.person_id || null,
        category_id: data.category_id || null,
        notes: data.notes || null,
      };
      const { data: result, error } = await supabase
        .from('finance_transactions')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('finance_transactions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
