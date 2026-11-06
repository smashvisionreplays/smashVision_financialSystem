import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { InventoryCatalogItem, InventoryLocation, InventoryMovement, InventoryUnit } from '../types';

export type CatalogPayload = Omit<InventoryCatalogItem, 'id' | 'created_at' | 'updated_at'>;
export type LocationPayload = Omit<InventoryLocation, 'id' | 'created_at'>;
export type UnitPayload = Omit<InventoryUnit, 'id' | 'created_at' | 'updated_at' | 'catalog' | 'location'>;

const KEYS = {
  catalog: ['inventory-catalog'],
  locations: ['inventory-locations'],
  units: ['inventory-units'],
  movements: ['inventory-movements'],
} as const;

// Units embed catalog + location, so any change to those refreshes units too.
const refresh = (qc: QueryClient, ...keys: (keyof typeof KEYS)[]) =>
  keys.forEach((k) => qc.invalidateQueries({ queryKey: KEYS[k] }));

// ── Queries ───────────────────────────────────────────────────────────
export function useInventoryCatalog() {
  return useQuery<InventoryCatalogItem[]>({
    queryKey: KEYS.catalog,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_catalog')
        .select('*')
        .order('kind')
        .order('category')
        .order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function useInventoryLocations() {
  return useQuery<InventoryLocation[]>({
    queryKey: KEYS.locations,
    queryFn: async () => {
      const { data, error } = await supabase.from('inventory_locations').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function useInventoryUnits() {
  return useQuery<InventoryUnit[]>({
    queryKey: KEYS.units,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_units')
        .select('*, catalog:inventory_catalog(*), location:inventory_locations(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as InventoryUnit[];
    },
  });
}

export function useInventoryMovements(unitId: string | null) {
  return useQuery<InventoryMovement[]>({
    queryKey: [...KEYS.movements, unitId],
    enabled: !!unitId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .eq('unit_id', unitId!)
        .order('moved_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// ── Catalog mutations ─────────────────────────────────────────────────
export function useCreateCatalogItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CatalogPayload) => {
      const { data, error } = await supabase.from('inventory_catalog').insert(payload).select().single();
      if (error) throw error;
      return data as InventoryCatalogItem;
    },
    onSuccess: () => refresh(qc, 'catalog'),
  });
}

export function useUpdateCatalogItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CatalogPayload> }) => {
      const { data: result, error } = await supabase
        .from('inventory_catalog')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result as InventoryCatalogItem;
    },
    onSuccess: () => refresh(qc, 'catalog', 'units'),
  });
}

export function useDeleteCatalogItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inventory_catalog').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => refresh(qc, 'catalog', 'units'),
  });
}

// ── Location mutations ────────────────────────────────────────────────
export function useCreateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LocationPayload) => {
      const { data, error } = await supabase.from('inventory_locations').insert(payload).select().single();
      if (error) throw error;
      return data as InventoryLocation;
    },
    onSuccess: () => refresh(qc, 'locations'),
  });
}

export function useUpdateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LocationPayload }) => {
      const { data: result, error } = await supabase
        .from('inventory_locations')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result as InventoryLocation;
    },
    onSuccess: () => refresh(qc, 'locations', 'units'),
  });
}

export function useDeleteLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inventory_locations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => refresh(qc, 'locations', 'units', 'movements'),
  });
}

// ── Unit mutations ────────────────────────────────────────────────────
/** Accepts several rows so one form can register many serialized devices at once. */
export function useCreateUnits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payloads: UnitPayload[]) => {
      const { data, error } = await supabase.from('inventory_units').insert(payloads).select();
      if (error) throw error;
      return data as InventoryUnit[];
    },
    onSuccess: () => refresh(qc, 'units'),
  });
}

export function useUpdateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UnitPayload }) => {
      const { data: result, error } = await supabase
        .from('inventory_units')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result as InventoryUnit;
    },
    onSuccess: () => refresh(qc, 'units', 'movements'),
  });
}

export function useDeleteUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inventory_units').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => refresh(qc, 'units', 'movements'),
  });
}
