import { Search, X } from 'lucide-react';
import type { TransactionFilters as TFilters, TransactionType } from '../../types';
import { useClubs } from '../../hooks/useClubs';
import { usePeople } from '../../hooks/usePeople';
import { useCategories } from '../../hooks/useCategories';
import { transactionTypeLabels } from '../../lib/formatters';

interface TransactionFiltersProps {
  filters: TFilters;
  onChange: (filters: TFilters) => void;
}

export default function TransactionFiltersComponent({ filters, onChange }: TransactionFiltersProps) {
  const { data: clubs } = useClubs();
  const { data: people } = usePeople();
  const { data: categories } = useCategories();

  const update = (key: keyof TFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onChange({
      type: '',
      club_id: '',
      person_id: '',
      category_id: '',
      date_from: '',
      date_to: '',
      search: '',
    });
  };

  const hasFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="bg-sv-dark rounded-xl border border-sv-gray p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sv-white font-semibold text-sm">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-sv-gray-text hover:text-sv-lime text-xs flex items-center gap-1"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {/* Search */}
        <div className="relative xl:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sv-gray-text" size={14} />
          <input
            type="text"
            placeholder="Search description..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full bg-sv-gray border border-sv-gray-light rounded-lg pl-9 pr-3 py-2 text-sm text-sv-white placeholder-sv-gray-text focus:outline-none focus:border-sv-lime/50"
          />
        </div>

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

        {/* Category */}
        <select
          value={filters.category_id}
          onChange={(e) => update('category_id', e.target.value)}
          className="bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.type})
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
