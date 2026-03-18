import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { Transaction, TransactionFormData, TransactionType } from '../../types';
import { useClubs } from '../../hooks/useClubs';
import { usePeople } from '../../hooks/usePeople';
import { useCategories } from '../../hooks/useCategories';
import { transactionTypeLabels, formatCurrency } from '../../lib/formatters';

interface TransactionModalProps {
  open: boolean;
  transaction?: Transaction | null;
  onSubmit: (data: TransactionFormData) => void;
  onClose: () => void;
}

const emptyForm: TransactionFormData = {
  date: new Date().toISOString().slice(0, 10),
  type: 'expense',
  original_amount: 0,
  original_currency: 'USD',
  exchange_rate: 1,
  usd_amount: 0,
  description: '',
  notes: '',
  club_id: '',
  club_ids: [],
  person_id: '',
  category_id: '',
};

export default function TransactionModal({ open, transaction, onSubmit, onClose }: TransactionModalProps) {
  const [form, setForm] = useState<TransactionFormData>(emptyForm);
  const { data: clubs } = useClubs();
  const { data: people } = usePeople();
  const { data: categories } = useCategories();

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        type: transaction.type,
        original_amount: transaction.original_amount,
        original_currency: transaction.original_currency,
        exchange_rate: transaction.exchange_rate,
        usd_amount: transaction.usd_amount,
        description: transaction.description,
        notes: transaction.notes || '',
        club_id: transaction.club_id || '',
        club_ids: transaction.club_id ? [transaction.club_id] : [],
        person_id: transaction.person_id || '',
        category_id: transaction.category_id || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [transaction, open]);

  useEffect(() => {
    if (form.original_currency === 'USD') {
      setForm((f) => ({ ...f, exchange_rate: 1, usd_amount: f.original_amount }));
    } else if (form.exchange_rate > 0) {
      setForm((f) => ({
        ...f,
        usd_amount: Number((f.original_amount / f.exchange_rate).toFixed(2)),
      }));
    }
  }, [form.original_amount, form.exchange_rate, form.original_currency]);

  const update = (key: keyof TransactionFormData, value: string | number) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleClub = (clubId: string) => {
    setForm((f) => {
      const ids = f.club_ids.includes(clubId)
        ? f.club_ids.filter((id) => id !== clubId)
        : [...f.club_ids, clubId];
      return { ...f, club_ids: ids, club_id: ids[0] || '' };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const filteredCategories = categories?.filter(
    (c) => c.type === form.type || c.type === 'both'
  );

  // Calculate proportional split preview
  const selectedClubs = clubs?.filter((c) => form.club_ids.includes(c.id)) || [];
  const totalCameras = selectedClubs.reduce((sum, c) => sum + c.number_cameras, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-sv-dark border border-sv-gray rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-sv-gray">
          <h2 className="text-sv-white font-semibold text-lg">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-sv-gray-text hover:text-sv-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sv-gray-text text-sm mb-1">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sv-gray-text text-sm mb-1">Type</label>
              <select
                required
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
                className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
              >
                {(Object.keys(transactionTypeLabels) as TransactionType[]).map((type) => (
                  <option key={type} value={type}>
                    {transactionTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            {/* Original Amount */}
            <div>
              <label className="block text-sv-gray-text text-sm mb-1">Amount</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.original_amount || ''}
                onChange={(e) => update('original_amount', parseFloat(e.target.value) || 0)}
                className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sv-gray-text text-sm mb-1">Currency</label>
              <select
                value={form.original_currency}
                onChange={(e) => update('original_currency', e.target.value)}
                className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
              >
                <option value="USD">USD</option>
                <option value="MXN">MXN</option>
                <option value="COP">COP</option>
              </select>
            </div>

            {/* Exchange Rate (only if non-USD) */}
            {form.original_currency !== 'USD' && (
              <div>
                <label className="block text-sv-gray-text text-sm mb-1">
                  Exchange Rate (1 USD = ? {form.original_currency})
                </label>
                <input
                  type="number"
                  required
                  min="0.000001"
                  step="0.000001"
                  value={form.exchange_rate || ''}
                  onChange={(e) => update('exchange_rate', parseFloat(e.target.value) || 0)}
                  className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
                />
              </div>
            )}

            {/* USD Amount (readonly when non-USD) */}
            {form.original_currency !== 'USD' && (
              <div>
                <label className="block text-sv-gray-text text-sm mb-1">USD Equivalent</label>
                <input
                  type="number"
                  readOnly
                  value={form.usd_amount}
                  className="w-full bg-sv-black border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-lime focus:outline-none cursor-not-allowed"
                />
              </div>
            )}

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-sv-gray-text text-sm mb-1">Description</label>
              <input
                type="text"
                required
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
                placeholder="e.g., Cloudflare monthly payment"
              />
            </div>

            {/* Clubs - Multi-select with checkboxes (create mode) or single select (edit mode) */}
            <div className="sm:col-span-2">
              <label className="block text-sv-gray-text text-sm mb-1">
                {isEditing ? 'Club' : 'Clubs (select one or more to split proportionally by cameras)'}
              </label>
              {isEditing ? (
                <select
                  value={form.club_id}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((f) => ({ ...f, club_id: val, club_ids: val ? [val] : [] }));
                  }}
                  className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
                >
                  <option value="">N/A</option>
                  {clubs?.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {clubs?.map((club) => {
                    const isSelected = form.club_ids.includes(club.id);
                    return (
                      <button
                        key={club.id}
                        type="button"
                        onClick={() => toggleClub(club.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors text-left ${
                          isSelected
                            ? 'border-sv-lime bg-sv-lime/10 text-sv-lime'
                            : 'border-sv-gray-light bg-sv-gray text-sv-white hover:border-sv-gray-text'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-sv-lime border-sv-lime' : 'border-sv-gray-text'
                          }`}
                        >
                          {isSelected && <Check size={12} className="text-sv-black" />}
                        </div>
                        <span>{club.name}</span>
                        <span className="text-sv-gray-text text-xs ml-auto">
                          {club.number_cameras} cam{club.number_cameras !== 1 ? 's' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Proportional split preview */}
            {!isEditing && selectedClubs.length > 1 && form.usd_amount > 0 && (
              <div className="sm:col-span-2 bg-sv-black/50 border border-sv-gray rounded-lg p-3">
                <p className="text-sv-gray-text text-xs mb-2 font-medium">
                  Proportional split by cameras ({totalCameras} total cameras):
                </p>
                <div className="space-y-1">
                  {selectedClubs.map((club, i) => {
                    const isLast = i === selectedClubs.length - 1;
                    const share = isLast
                      ? Number((form.usd_amount - selectedClubs.slice(0, -1).reduce((s, c) => s + Number((form.usd_amount * c.number_cameras / totalCameras).toFixed(2)), 0)).toFixed(2))
                      : Number((form.usd_amount * club.number_cameras / totalCameras).toFixed(2));
                    const pct = ((club.number_cameras / totalCameras) * 100).toFixed(1);
                    return (
                      <div key={club.id} className="flex justify-between text-sm">
                        <span className="text-sv-white">
                          {club.name}{' '}
                          <span className="text-sv-gray-text text-xs">
                            ({club.number_cameras} cams · {pct}%)
                          </span>
                        </span>
                        <span className="text-sv-lime font-medium">{formatCurrency(share)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Person */}
            <div>
              <label className="block text-sv-gray-text text-sm mb-1">Person</label>
              <select
                value={form.person_id}
                onChange={(e) => update('person_id', e.target.value)}
                className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
              >
                <option value="">N/A</option>
                {people?.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sv-gray-text text-sm mb-1">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => update('category_id', e.target.value)}
                className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
              >
                <option value="">N/A</option>
                {filteredCategories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-sv-gray-text text-sm mb-1">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                rows={2}
                className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50 resize-none"
                placeholder="Additional details..."
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-sv-gray text-sv-white hover:bg-sv-gray-light transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-sv-lime text-sv-black font-semibold hover:bg-sv-lime-dark transition-colors text-sm"
            >
              {isEditing ? 'Update' : selectedClubs.length > 1 ? `Create ${selectedClubs.length} Transactions` : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
