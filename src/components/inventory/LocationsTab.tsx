import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Warehouse, Building2, Briefcase, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import type { InventoryLocation, InventoryLocationType, InventoryUnit } from '../../types';
import { useClubs } from '../../hooks/useClubs';
import {
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation,
  type LocationPayload,
} from '../../hooks/useInventory';
import { formatCurrency, locationTypeLabels } from '../../lib/formatters';
import { countQty, isCurrentUnit, unitValueUsd } from '../../lib/inventory';
import ConfirmDialog from '../ui/ConfirmDialog';
import { ModalShell, ModalActions } from './ui';
import { errorMessage, inputClass, labelClass } from './styles';

const TYPES = Object.keys(locationTypeLabels) as InventoryLocationType[];

const typeIcons: Record<InventoryLocationType, typeof Warehouse> = {
  warehouse: Warehouse,
  club: Building2,
  office: Briefcase,
  person: User,
  other: MapPin,
};

// ── Location form modal ───────────────────────────────────────────────
function LocationModal({ location, onClose }: { location: InventoryLocation | null; onClose: () => void }) {
  const { data: clubs } = useClubs();
  const [form, setForm] = useState({
    name: location?.name ?? '',
    type: location?.type ?? ('warehouse' as InventoryLocationType),
    club_id: location?.club_id ?? '',
    notes: location?.notes ?? '',
  });
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const saving = createMutation.isPending || updateMutation.isPending;

  const selectClub = (clubId: string) => {
    const club = clubs?.find((c) => c.id === clubId);
    setForm((f) => ({ ...f, club_id: clubId, name: f.name.trim() || !club ? f.name : club.name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: LocationPayload = {
      name: form.name.trim(),
      type: form.type,
      club_id: form.type === 'club' ? form.club_id || null : null,
      notes: form.notes.trim() || null,
    };
    try {
      if (location) {
        await updateMutation.mutateAsync({ id: location.id, data: payload });
        toast.success('Location updated');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Location created');
      }
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, 'A location with that name already exists.'));
    }
  };

  return (
    <ModalShell title={location ? 'Edit Location' : 'Add Location'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className={labelClass}>Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as InventoryLocationType }))}
            className={inputClass}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {locationTypeLabels[t]}
              </option>
            ))}
          </select>
        </div>
        {form.type === 'club' && (
          <div>
            <label className={labelClass}>Linked club</label>
            <select value={form.club_id} onChange={(e) => selectClub(e.target.value)} className={inputClass}>
              <option value="">— None —</option>
              {clubs?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className={labelClass}>Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder={form.type === 'person' ? 'e.g. César (home office)' : 'e.g. Warehouse Cali'}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Optional — address, contact…"
            className={inputClass}
          />
        </div>
        <ModalActions saving={saving} isEditing={!!location} onCancel={onClose} />
      </form>
    </ModalShell>
  );
}

// ── Locations tab ─────────────────────────────────────────────────────
export default function LocationsTab({ locations, units }: { locations: InventoryLocation[]; units: InventoryUnit[] }) {
  const { data: clubs } = useClubs();
  const [modal, setModal] = useState<{ location: InventoryLocation | null } | null>(null);
  const [deleting, setDeleting] = useState<InventoryLocation | null>(null);
  const deleteMutation = useDeleteLocation();

  const stats = useMemo(() => {
    const m = new Map<string, { records: number; qty: number; value: number }>();
    for (const u of units) {
      if (!u.location_id) continue;
      const s = m.get(u.location_id) ?? { records: 0, qty: 0, value: 0 };
      s.records++;
      if (isCurrentUnit(u)) {
        s.qty += countQty(u);
        s.value += unitValueUsd(u);
      }
      m.set(u.location_id, s);
    }
    return m;
  }, [units]);

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success('Location deleted');
      setDeleting(null);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const deletingRecords = deleting ? stats.get(deleting.id)?.records ?? 0 : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sv-gray-text text-sm max-w-2xl">
          Where equipment is kept: warehouse, clubs, office or a person. Clubs can be linked to their club record.
        </p>
        <button
          onClick={() => setModal({ location: null })}
          className="flex items-center gap-2 px-4 py-2 bg-sv-lime text-sv-black rounded-lg font-semibold text-sm hover:bg-sv-lime-dark transition-colors shrink-0"
        >
          <Plus size={16} />
          Add Location
        </button>
      </div>

      <div className="space-y-2">
        {locations.map((loc) => {
          const Icon = typeIcons[loc.type];
          const s = stats.get(loc.id);
          const club = loc.club_id ? clubs?.find((c) => c.id === loc.club_id) : undefined;
          return (
            <div key={loc.id} className="bg-sv-dark border border-sv-gray rounded-xl p-4 flex flex-wrap items-center gap-3">
              <div className="p-2 bg-sv-lime/10 rounded-lg shrink-0">
                <Icon className="text-sv-lime" size={18} />
              </div>
              <div className="flex-1 min-w-[9rem]">
                <p className="text-sv-white font-semibold truncate">{loc.name}</p>
                <p className="text-sv-gray-text text-xs truncate">
                  {[club && `Club: ${club.name}`, loc.notes].filter(Boolean).join(' · ') || locationTypeLabels[loc.type]}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-sv-gray text-sv-white text-xs">{locationTypeLabels[loc.type]}</span>
                <span className="text-sv-gray-text text-xs">
                  {s?.qty ?? 0} unit{(s?.qty ?? 0) !== 1 ? 's' : ''}
                </span>
                <span className="text-sv-lime text-xs font-medium">{formatCurrency(s?.value ?? 0)}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setModal({ location: loc })}
                  className="p-2 rounded-lg text-sv-gray-text hover:text-sv-lime hover:bg-sv-gray transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleting(loc)}
                  className="p-2 rounded-lg text-sv-gray-text hover:text-red-400 hover:bg-sv-gray transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
        {locations.length === 0 && (
          <p className="text-sv-gray-text text-sm text-center py-8">No locations yet — add a warehouse or a club</p>
        )}
      </div>

      {modal && (
        <LocationModal key={modal.location?.id ?? 'new'} location={modal.location} onClose={() => setModal(null)} />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Location"
        message={
          deleting
            ? `Delete "${deleting.name}"? ${
                deletingRecords > 0
                  ? `${deletingRecords} inventory record${deletingRecords !== 1 ? 's are' : ' is'} at this location — they will be kept but left without a location (the move is logged in their history).`
                  : 'No inventory records are at this location.'
              }`
            : ''
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
