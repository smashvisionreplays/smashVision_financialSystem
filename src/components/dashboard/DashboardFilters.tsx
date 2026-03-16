import { X, Filter } from 'lucide-react';
import type { TransactionFilters, TransactionType } from '../../types';
import { useClubs } from '../../hooks/useClubs';
import { useCategories } from '../../hooks/useCategories';
import { usePeople } from '../../hooks/usePeople';
import { transactionTypeLabels } from '../../lib/formatters';

interface DashboardFiltersProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

const YEARS = ['2026', '2025', '2024'];

const emptyFilters: TransactionFilters = {
  type: '',
  club_id: '',
  person_id: '',
  category_id: '',
  date_from: '',
  date_to: '',
  search: '',
};

export default function DashboardFilters({ filters, onChange }: DashboardFiltersProps) {
  const { data: clubs } = useClubs();
  const { data: categories } = useCategories();
  const { data: people } = usePeople();

  const update = (key: keyof TransactionFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAll = () => onChange({ ...emptyFilters });

  const hasFilters = Object.values(filters).some((v) => v !== '');

  // Detect if filters match a year shortcut
  const activeYear = YEARS.find(
    (y) =>
      filters.date_from === `${y}-01-01` &&
      filters.date_to === `${y}-12-31` &&
      !filters.type &&
      !filters.club_id &&
      !filters.person_id &&
      !filters.category_id
  );

  const selectYear = (y: string) => {
    if (activeYear === y) {
      clearAll();
    } else {
      onChange({ ...emptyFilters, date_from: `${y}-01-01`, date_to: `${y}-12-31` });
    }
  };

  return (
    <div className="bg-sv-dark rounded-xl border border-sv-gray p-4 space-y-3">
      {/* Header row: title + year pills + clear */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sv-gray-text">
            <Filter size={14} />
            <span className="text-xs font-medium uppercase tracking-wide">Filters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={clearAll}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !hasFilters
                  ? 'bg-sv-lime/20 text-sv-lime'
                  : 'bg-sv-gray border border-sv-gray-light text-sv-gray-text hover:text-sv-white'
              }`}
            >
              All Time
            </button>
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => selectYear(y)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeYear === y
                    ? 'bg-sv-lime/20 text-sv-lime'
                    : 'bg-sv-gray border border-sv-gray-light text-sv-gray-text hover:text-sv-white'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-sv-gray-text hover:text-sv-lime text-xs flex items-center gap-1"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Filter dropdowns and date range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Type */}
        <select
          value={filters.type}
          onChange={(e) => update('type', e.target.value)}
          className="bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
        >
          <option value="">All Types</option>
          {(Object.keys(transactionTypeLabels) as TransactionType[]).map((type) => (
            <option key={type} value={type}>
              {transactionTypeLabels[type]}
            </option>
          ))}
        </select>

        {/* Club */}
        <select
          value={filters.club_id}
          onChange={(e) => update('club_id', e.target.value)}
          className="bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
        >
          <option value="">All Clubs</option>
          {clubs?.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          value={filters.category_id}
          onChange={(e) => update('category_id', e.target.value)}
          className="bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Person */}
        <select
          value={filters.person_id}
          onChange={(e) => update('person_id', e.target.value)}
          className="bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
        >
          <option value="">All People</option>
          {people?.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        {/* Date From */}
        <input
          type="date"
          value={filters.date_from}
          onChange={(e) => update('date_from', e.target.value)}
          className="bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
          placeholder="From"
        />

        {/* Date To */}
        <input
          type="date"
          value={filters.date_to}
          onChange={(e) => update('date_to', e.target.value)}
          className="bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
          placeholder="To"
        />
      </div>
    </div>
  );
}
