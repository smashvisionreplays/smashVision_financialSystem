export const inputClass =
  'w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white placeholder-sv-gray-text focus:outline-none focus:border-sv-lime/50';

export const labelClass = 'block text-sv-gray-text text-sm mb-1';

export const thClass = 'text-left text-sv-gray-text font-medium px-4 py-3 whitespace-nowrap';
export const tdClass = 'px-4 py-3';

/** Amber used to flag records that need attention (same hex as the app's warning tone). */
export const WARN_COLOR = '#F59E0B';

export function errorMessage(err: unknown, duplicate = 'That name already exists.'): string {
  const code = (err as { code?: string })?.code;
  if (code === '23505') return duplicate;
  if (code === '23503') return 'This record is still referenced by other inventory data.';
  return (err as { message?: string })?.message || 'Something went wrong.';
}

/** Supabase/PostgREST error when the inventory tables have not been created yet. */
export function isMissingTableError(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | null;
  return !!e && (e.code === 'PGRST205' || e.code === '42P01' || /could not find the table/i.test(e.message || ''));
}

/** Compact input/select for filter bars (no fixed width). */
export const filterClass =
  'bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-1.5 text-sm text-sv-white placeholder-sv-gray-text focus:outline-none focus:border-sv-lime/50';
