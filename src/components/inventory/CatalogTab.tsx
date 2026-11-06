import { useMemo, useState } from 'react';
import { Plus, Package, Wrench, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Currency, InventoryCatalogItem, InventoryKind, InventoryUnit } from '../../types';
import {
  useCreateCatalogItem,
  useUpdateCatalogItem,
  useDeleteCatalogItem,
  type CatalogPayload,
} from '../../hooks/useInventory';
import { formatCurrency } from '../../lib/formatters';
import {
  CATEGORY_SUGGESTIONS,
  UNIT_SUGGESTIONS,
  compareCatalog,
  formatQty,
  isCurrentUnit,
  purchaseAverages,
  toUsd,
} from '../../lib/inventory';
import ConfirmDialog from '../ui/ConfirmDialog';
import { ModalShell, ModalActions, MoneyFields, EmptyRow, RowActions } from './ui';
import { errorMessage, filterClass, inputClass, labelClass, tdClass, thClass } from './styles';

// ── Catalog form modal ────────────────────────────────────────────────
interface CatalogForm {
  kind: InventoryKind;
  name: string;
  category: string;
  brand: string;
  model: string;
  unit: string;
  amount: string;
  currency: Currency;
  rate: string;
  notes: string;
  is_active: boolean;
}

function toForm(item: InventoryCatalogItem | null, kind: InventoryKind): CatalogForm {
  if (!item) {
    return {
      kind,
      name: '',
      category: '',
      brand: '',
      model: '',
      unit: kind === 'service' ? 'camera' : 'unit',
      amount: '',
      currency: 'USD',
      rate: '',
      notes: '',
      is_active: true,
    };
  }
  return {
    kind: item.kind,
    name: item.name,
    category: item.category,
    brand: item.brand || '',
    model: item.model || '',
    unit: item.unit,
    amount: String(item.avg_cost_original),
    currency: item.currency,
    rate: item.currency === 'USD' ? '' : String(item.exchange_rate),
    notes: item.notes || '',
    is_active: item.is_active,
  };
}

function CatalogModal({
  item,
  defaultKind,
  catalog,
  purchaseAvg,
  onClose,
}: {
  item: InventoryCatalogItem | null;
  defaultKind: InventoryKind;
  catalog: InventoryCatalogItem[];
  purchaseAvg?: { avgUsd: number; qty: number };
  onClose: () => void;
}) {
  const [form, setForm] = useState<CatalogForm>(() => toForm(item, defaultKind));
  const createMutation = useCreateCatalogItem();
  const updateMutation = useUpdateCatalogItem();
  const saving = createMutation.isPending || updateMutation.isPending;
  const isProduct = form.kind === 'product';
  const set = (patch: Partial<CatalogForm>) => setForm((f) => ({ ...f, ...patch }));

  const categoryOptions = useMemo(() => {
    const own = catalog.filter((c) => c.kind === form.kind).map((c) => c.category);
    return Array.from(new Set([...CATEGORY_SUGGESTIONS[form.kind], ...own])).sort();
  }, [catalog, form.kind]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount) || 0;
    const rate = form.currency === 'USD' ? 1 : parseFloat(form.rate) || 0;
    if (form.currency !== 'USD' && rate <= 0) {
      toast.error('Enter a valid exchange rate');
      return;
    }
    const payload: CatalogPayload = {
      kind: form.kind,
      name: form.name.trim(),
      category: form.category.trim() || 'Other',
      brand: isProduct ? form.brand.trim() || null : null,
      model: isProduct ? form.model.trim() || null : null,
      unit: form.unit.trim() || 'unit',
      avg_cost_original: amount,
      currency: form.currency,
      exchange_rate: rate,
      avg_cost_usd: toUsd(amount, form.currency, rate),
      notes: form.notes.trim() || null,
      is_active: form.is_active,
    };
    try {
      if (item) {
        await updateMutation.mutateAsync({ id: item.id, data: payload });
        toast.success('Item updated');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(isProduct ? 'Product added to the catalog' : 'Service added to the catalog');
      }
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, `A ${form.kind} with that name already exists.`));
    }
  };

  return (
    <ModalShell title={item ? 'Edit Catalog Item' : 'Add Catalog Item'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="flex gap-2">
          {(['product', 'service'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                // swap the default unit when it was left untouched
                const defaultUnit = (kind: InventoryKind) => (kind === 'service' ? 'camera' : 'unit');
                set({ kind: k, unit: form.unit === defaultUnit(form.kind) ? defaultUnit(k) : form.unit });
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                form.kind === k
                  ? 'bg-sv-lime/10 text-sv-lime border-sv-lime/30'
                  : 'bg-sv-gray text-sv-gray-text border-sv-gray-light hover:text-sv-white'
              }`}
            >
              {k === 'product' ? <Package size={15} /> : <Wrench size={15} />}
              {k === 'product' ? 'Product' : 'Service'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder={isProduct ? 'e.g. 4K PoE camera' : 'e.g. Installation of one camera'}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input
              required
              list="inventory-category-options"
              value={form.category}
              onChange={(e) => set({ category: e.target.value })}
              placeholder={isProduct ? 'e.g. Camera' : 'e.g. Installation'}
              className={inputClass}
            />
            <datalist id="inventory-category-options">
              {categoryOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={labelClass}>Unit</label>
            <input
              required
              list="inventory-unit-options"
              value={form.unit}
              onChange={(e) => set({ unit: e.target.value })}
              placeholder="unit"
              className={inputClass}
            />
            <datalist id="inventory-unit-options">
              {UNIT_SUGGESTIONS.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
            <p className="text-sv-gray-text text-xs mt-1">
              {isProduct ? 'How it is counted (unit, meter, roll…)' : 'What the price covers (camera, club, hour…)'}
            </p>
          </div>
          {isProduct && (
            <>
              <div>
                <label className={labelClass}>Brand</label>
                <input
                  value={form.brand}
                  onChange={(e) => set({ brand: e.target.value })}
                  placeholder="Optional"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Model</label>
                <input
                  value={form.model}
                  onChange={(e) => set({ model: e.target.value })}
                  placeholder="Optional"
                  className={inputClass}
                />
              </div>
            </>
          )}
        </div>

        <MoneyFields
          label={`Average cost per ${form.unit.trim() || 'unit'}`}
          amount={form.amount}
          currency={form.currency}
          rate={form.rate}
          required
          onChange={(p) => set({ amount: p.amount ?? form.amount, currency: p.currency ?? form.currency, rate: p.rate ?? form.rate })}
        />
        {isProduct && purchaseAvg && purchaseAvg.qty > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs bg-sv-gray/50 border border-sv-gray-light rounded-lg px-3 py-2">
            <span className="text-sv-gray-text">
              Average from recorded purchases:{' '}
              <span className="text-sv-white font-medium">{formatCurrency(purchaseAvg.avgUsd)}</span> across{' '}
              {purchaseAvg.qty} unit{purchaseAvg.qty !== 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={() => set({ amount: String(purchaseAvg.avgUsd), currency: 'USD', rate: '' })}
              className="text-sv-lime hover:underline font-medium"
            >
              Use it
            </button>
          </div>
        )}

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => set({ notes: e.target.value })}
            placeholder="Optional — what is included, typical supplier…"
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-sv-white cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => set({ is_active: e.target.checked })}
            className="accent-sv-lime w-4 h-4"
          />
          Active
          <span className="text-sv-gray-text text-xs">(inactive items are hidden from new inventory entries and the PDF)</span>
        </label>
        <ModalActions saving={saving} isEditing={!!item} onCancel={onClose} />
      </form>
    </ModalShell>
  );
}

// ── Catalog tab ───────────────────────────────────────────────────────
type KindFilter = 'all' | InventoryKind;

export default function CatalogTab({ catalog, units }: { catalog: InventoryCatalogItem[]; units: InventoryUnit[] }) {
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [modal, setModal] = useState<{ item: InventoryCatalogItem | null; kind: InventoryKind } | null>(null);
  const [deleting, setDeleting] = useState<InventoryCatalogItem | null>(null);
  const deleteMutation = useDeleteCatalogItem();
  const updateMutation = useUpdateCatalogItem();

  const purchaseAvg = useMemo(() => purchaseAverages(units), [units]);
  const usage = useMemo(() => {
    const m = new Map<string, { records: number; currentQty: number }>();
    for (const u of units) {
      const a = m.get(u.catalog_id) ?? { records: 0, currentQty: 0 };
      a.records++;
      if (isCurrentUnit(u)) a.currentQty += Number(u.quantity);
      m.set(u.catalog_id, a);
    }
    return m;
  }, [units]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(catalog.filter((c) => kindFilter === 'all' || c.kind === kindFilter).map((c) => c.category)),
      ).sort(),
    [catalog, kindFilter],
  );

  const q = search.trim().toLowerCase();
  const visible = catalog
    .filter((c) => showInactive || c.is_active)
    .filter((c) => !category || c.category === category)
    .filter(
      (c) => !q || [c.name, c.brand, c.model, c.category, c.notes].some((v) => v?.toLowerCase().includes(q)),
    )
    .sort(compareCatalog);

  const inactiveCount = catalog.filter((c) => !c.is_active).length;
  const sections: InventoryKind[] = kindFilter === 'all' ? ['product', 'service'] : [kindFilter];

  const confirmDelete = async () => {
    if (!deleting) return;
    const used = usage.get(deleting.id)?.records ?? 0;
    try {
      if (used > 0) {
        await updateMutation.mutateAsync({ id: deleting.id, data: { is_active: false } });
        toast.success('Item deactivated');
      } else {
        await deleteMutation.mutateAsync(deleting.id);
        toast.success('Item deleted');
      }
      setDeleting(null);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const requestDelete = (item: InventoryCatalogItem) => {
    const used = usage.get(item.id)?.records ?? 0;
    if (used > 0 && !item.is_active) {
      toast.error(`Used by ${used} inventory record${used !== 1 ? 's' : ''} — it can't be deleted`);
      return;
    }
    setDeleting(item);
  };

  const deletingUsed = deleting ? usage.get(deleting.id)?.records ?? 0 : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sv-gray-text text-sm max-w-2xl">
          Average cost of each product and service. Used to value inventory units without a purchase cost and in the
          PDF report.
        </p>
        <button
          onClick={() => setModal({ item: null, kind: kindFilter === 'service' ? 'service' : 'product' })}
          className="flex items-center gap-2 px-4 py-2 bg-sv-lime text-sv-black rounded-lg font-semibold text-sm hover:bg-sv-lime-dark transition-colors shrink-0"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-sv-dark border border-sv-gray rounded-xl p-3 flex flex-wrap items-center gap-2">
        <div className="flex gap-1 bg-sv-gray rounded-lg p-1">
          {(['all', 'product', 'service'] as const).map((k) => (
            <button
              key={k}
              onClick={() => {
                setKindFilter(k);
                setCategory('');
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                kindFilter === k ? 'bg-sv-lime text-sv-black' : 'text-sv-gray-text hover:text-sv-white'
              }`}
            >
              {k === 'all' ? 'All' : k === 'product' ? 'Products' : 'Services'}
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${filterClass} min-w-[10rem]`}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="relative flex-1 min-w-[12rem]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sv-gray-text" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, brand, model…"
            className={`${filterClass} w-full pl-8`}
          />
        </div>
        {inactiveCount > 0 && (
          <label className="flex items-center gap-2 text-xs text-sv-gray-text cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="accent-sv-lime"
            />
            Show inactive ({inactiveCount})
          </label>
        )}
      </div>

      {sections.map((kind) => {
        const rows = visible.filter((c) => c.kind === kind);
        const isProduct = kind === 'product';
        const colCount = isProduct ? 7 : 5;
        return (
          <div key={kind} className="bg-sv-dark border border-sv-gray rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-sv-gray">
              {isProduct ? <Package size={16} className="text-sv-lime" /> : <Wrench size={16} className="text-sv-lime" />}
              <h3 className="text-sv-white font-semibold text-sm">{isProduct ? 'Products' : 'Services'}</h3>
              <span className="text-sv-gray-text text-xs">{rows.length}</span>
            </div>
            {/* Phones: card list */}
            <div className="sm:hidden divide-y divide-sv-gray/50">
              {rows.map((item) => {
                const pa = purchaseAvg.get(item.id);
                const use = usage.get(item.id);
                const bm = [item.brand, item.model].filter(Boolean).join(' · ');
                return (
                  <div key={item.id} className={`p-4 flex gap-3 ${item.is_active ? '' : 'opacity-50'}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sv-white font-medium text-sm">
                        {item.name}
                        {!item.is_active && <span className="text-sv-gray-text text-[10px] uppercase ml-2">inactive</span>}
                      </p>
                      <p className="text-sv-gray-text text-xs">{[item.category, isProduct && bm].filter(Boolean).join(' · ')}</p>
                      {isProduct && (
                        <p className="text-sv-gray-text text-xs mt-1">
                          {use?.currentQty ? `${formatQty(use.currentQty, item.unit)} in inventory` : 'Not in inventory'}
                          {pa && ` · purchases avg. ${formatCurrency(pa.avgUsd)} (${pa.qty})`}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                      <div className="text-right whitespace-nowrap">
                        <span className="text-sv-lime font-medium text-sm">{formatCurrency(Number(item.avg_cost_usd))}</span>
                        <span className="text-sv-gray-text text-xs"> / {item.unit}</span>
                        {item.currency !== 'USD' && (
                          <span className="text-sv-gray-text text-[10px] block">
                            {formatCurrency(Number(item.avg_cost_original), item.currency)}
                          </span>
                        )}
                      </div>
                      <RowActions onEdit={() => setModal({ item, kind: item.kind })} onDelete={() => requestDelete(item)} />
                    </div>
                  </div>
                );
              })}
              {rows.length === 0 && (
                <p className="px-4 py-10 text-center text-sv-gray-text text-sm">
                  {catalog.some((c) => c.kind === kind) ? 'No items match the filters' : `No ${kind}s yet`}
                </p>
              )}
            </div>

            {/* Tablet / desktop: table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sv-gray">
                    <th className={thClass}>Name</th>
                    {isProduct && <th className={`${thClass} hidden md:table-cell`}>Brand / Model</th>}
                    <th className={`${thClass} hidden sm:table-cell`}>Category</th>
                    <th className={`${thClass} text-right`}>Avg. cost</th>
                    {isProduct && (
                      <th className={`${thClass} text-right hidden lg:table-cell`} title="Quantity-weighted average of units with a purchase cost">
                        Avg. from purchases
                      </th>
                    )}
                    {isProduct && <th className={`${thClass} text-right hidden sm:table-cell`}>In inventory</th>}
                    <th className={`${thClass} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => {
                    const pa = purchaseAvg.get(item.id);
                    const use = usage.get(item.id);
                    const bm = [item.brand, item.model].filter(Boolean).join(' · ');
                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-sv-gray/50 hover:bg-sv-gray/20 transition-colors ${
                          item.is_active ? '' : 'opacity-50'
                        }`}
                      >
                        <td className={`${tdClass} text-sv-white`}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{item.name}</span>
                            {!item.is_active && (
                              <span className="px-1.5 py-0.5 rounded bg-sv-gray text-sv-gray-text text-[10px] uppercase tracking-wide">
                                inactive
                              </span>
                            )}
                          </div>
                          {isProduct && bm && <span className="text-sv-gray-text text-xs block md:hidden">{bm}</span>}
                          <span className="text-sv-gray-text text-xs block sm:hidden">{item.category}</span>
                          {item.notes && (
                            <span className="text-sv-gray-text text-xs block max-w-xs truncate" title={item.notes}>
                              {item.notes}
                            </span>
                          )}
                        </td>
                        {isProduct && (
                          <td className={`${tdClass} text-sv-gray-text hidden md:table-cell whitespace-nowrap`}>
                            {bm || '—'}
                          </td>
                        )}
                        <td className={`${tdClass} hidden sm:table-cell`}>
                          <span className="px-2 py-0.5 rounded bg-sv-gray text-sv-white text-xs whitespace-nowrap">
                            {item.category}
                          </span>
                        </td>
                        <td className={`${tdClass} text-right whitespace-nowrap`}>
                          <span className="text-sv-lime font-medium">{formatCurrency(Number(item.avg_cost_usd))}</span>
                          <span className="text-sv-gray-text text-xs"> / {item.unit}</span>
                          {item.currency !== 'USD' && (
                            <span className="text-sv-gray-text text-xs block">
                              {formatCurrency(Number(item.avg_cost_original), item.currency)}
                            </span>
                          )}
                        </td>
                        {isProduct && (
                          <td className={`${tdClass} text-right whitespace-nowrap hidden lg:table-cell`}>
                            {pa ? (
                              <>
                                <span className="text-sv-white">{formatCurrency(pa.avgUsd)}</span>
                                <span className="text-sv-gray-text text-xs"> ({pa.qty})</span>
                              </>
                            ) : (
                              <span className="text-sv-gray-text">—</span>
                            )}
                          </td>
                        )}
                        {isProduct && (
                          <td className={`${tdClass} text-right text-sv-white hidden sm:table-cell`}>
                            {use?.currentQty ? (
                              formatQty(use.currentQty, item.unit)
                            ) : (
                              <span className="text-sv-gray-text">0</span>
                            )}
                          </td>
                        )}
                        <td className={`${tdClass} text-right`}>
                          <RowActions
                            onEdit={() => setModal({ item, kind: item.kind })}
                            onDelete={() => requestDelete(item)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <EmptyRow colSpan={colCount}>
                      {catalog.some((c) => c.kind === kind)
                        ? 'No items match the filters'
                        : isProduct
                          ? 'No products yet — add your equipment (cameras, switches, PCs, mounts…)'
                          : 'No services yet — e.g. “Installation of one camera”, “Installation of a club”'}
                    </EmptyRow>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {modal && (
        <CatalogModal
          key={modal.item?.id ?? `new-${modal.kind}`}
          item={modal.item}
          defaultKind={modal.kind}
          catalog={catalog}
          purchaseAvg={modal.item ? purchaseAvg.get(modal.item.id) : undefined}
          onClose={() => setModal(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title={deletingUsed > 0 ? 'Item in use' : 'Delete Item'}
        confirmLabel={deletingUsed > 0 ? 'Deactivate' : 'Delete'}
        message={
          deleting
            ? deletingUsed > 0
              ? `"${deleting.name}" is used by ${deletingUsed} inventory record${deletingUsed !== 1 ? 's' : ''}, so it can't be deleted. Deactivate it to hide it from new entries and the PDF while keeping the history.`
              : `Delete "${deleting.name}" from the catalog? No inventory records use it.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
