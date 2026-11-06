import { X, Pencil, Trash2 } from 'lucide-react';
import type { Currency, InventoryStatus } from '../../types';
import { formatCurrency, inventoryStatusColors, inventoryStatusLabels } from '../../lib/formatters';
import { toUsd } from '../../lib/inventory';
import { inputClass, labelClass } from './styles';

export function ModalShell({
  title,
  onClose,
  wide = false,
  children,
}: {
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-sv-dark border border-sv-gray rounded-xl w-full max-h-[90vh] overflow-y-auto ${
          wide ? 'max-w-2xl' : 'max-w-md'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-sv-gray sticky top-0 bg-sv-dark z-10">
          <h2 className="text-sv-white font-semibold text-lg">{title}</h2>
          <button type="button" onClick={onClose} className="text-sv-gray-text hover:text-sv-white">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ModalActions({
  saving,
  isEditing,
  onCancel,
  createLabel = 'Create',
}: {
  saving: boolean;
  isEditing: boolean;
  onCancel: () => void;
  createLabel?: string;
}) {
  return (
    <div className="flex gap-3 justify-end pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 rounded-lg bg-sv-gray text-sv-white hover:bg-sv-gray-light transition-colors text-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 rounded-lg bg-sv-lime text-sv-black font-semibold text-sm hover:bg-sv-lime-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving…' : isEditing ? 'Update' : createLabel}
      </button>
    </div>
  );
}

export function StatusBadge({ status }: { status: InventoryStatus }) {
  const color = inventoryStatusColors[status];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: color + '20', color }}
    >
      {inventoryStatusLabels[status]}
    </span>
  );
}

/** Amount + currency + exchange rate (1 USD = ? X) + read-only USD equivalent, as in TransactionModal. */
export function MoneyFields({
  label,
  amount,
  currency,
  rate,
  required = false,
  hint,
  onChange,
}: {
  label: string;
  amount: string;
  currency: Currency;
  rate: string;
  required?: boolean;
  hint?: string;
  onChange: (patch: { amount?: string; currency?: Currency; rate?: string }) => void;
}) {
  const usd = toUsd(parseFloat(amount) || 0, currency, parseFloat(rate) || 0);
  const hasAmount = amount.trim() !== '';
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className={labelClass}>{label}</label>
        <input
          type="number"
          required={required}
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => onChange({ amount: e.target.value })}
          placeholder={required ? '0.00' : 'Optional'}
          className={inputClass}
        />
        {hint && <p className="text-sv-gray-text text-xs mt-1">{hint}</p>}
      </div>
      <div>
        <label className={labelClass}>Currency</label>
        <select
          value={currency}
          onChange={(e) => onChange({ currency: e.target.value as Currency })}
          className={inputClass}
        >
          <option value="USD">USD</option>
          <option value="MXN">MXN</option>
          <option value="COP">COP</option>
        </select>
      </div>
      {currency !== 'USD' && (
        <>
          <div>
            <label className={labelClass}>Exchange Rate (1 USD = ? {currency})</label>
            <input
              type="number"
              required={required || hasAmount}
              min="0.000001"
              step="0.000001"
              value={rate}
              onChange={(e) => onChange({ rate: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>USD Equivalent</label>
            <input
              type="text"
              readOnly
              value={hasAmount ? formatCurrency(usd) : '—'}
              className="w-full bg-sv-black border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-lime focus:outline-none cursor-not-allowed"
            />
          </div>
        </>
      )}
    </div>
  );
}

export function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex gap-1 justify-end shrink-0">
      <button
        onClick={onEdit}
        className="p-1.5 rounded-lg text-sv-gray-text hover:text-sv-lime hover:bg-sv-gray transition-colors"
        title="Edit"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg text-sv-gray-text hover:text-red-400 hover:bg-sv-gray transition-colors"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-sv-gray-text text-sm">
        {children}
      </td>
    </tr>
  );
}
