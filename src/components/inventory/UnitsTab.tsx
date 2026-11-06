import { useMemo, useState } from 'react';
import { Plus, Search, CalendarX, History, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import type {
  Currency,
  InventoryCatalogItem,
  InventoryLocation,
  InventoryStatus,
  InventoryUnit,
} from '../../types';
import {
  useCreateUnits,
  useUpdateUnit,
  useDeleteUnit,
  useInventoryMovements,
  type UnitPayload,
} from '../../hooks/useInventory';
import { formatCurrency, formatDate, inventoryStatusLabels, locationTypeLabels } from '../../lib/formatters';
import {
  catalogLabel,
  compareCatalog,
  countQty,
  formatQty,
  isCurrentUnit,
  toUsd,
  unitCostUsd,
  unitValueUsd,
} from '../../lib/inventory';
import ConfirmDialog from '../ui/ConfirmDialog';
import { ModalShell, ModalActions, MoneyFields, StatusBadge, EmptyRow, RowActions } from './ui';
import { WARN_COLOR, errorMessage, filterClass, inputClass, labelClass, tdClass, thClass } from './styles';

const STATUSES = Object.keys(inventoryStatusLabels) as InventoryStatus[];

// ── Movement history ──────────────────────────────────────────────────
function MovementHistory({ unitId, locations }: { unitId: string; locations: InventoryLocation[] }) {
  const { data: movements, isLoading } = useInventoryMovements(unitId);
  const name = (id: string | null) => (id ? locations.find((l) => l.id === id)?.name ?? 'Unknown' : 'No location');

  return (
    <div className="border-t border-sv-gray pt-4">
      <h3 className="text-sv-white font-semibold text-sm flex items-center gap-2 mb-3">
        <History size={15} className="text-sv-lime" />
        Movement history
      </h3>
      {isLoading ? (
        <p className="text-sv-gray-text text-xs">Loading…</p>
      ) : !movements?.length ? (
        <p className="text-sv-gray-text text-xs">No movements recorded.</p>
      ) : (
        <ol className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {movements.map((m) => {
            const created = m.from_status === null;
            const moved = m.from_location_id !== m.to_location_id || m.notes === 'Location deleted';
            const statusChanged = !created && m.from_status !== m.to_status;
            return (
              <li key={m.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs bg-sv-gray/40 rounded-lg px-3 py-2">
                <span className="text-sv-gray-text whitespace-nowrap">
                  {new Date(m.moved_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
                {created ? (
                  <span className="text-sv-white">
                    Added at <span className="font-medium">{name(m.to_location_id)}</span>
                  </span>
                ) : (
                  moved && (
                    <span className="text-sv-white flex items-center gap-1">
                      {m.notes === 'Location deleted' ? 'Deleted location' : name(m.from_location_id)}
                      <ArrowRight size={11} className="text-sv-gray-text" />
                      <span className="font-medium">{name(m.to_location_id)}</span>
                    </span>
                  )
                )}
                {created && m.to_status && <StatusBadge status={m.to_status} />}
                {statusChanged && m.from_status && m.to_status && (
                  <span className="flex items-center gap-1">
                    <StatusBadge status={m.from_status} />
                    <ArrowRight size={11} className="text-sv-gray-text" />
                    <StatusBadge status={m.to_status} />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

// ── Unit form modal ───────────────────────────────────────────────────
interface UnitForm {
  catalog_id: string;
  location_id: string;
  status: InventoryStatus;
  quantity: string;
  serials: string; // create: one per line · edit: single serial
  purchase_date: string;
  amount: string;
  currency: Currency;
  rate: string;
  supplier: string;
  warranty_until: string;
  notes: string;
}

function toForm(unit: InventoryUnit | null): UnitForm {
  return {
    catalog_id: unit?.catalog_id ?? '',
    location_id: unit?.location_id ?? '',
    status: unit?.status ?? 'in_stock',
    quantity: String(unit?.quantity ?? 1),
    serials: unit?.serial_number ?? '',
    purchase_date: unit?.purchase_date ?? '',
    amount: unit?.purchase_cost_original != null ? String(unit.purchase_cost_original) : '',
    currency: unit?.purchase_currency ?? 'USD',
    rate:
      unit?.purchase_currency && unit.purchase_currency !== 'USD' && unit.purchase_exchange_rate
        ? String(unit.purchase_exchange_rate)
        : '',
    supplier: unit?.supplier ?? '',
    warranty_until: unit?.warranty_until ?? '',
    notes: unit?.notes ?? '',
  };
}

function UnitModal({
  unit,
  catalog,
  locations,
  onClose,
}: {
  unit: InventoryUnit | null;
  catalog: InventoryCatalogItem[];
  locations: InventoryLocation[];
  onClose: () => void;
}) {
  const [form, setForm] = useState<UnitForm>(() => toForm(unit));
  const createMutation = useCreateUnits();
  const updateMutation = useUpdateUnit();
  const saving = createMutation.isPending || updateMutation.isPending;
  const set = (patch: Partial<UnitForm>) => setForm((f) => ({ ...f, ...patch }));

  // Active products, plus the current item when editing (it may be inactive now)
  const options = useMemo(() => {
    const list = catalog
      .filter((c) => (c.kind === 'product' && c.is_active) || c.id === unit?.catalog_id)
      .sort(compareCatalog);
    const groups = new Map<string, InventoryCatalogItem[]>();
    list.forEach((c) => groups.set(c.category, [...(groups.get(c.category) ?? []), c]));
    return Array.from(groups.entries());
  }, [catalog, unit?.catalog_id]);

  const locationGroups = useMemo(() => {
    const groups = new Map<string, InventoryLocation[]>();
    locations.forEach((l) => groups.set(l.type, [...(groups.get(l.type) ?? []), l]));
    return Array.from(groups.entries());
  }, [locations]);

  const selected = catalog.find((c) => c.id === form.catalog_id);
  const serialLines = unit ? [] : form.serials.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const multi = serialLines.length > 1;

  const changeLocation = (locationId: string) => {
    const type = locations.find((l) => l.id === locationId)?.type;
    let status = form.status;
    if (type === 'club' && status === 'in_stock') status = 'installed';
    if (type && type !== 'club' && status === 'installed') status = 'in_stock';
    set({ location_id: locationId, status });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.catalog_id) {
      toast.error('Select an item');
      return;
    }
    const hasCost = form.amount.trim() !== '';
    const cost = hasCost ? parseFloat(form.amount) || 0 : null;
    const rate = form.currency === 'USD' ? 1 : parseFloat(form.rate) || 0;
    if (hasCost && form.currency !== 'USD' && rate <= 0) {
      toast.error('Enter a valid exchange rate');
      return;
    }
    const base: Omit<UnitPayload, 'serial_number' | 'quantity'> = {
      catalog_id: form.catalog_id,
      location_id: form.location_id || null,
      status: form.status,
      purchase_date: form.purchase_date || null,
      purchase_cost_original: cost,
      purchase_currency: hasCost ? form.currency : null,
      purchase_exchange_rate: hasCost ? rate : null,
      purchase_cost_usd: cost !== null ? toUsd(cost, form.currency, rate) : null,
      supplier: form.supplier.trim() || null,
      warranty_until: form.warranty_until || null,
      notes: form.notes.trim() || null,
    };
    const quantity = Math.max(1, parseInt(form.quantity) || 1);
    try {
      if (unit) {
        await updateMutation.mutateAsync({
          id: unit.id,
          data: { ...base, quantity, serial_number: form.serials.trim() || null },
        });
        toast.success('Inventory record updated');
      } else if (multi) {
        await createMutation.mutateAsync(serialLines.map((s) => ({ ...base, quantity: 1, serial_number: s })));
        toast.success(`${serialLines.length} units added`);
      } else {
        await createMutation.mutateAsync([{ ...base, quantity, serial_number: serialLines[0] ?? null }]);
        toast.success('Added to inventory');
      }
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, 'That serial number already exists for this item.'));
    }
  };

  return (
    <ModalShell title={unit ? 'Edit Inventory Record' : 'Add to Inventory'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Item</label>
            <select
              required
              value={form.catalog_id}
              onChange={(e) => set({ catalog_id: e.target.value })}
              className={inputClass}
            >
              <option value="">Select a product…</option>
              {options.map(([category, items]) => (
                <optgroup key={category} label={category}>
                  {items.map((c) => (
                    <option key={c.id} value={c.id}>
                      {catalogLabel(c)}
                      {!c.is_active ? ' (inactive)' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {options.length === 0 && (
              <p className="text-xs mt-1" style={{ color: WARN_COLOR }}>
                No active products in the catalog — add them in the “Average costs” tab first.
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <select value={form.location_id} onChange={(e) => changeLocation(e.target.value)} className={inputClass}>
              <option value="">— No location —</option>
              {locationGroups.map(([type, locs]) => (
                <optgroup key={type} label={locationTypeLabels[type as InventoryLocation['type']]}>
                  {locs.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) => set({ status: e.target.value as InventoryStatus })}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {inventoryStatusLabels[s]}
                </option>
              ))}
            </select>
          </div>
          <div className={unit ? '' : 'sm:col-span-2'}>
            <label className={labelClass}>{unit ? 'Serial number' : 'Serial number(s)'}</label>
            {unit ? (
              <input
                value={form.serials}
                onChange={(e) => set({ serials: e.target.value })}
                placeholder="Optional"
                className={inputClass}
              />
            ) : (
              <>
                <textarea
                  rows={multi ? Math.min(6, serialLines.length + 1) : 2}
                  value={form.serials}
                  onChange={(e) => set({ serials: e.target.value })}
                  placeholder="Optional — one per line to register several devices at once"
                  className={`${inputClass} font-mono`}
                />
                <p className="text-sv-gray-text text-xs mt-1">
                  {multi
                    ? `${serialLines.length} records will be created (quantity 1 each).`
                    : 'Serialized devices: one record each. Bulk items (cable, mounts…): leave empty and set a quantity.'}
                </p>
              </>
            )}
          </div>
          <div>
            <label className={labelClass}>Quantity{selected ? ` (${selected.unit})` : ''}</label>
            <input
              type="number"
              required
              min="1"
              step="1"
              disabled={multi}
              value={multi ? 1 : form.quantity}
              onChange={(e) => set({ quantity: e.target.value })}
              className={`${inputClass} disabled:opacity-50`}
            />
          </div>
          <div>
            <label className={labelClass}>Purchase date</label>
            <input
              type="date"
              value={form.purchase_date}
              onChange={(e) => set({ purchase_date: e.target.value })}
              className={inputClass}
            />
            <p className="text-sv-gray-text text-xs mt-1">Optional — leave empty if unknown</p>
          </div>
        </div>

        <MoneyFields
          label="Purchase cost per unit"
          amount={form.amount}
          currency={form.currency}
          rate={form.rate}
          hint={
            selected
              ? `Empty = valued at the catalog average (${formatCurrency(Number(selected.avg_cost_usd))} / ${selected.unit})`
              : 'Optional'
          }
          onChange={(p) => set({ amount: p.amount ?? form.amount, currency: p.currency ?? form.currency, rate: p.rate ?? form.rate })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Supplier</label>
            <input
              value={form.supplier}
              onChange={(e) => set({ supplier: e.target.value })}
              placeholder="Optional"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Warranty until</label>
            <input
              type="date"
              value={form.warranty_until}
              onChange={(e) => set({ warranty_until: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => set({ notes: e.target.value })}
              placeholder="Optional — court, MAC/IP, condition…"
              className={inputClass}
            />
          </div>
        </div>

        <ModalActions
          saving={saving}
          isEditing={!!unit}
          onCancel={onClose}
          createLabel={multi ? `Create ${serialLines.length} units` : 'Create'}
        />

        {unit && <MovementHistory unitId={unit.id} locations={locations} />}
      </form>
    </ModalShell>
  );
}

// ── Units tab ─────────────────────────────────────────────────────────
type SortKey = 'item' | 'location' | 'purchase_date' | 'value';
const NO_LOCATION = '__none';

export default function UnitsTab({
  units,
  catalog,
  locations,
}: {
  units: InventoryUnit[];
  catalog: InventoryCatalogItem[];
  locations: InventoryLocation[];
}) {
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | 'current' | InventoryStatus>('current');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [missingDate, setMissingDate] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'item', dir: 1 });
  const [modal, setModal] = useState<{ unit: InventoryUnit | null } | null>(null);
  const [deleting, setDeleting] = useState<InventoryUnit | null>(null);
  const deleteMutation = useDeleteUnit();

  const categories = useMemo(
    () => Array.from(new Set(units.map((u) => u.catalog?.category).filter(Boolean) as string[])).sort(),
    [units],
  );
  const missingCount = units.filter((u) => !u.purchase_date).length;

  const q = search.trim().toLowerCase();
  const rows = units
    .filter((u) => {
      if (statusFilter === 'current' && !isCurrentUnit(u)) return false;
      if (statusFilter && statusFilter !== 'current' && u.status !== statusFilter) return false;
      if (locationFilter === NO_LOCATION ? u.location_id : locationFilter && u.location_id !== locationFilter)
        return false;
      if (category && u.catalog?.category !== category) return false;
      if (missingDate && u.purchase_date) return false;
      if (q) {
        const hay = [u.catalog?.name, u.catalog?.brand, u.catalog?.model, u.serial_number, u.supplier, u.notes];
        if (!hay.some((v) => v?.toLowerCase().includes(q))) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const byItem =
        (a.catalog?.category ?? '').localeCompare(b.catalog?.category ?? '') ||
        (a.catalog?.name ?? '').localeCompare(b.catalog?.name ?? '') ||
        (a.serial_number ?? '').localeCompare(b.serial_number ?? '');
      let d = 0;
      if (sort.key === 'location') d = (a.location?.name ?? '￿').localeCompare(b.location?.name ?? '￿');
      else if (sort.key === 'purchase_date')
        d = (a.purchase_date ?? '0000').localeCompare(b.purchase_date ?? '0000');
      else if (sort.key === 'value') d = unitValueUsd(a) - unitValueUsd(b);
      return d * sort.dir || byItem * (sort.key === 'item' ? sort.dir : 1);
    });

  const totals = rows.reduce(
    (acc, u) => ({ qty: acc.qty + countQty(u), value: acc.value + unitValueUsd(u) }),
    { qty: 0, value: 0 },
  );

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === 'value' ? -1 : 1 }));
  const arrow = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? ' ↑' : ' ↓') : '');
  const sortable = `${thClass} cursor-pointer hover:text-sv-white select-none`;

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success('Inventory record deleted');
      setDeleting(null);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sv-gray-text text-sm max-w-2xl">
          Physical devices and stock. Location and status changes are logged automatically in each record's history.
        </p>
        <button
          onClick={() => setModal({ unit: null })}
          className="flex items-center gap-2 px-4 py-2 bg-sv-lime text-sv-black rounded-lg font-semibold text-sm hover:bg-sv-lime-dark transition-colors shrink-0"
        >
          <Plus size={16} />
          Add to Inventory
        </button>
      </div>

      {/* Filters */}
      <div className="bg-sv-dark border border-sv-gray rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center gap-2">
        <div className="relative sm:col-span-2 lg:flex-1 lg:min-w-[14rem]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sv-gray-text" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search item, serial, supplier…"
            className={`${filterClass} w-full pl-8`}
          />
        </div>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className={filterClass}>
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
          <option value={NO_LOCATION}>No location</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className={filterClass}
        >
          <option value="current">Current (excl. retired)</option>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {inventoryStatusLabels[s]}
            </option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={filterClass}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={() => setMissingDate((v) => !v)}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            missingDate ? 'bg-sv-lime/10 text-sv-lime border-sv-lime/30' : 'bg-sv-gray text-sv-gray-text border-sv-gray-light hover:text-sv-white'
          }`}
          title="Show only records without a purchase date"
        >
          <CalendarX size={14} />
          Missing purchase date
          <span className="opacity-70">{missingCount}</span>
        </button>
      </div>

      <div className="bg-sv-dark border border-sv-gray rounded-xl overflow-hidden">
        {/* Phones: card list */}
        <div className="sm:hidden divide-y divide-sv-gray/50">
          {rows.map((u) => {
            const estimated = u.purchase_cost_usd === null || u.purchase_cost_usd === undefined;
            const bm = u.catalog ? [u.catalog.brand, u.catalog.model].filter(Boolean).join(' · ') : '';
            return (
              <div key={u.id} className="p-4 flex gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sv-white font-medium text-sm">{u.catalog?.name ?? 'Unknown item'}</p>
                  <p className="text-sv-gray-text text-xs">{[u.catalog?.category, bm].filter(Boolean).join(' · ')}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-xs">
                    <StatusBadge status={u.status} />
                    <span className="text-sv-white">{u.location?.name ?? 'No location'}</span>
                    <span className="text-sv-gray-text">qty {formatQty(u.quantity, u.catalog?.unit)}</span>
                  </div>
                  {u.serial_number && (
                    <p className="text-sv-gray-text text-xs font-mono mt-1 break-all">SN {u.serial_number}</p>
                  )}
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${u.purchase_date ? 'text-sv-gray-text' : ''}`}
                    style={u.purchase_date ? undefined : { color: WARN_COLOR }}
                  >
                    {u.purchase_date ? (
                      `Bought ${formatDate(u.purchase_date)}`
                    ) : (
                      <>
                        <CalendarX size={12} /> No purchase date
                      </>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-sv-lime font-medium text-sm">{formatCurrency(unitValueUsd(u))}</span>
                    {estimated && <span className="text-sv-gray-text text-[10px] block">est.</span>}
                  </div>
                  <RowActions onEdit={() => setModal({ unit: u })} onDelete={() => setDeleting(u)} />
                </div>
              </div>
            );
          })}
          {rows.length === 0 && (
            <p className="px-4 py-12 text-center text-sv-gray-text text-sm">
              {units.length === 0 ? 'No inventory yet — add your first device' : 'No records match the filters'}
            </p>
          )}
        </div>

        {/* Tablet / desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sv-gray">
                <th className={sortable} onClick={() => toggleSort('item')}>
                  Item{arrow('item')}
                </th>
                <th className={`${thClass} hidden sm:table-cell`}>Serial</th>
                <th className={`${sortable} hidden md:table-cell`} onClick={() => toggleSort('location')}>
                  Location{arrow('location')}
                </th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right hidden sm:table-cell`}>Qty</th>
                <th className={`${sortable} hidden lg:table-cell`} onClick={() => toggleSort('purchase_date')}>
                  Purchase date{arrow('purchase_date')}
                </th>
                <th className={`${thClass} text-right hidden xl:table-cell`}>Unit cost</th>
                <th className={`${sortable} text-right`} onClick={() => toggleSort('value')}>
                  Value{arrow('value')}
                </th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => {
                const cost = unitCostUsd(u);
                const estimated = u.purchase_cost_usd === null || u.purchase_cost_usd === undefined;
                const bm = u.catalog ? [u.catalog.brand, u.catalog.model].filter(Boolean).join(' · ') : '';
                return (
                  <tr key={u.id} className="border-b border-sv-gray/50 hover:bg-sv-gray/20 transition-colors">
                    <td className={`${tdClass} text-sv-white`}>
                      <span className="font-medium">{u.catalog?.name ?? 'Unknown item'}</span>
                      <span className="text-sv-gray-text text-xs block">
                        {[u.catalog?.category, bm].filter(Boolean).join(' · ')}
                      </span>
                      {/* Compact details for small screens */}
                      <span className="text-sv-gray-text text-xs block md:hidden">
                        {[u.serial_number && `SN ${u.serial_number}`, u.location?.name ?? 'No location', `qty ${formatQty(u.quantity, u.catalog?.unit)}`]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                      <span
                        className={`text-xs block lg:hidden ${u.purchase_date ? 'text-sv-gray-text' : ''}`}
                        style={u.purchase_date ? undefined : { color: WARN_COLOR }}
                      >
                        {u.purchase_date ? `Bought ${formatDate(u.purchase_date)}` : 'No purchase date'}
                      </span>
                    </td>
                    <td className={`${tdClass} text-sv-gray-text hidden sm:table-cell font-mono text-xs whitespace-nowrap`}>
                      {u.serial_number || '—'}
                    </td>
                    <td className={`${tdClass} hidden md:table-cell whitespace-nowrap`}>
                      {u.location ? (
                        <span className="text-sv-white">{u.location.name}</span>
                      ) : (
                        <span className="text-sv-gray-text">—</span>
                      )}
                    </td>
                    <td className={tdClass}>
                      <StatusBadge status={u.status} />
                    </td>
                    <td className={`${tdClass} text-right text-sv-white hidden sm:table-cell whitespace-nowrap`}>
                      {formatQty(u.quantity, u.catalog?.unit)}
                    </td>
                    <td className={`${tdClass} hidden lg:table-cell whitespace-nowrap`}>
                      {u.purchase_date ? (
                        <span className="text-sv-white">{formatDate(u.purchase_date)}</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs" style={{ color: WARN_COLOR }} title="No purchase date">
                          <CalendarX size={13} />—
                        </span>
                      )}
                    </td>
                    <td className={`${tdClass} text-right hidden xl:table-cell whitespace-nowrap`}>
                      {cost === null ? (
                        <span className="text-sv-gray-text">—</span>
                      ) : (
                        <>
                          <span className={estimated ? 'text-sv-gray-text' : 'text-sv-white'}>{formatCurrency(cost)}</span>
                          {estimated ? (
                            <span className="text-sv-gray-text text-[10px] block">catalog avg.</span>
                          ) : (
                            u.purchase_currency &&
                            u.purchase_currency !== 'USD' &&
                            u.purchase_cost_original !== null && (
                              <span className="text-sv-gray-text text-[10px] block">
                                {formatCurrency(Number(u.purchase_cost_original), u.purchase_currency)}
                              </span>
                            )
                          )}
                        </>
                      )}
                    </td>
                    <td className={`${tdClass} text-right whitespace-nowrap`}>
                      <span className="text-sv-lime font-medium">{formatCurrency(unitValueUsd(u))}</span>
                      {estimated && <span className="text-sv-gray-text text-[10px] block xl:hidden">est.</span>}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <RowActions onEdit={() => setModal({ unit: u })} onDelete={() => setDeleting(u)} />
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <EmptyRow colSpan={9}>
                  {units.length === 0 ? 'No inventory yet — add your first device' : 'No records match the filters'}
                </EmptyRow>
              )}
            </tbody>
          </table>
        </div>
        {rows.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-sv-gray text-xs">
            <span className="text-sv-gray-text">
              {rows.length} record{rows.length !== 1 ? 's' : ''} · {totals.qty} unit{totals.qty !== 1 ? 's' : ''}
            </span>
            <span className="text-sv-gray-text">
              Value <span className="text-sv-lime font-semibold text-sm">{formatCurrency(totals.value)}</span>
            </span>
          </div>
        )}
      </div>

      {modal && (
        <UnitModal
          key={modal.unit?.id ?? 'new'}
          unit={modal.unit}
          catalog={catalog}
          locations={locations}
          onClose={() => setModal(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Inventory Record"
        message={
          deleting
            ? `Delete ${deleting.catalog?.name ?? 'this record'}${
                deleting.serial_number ? ` (SN ${deleting.serial_number})` : ''
              }? Its movement history is deleted too. If the device was decommissioned, set its status to “Retired” instead to keep the history.`
            : ''
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
