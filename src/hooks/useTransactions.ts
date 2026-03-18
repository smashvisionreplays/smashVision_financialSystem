import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Transaction, TransactionFormData, TransactionFilters, Club } from '../types';

export function useTransactions(filters?: TransactionFilters) {
  return useQuery<Transaction[]>({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          club:clubs(*),
          person:people(*),
          category:categories(*)
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
    mutationFn: async ({ data, clubs }: { data: TransactionFormData; clubs: Club[] }) => {
      const selectedClubIds = data.club_ids.filter(Boolean);

      // Single club or no club — insert one row
      if (selectedClubIds.length <= 1) {
        const { club_ids: _, ...rest } = data;
        const payload = {
          ...rest,
          club_id: selectedClubIds[0] || null,
          person_id: data.person_id || null,
          category_id: data.category_id || null,
          notes: data.notes || null,
        };
        const { data: result, error } = await supabase
          .from('transactions')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        return result;
      }

      // Multiple clubs — split proportionally by number_cameras
      const selectedClubs = clubs.filter((c) => selectedClubIds.includes(c.id));
      const totalCameras = selectedClubs.reduce((sum, c) => sum + c.number_cameras, 0);

      const rows = selectedClubs.map((club, i) => {
        const isLast = i === selectedClubs.length - 1;
        const proportion = club.number_cameras / totalCameras;
        const clubUsd = isLast
          ? Number((data.usd_amount - selectedClubs.slice(0, -1).reduce((s, c2) => s + Number((data.usd_amount * c2.number_cameras / totalCameras).toFixed(2)), 0)).toFixed(2))
          : Number((data.usd_amount * proportion).toFixed(2));
        const clubOriginal = isLast
          ? Number((data.original_amount - selectedClubs.slice(0, -1).reduce((s, c2) => s + Number((data.original_amount * c2.number_cameras / totalCameras).toFixed(2)), 0)).toFixed(2))
          : Number((data.original_amount * proportion).toFixed(2));

        const clubNames = selectedClubs.map((c) => c.name).join(' / ');
        const notePrefix = `Gasto compartido ${clubNames}`;
        const notes = data.notes ? `${notePrefix}. ${data.notes}` : notePrefix;

        return {
          date: data.date,
          type: data.type,
          original_amount: clubOriginal,
          original_currency: data.original_currency,
          exchange_rate: data.exchange_rate,
          usd_amount: clubUsd,
          description: data.description,
          notes,
          club_id: club.id,
          person_id: data.person_id || null,
          category_id: data.category_id || null,
        };
      });

      const { data: result, error } = await supabase
        .from('transactions')
        .insert(rows)
        .select();
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
      const { club_ids: _, ...rest } = data;
      const payload = {
        ...rest,
        club_id: data.club_id || null,
        person_id: data.person_id || null,
        category_id: data.category_id || null,
        notes: data.notes || null,
      };
      const { data: result, error } = await supabase
        .from('transactions')
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
        .from('transactions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
