import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Tags,
  Users,
  SlidersHorizontal,
  Plus,
  Pencil,
  Trash2,
  X,
  Camera,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Club, Category, Person } from '../types';
import { useClubs, useCreateClub, useUpdateClub, useDeleteClub, type ClubFormData } from '../hooks/useClubs';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type CategoryFormData,
} from '../hooks/useCategories';
import { usePeople, useCreatePerson, useUpdatePerson, useDeletePerson, type PersonFormData } from '../hooks/usePeople';
import { useTransactions } from '../hooks/useTransactions';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { transactionTypeLabels, transactionTypeColors } from '../lib/formatters';
import type { TransactionType } from '../types';

type Tab = 'clubs' | 'categories' | 'people' | 'system';

const inputClass =
  'w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white placeholder-sv-gray-text focus:outline-none focus:border-sv-lime/50';

function errorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code === '23505') return 'That name already exists.';
  return (err as { message?: string })?.message || 'Something went wrong.';
}

// ── Shared modal shell ────────────────────────────────────────────────
function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-sv-dark border border-sv-gray rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-sv-gray">
          <h2 className="text-sv-white font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="text-sv-gray-text hover:text-sv-white">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ saving, isEditing, onCancel }: { saving: boolean; isEditing: boolean; onCancel: () => void }) {
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
        {saving ? 'Saving…' : isEditing ? 'Update' : 'Create'}
      </button>
    </div>
  );
}

// ── Club form modal ───────────────────────────────────────────────────
const emptyClubForm: ClubFormData = { name: '', country: '', city: '', status: 'active', number_cameras: 1 };

function ClubFormModal({
  open,
  club,
  onClose,
}: {
  open: boolean;
  club: Club | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ClubFormData>(emptyClubForm);
  const createMutation = useCreateClub();
  const updateMutation = useUpdateClub();
  const saving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (club) {
      setForm({
        name: club.name,
        country: club.country || '',
        city: club.city || '',
        status: club.status,
        number_cameras: club.number_cameras,
      });
    } else {
      setForm(emptyClubForm);
    }
  }, [club, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (club) {
        await updateMutation.mutateAsync({ id: club.id, data: form });
        toast.success('Club updated');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Club created — it is now available in transactions, filters and charts');
      }
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <ModalShell title={club ? 'Edit Club' : 'Add Club'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="block text-sv-gray-text text-sm mb-1">Club Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Padel Arena Medellín"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sv-gray-text text-sm mb-1">City</label>
            <input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="e.g. Cali"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sv-gray-text text-sm mb-1">Country</label>
            <input
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              placeholder="e.g. Colombia"
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sv-gray-text text-sm mb-1"># Cameras</label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={form.number_cameras}
              onChange={(e) => setForm((f) => ({ ...f, number_cameras: Math.max(0, parseInt(e.target.value) || 0) }))}
              className={inputClass}
            />
            <p className="text-sv-gray-text text-xs mt-1">Used for proportional splits in multi-club transactions</p>
          </div>
          <div>
            <label className="block text-sv-gray-text text-sm mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ClubFormData['status'] }))}
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <ModalActions saving={saving} isEditing={!!club} onCancel={onClose} />
      </form>
    </ModalShell>
  );
}

// ── Category form modal ───────────────────────────────────────────────
const emptyCategoryForm: CategoryFormData = { name: '', type: 'expense' };

function CategoryFormModal({
  open,
  category,
  onClose,
}: {
  open: boolean;
  category: Category | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CategoryFormData>(emptyCategoryForm);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const saving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    setForm(category ? { name: category.name, type: category.type } : emptyCategoryForm);
  }, [category, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (category) {
        await updateMutation.mutateAsync({ id: category.id, data: form });
        toast.success('Category updated');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Category created');
      }
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <ModalShell title={category ? 'Edit Category' : 'Add Category'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="block text-sv-gray-text text-sm mb-1">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Marketing"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sv-gray-text text-sm mb-1">Applies to</label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CategoryFormData['type'] }))}
            className={inputClass}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="both">Both</option>
          </select>
          <p className="text-sv-gray-text text-xs mt-1">Controls in which transaction types this category is offered</p>
        </div>
        <ModalActions saving={saving} isEditing={!!category} onCancel={onClose} />
      </form>
    </ModalShell>
  );
}

// ── Person form modal ─────────────────────────────────────────────────
const emptyPersonForm: PersonFormData = { name: '', role: 'collaborator' };

const roleLabels: Record<Person['role'], string> = {
  founder: 'Founder',
  investor: 'Investor',
  collaborator: 'Collaborator',
  company: 'Company',
};

const roleBadges: Record<Person['role'], string> = {
  founder: 'bg-sv-lime/10 text-sv-lime',
  investor: 'bg-blue-500/10 text-blue-400',
  collaborator: 'bg-amber-500/10 text-amber-400',
  company: 'bg-purple-500/10 text-purple-400',
};

function PersonFormModal({
  open,
  person,
  onClose,
}: {
  open: boolean;
  person: Person | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PersonFormData>(emptyPersonForm);
  const createMutation = useCreatePerson();
  const updateMutation = useUpdatePerson();
  const saving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    setForm(person ? { name: person.name, role: person.role } : emptyPersonForm);
  }, [person, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (person) {
        await updateMutation.mutateAsync({ id: person.id, data: form });
        toast.success('Person updated');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Person created');
      }
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <ModalShell title={person ? 'Edit Person' : 'Add Person'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="block text-sv-gray-text text-sm mb-1">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Juan Pérez"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sv-gray-text text-sm mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Person['role'] }))}
            className={inputClass}
          >
            <option value="founder">Founder</option>
            <option value="investor">Investor</option>
            <option value="collaborator">Collaborator</option>
            <option value="company">Company</option>
          </select>
          <p className="text-sv-gray-text text-xs mt-1">
            Company expenses affect the cash balance; personal expenses affect profit only
          </p>
        </div>
        <ModalActions saving={saving} isEditing={!!person} onCancel={onClose} />
      </form>
    </ModalShell>
  );
}

// ── System info tab ───────────────────────────────────────────────────
const typeBehavior: Record<TransactionType, string> = {
  expense: 'Affects profit. Affects cash only when the person is the company (Smash Vision).',
  income: 'Affects both cash and profit.',
  withdrawal: 'Cash only — profit distribution to a person, not a loss.',
  reimbursement: 'Cash only — pays back a personal expense already counted.',
  gap_contribution: 'Cash only — capital injection, not income.',
};

function SystemTab() {
  return (
    <div className="space-y-6">
      <div className="bg-sv-dark border border-sv-gray rounded-xl p-5">
        <h3 className="text-sv-white font-semibold mb-1">Transaction Types</h3>
        <p className="text-sv-gray-text text-xs mb-4">
          Fixed by the system's financial logic and database schema — changing them requires a code and database
          migration.
        </p>
        <div className="space-y-3">
          {(Object.keys(transactionTypeLabels) as TransactionType[]).map((type) => (
            <div key={type} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-medium w-fit shrink-0 sm:w-36"
                style={{ backgroundColor: transactionTypeColors[type] + '20', color: transactionTypeColors[type] }}
              >
                {transactionTypeLabels[type]}
              </span>
              <span className="text-sv-gray-text text-sm">{typeBehavior[type]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-sv-dark border border-sv-gray rounded-xl p-5">
        <h3 className="text-sv-white font-semibold mb-1">Currencies</h3>
        <p className="text-sv-gray-text text-xs mb-4">
          Every transaction stores the original amount, its exchange rate and the USD equivalent. USD is the base
          currency for all reports.
        </p>
        <div className="flex flex-wrap gap-2">
          {(['USD', 'MXN', 'COP'] as const).map((c) => (
            <span key={c} className="px-3 py-1 rounded-full bg-sv-gray text-sv-white text-sm font-medium">
              {c}
              {c === 'USD' && <span className="text-sv-lime text-xs ml-1.5">base</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function Settings() {
  const [tab, setTab] = useState<Tab>('clubs');

  const { data: clubs, isLoading: clubsLoading } = useClubs();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: people, isLoading: peopleLoading } = usePeople();
  const { data: transactions } = useTransactions();

  const [clubModal, setClubModal] = useState<{ open: boolean; club: Club | null }>({ open: false, club: null });
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  });
  const [personModal, setPersonModal] = useState<{ open: boolean; person: Person | null }>({
    open: false,
    person: null,
  });

  const [deletingClub, setDeletingClub] = useState<Club | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);

  const deleteClubMutation = useDeleteClub();
  const deleteCategoryMutation = useDeleteCategory();
  const deletePersonMutation = useDeletePerson();

  const txCount = (field: 'club_id' | 'category_id' | 'person_id', id: string) =>
    (transactions || []).filter((t) => t[field] === id).length;

  const handleDelete = async (
    mutation: { mutateAsync: (id: string) => Promise<void> },
    id: string,
    label: string,
    close: () => void,
  ) => {
    try {
      await mutation.mutateAsync(id);
      toast.success(`${label} deleted`);
      close();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const tabs: { key: Tab; label: string; icon: typeof Building2; count?: number }[] = [
    { key: 'clubs', label: 'Clubs', icon: Building2, count: clubs?.length },
    { key: 'categories', label: 'Categories', icon: Tags, count: categories?.length },
    { key: 'people', label: 'People', icon: Users, count: people?.length },
    { key: 'system', label: 'System', icon: SlidersHorizontal },
  ];

  const loading = clubsLoading || categoriesLoading || peopleLoading;

  const addButton = (label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-sv-lime text-sv-black rounded-lg font-semibold text-sm hover:bg-sv-lime-dark transition-colors shrink-0"
    >
      <Plus size={16} />
      {label}
    </button>
  );

  const rowActions = (onEdit: () => void, onDelete: () => void) => (
    <div className="flex gap-1 shrink-0">
      <button
        onClick={onEdit}
        className="p-2 rounded-lg text-sv-gray-text hover:text-sv-lime hover:bg-sv-gray transition-colors"
        title="Edit"
      >
        <Pencil size={15} />
      </button>
      <button
        onClick={onDelete}
        className="p-2 rounded-lg text-sv-gray-text hover:text-red-400 hover:bg-sv-gray transition-colors"
        title="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="text-sv-lime" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-sv-white">Settings</h1>
          <p className="text-sv-gray-text text-sm">Manage clubs, categories, people and system options</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              tab === key
                ? 'bg-sv-lime/10 text-sv-lime border-sv-lime/30'
                : 'bg-sv-dark text-sv-gray-text border-sv-gray hover:text-sv-white'
            }`}
          >
            <Icon size={16} />
            {label}
            {count !== undefined && (
              <span className={`text-xs ${tab === key ? 'text-sv-lime/70' : 'text-sv-gray-text'}`}>{count}</span>
            )}
          </button>
        ))}
      </div>

      {loading && tab !== 'system' ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-sv-lime border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* ── Clubs ── */}
          {tab === 'clubs' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sv-gray-text text-sm">
                  New clubs are immediately available when adding transactions, in filters, charts and camera-based
                  splits.
                </p>
                {addButton('Add Club', () => setClubModal({ open: true, club: null }))}
              </div>
              <div className="space-y-2">
                {clubs?.map((club) => (
                  <div
                    key={club.id}
                    className="bg-sv-dark border border-sv-gray rounded-xl p-4 flex flex-wrap items-center gap-3"
                  >
                    <div className="p-2 bg-sv-lime/10 rounded-lg shrink-0">
                      <Building2 className="text-sv-lime" size={18} />
                    </div>
                    <div className="flex-1 min-w-[9rem]">
                      <p className="text-sv-white font-semibold truncate">{club.name}</p>
                      <p className="text-sv-gray-text text-xs flex items-center gap-1">
                        <MapPin size={11} className="shrink-0" />
                        {[club.city, club.country].filter(Boolean).join(', ') || 'No location'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-sv-gray text-sv-white text-xs">
                        <Camera size={11} />
                        {club.number_cameras} cam{club.number_cameras !== 1 ? 's' : ''}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          club.status === 'active' ? 'bg-sv-lime/10 text-sv-lime' : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {club.status}
                      </span>
                      <span className="text-sv-gray-text text-xs hidden sm:inline">
                        {txCount('club_id', club.id)} tx
                      </span>
                    </div>
                    {rowActions(
                      () => setClubModal({ open: true, club }),
                      () => setDeletingClub(club),
                    )}
                  </div>
                ))}
                {clubs?.length === 0 && (
                  <p className="text-sv-gray-text text-sm text-center py-8">No clubs yet — add your first one</p>
                )}
              </div>
            </div>
          )}

          {/* ── Categories ── */}
          {tab === 'categories' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sv-gray-text text-sm">
                  Categories are offered in the transaction form according to their type.
                </p>
                {addButton('Add Category', () => setCategoryModal({ open: true, category: null }))}
              </div>
              <div className="space-y-2">
                {categories?.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-sv-dark border border-sv-gray rounded-xl px-4 py-3 flex flex-wrap items-center gap-3"
                  >
                    <span className="text-sv-white font-medium flex-1 min-w-[8rem] truncate">{cat.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        cat.type === 'expense'
                          ? 'bg-red-500/10 text-red-400'
                          : cat.type === 'income'
                            ? 'bg-sv-lime/10 text-sv-lime'
                            : 'bg-blue-500/10 text-blue-400'
                      }`}
                    >
                      {cat.type}
                    </span>
                    <span className="text-sv-gray-text text-xs hidden sm:inline">
                      {txCount('category_id', cat.id)} tx
                    </span>
                    {rowActions(
                      () => setCategoryModal({ open: true, category: cat }),
                      () => setDeletingCategory(cat),
                    )}
                  </div>
                ))}
                {categories?.length === 0 && (
                  <p className="text-sv-gray-text text-sm text-center py-8">No categories yet</p>
                )}
              </div>
            </div>
          )}

          {/* ── People ── */}
          {tab === 'people' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sv-gray-text text-sm">
                  People can be linked to transactions as payer, receiver or contributor.
                </p>
                {addButton('Add Person', () => setPersonModal({ open: true, person: null }))}
              </div>
              <div className="space-y-2">
                {people?.map((person) => (
                  <div
                    key={person.id}
                    className="bg-sv-dark border border-sv-gray rounded-xl px-4 py-3 flex flex-wrap items-center gap-3"
                  >
                    <span className="text-sv-white font-medium flex-1 min-w-[8rem] truncate">{person.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleBadges[person.role]}`}>
                      {roleLabels[person.role]}
                    </span>
                    <span className="text-sv-gray-text text-xs hidden sm:inline">
                      {txCount('person_id', person.id)} tx
                    </span>
                    {rowActions(
                      () => setPersonModal({ open: true, person }),
                      () => setDeletingPerson(person),
                    )}
                  </div>
                ))}
                {people?.length === 0 && <p className="text-sv-gray-text text-sm text-center py-8">No people yet</p>}
              </div>
            </div>
          )}

          {/* ── System ── */}
          {tab === 'system' && <SystemTab />}
        </>
      )}

      {/* Modals */}
      <ClubFormModal
        open={clubModal.open}
        club={clubModal.club}
        onClose={() => setClubModal({ open: false, club: null })}
      />
      <CategoryFormModal
        open={categoryModal.open}
        category={categoryModal.category}
        onClose={() => setCategoryModal({ open: false, category: null })}
      />
      <PersonFormModal
        open={personModal.open}
        person={personModal.person}
        onClose={() => setPersonModal({ open: false, person: null })}
      />

      {/* Delete confirmations */}
      <ConfirmDialog
        open={!!deletingClub}
        title="Delete Club"
        message={
          deletingClub
            ? `Delete "${deletingClub.name}"? ${
                txCount('club_id', deletingClub.id) > 0
                  ? `${txCount('club_id', deletingClub.id)} transactions reference this club — they will be kept but left without a club. If the club just stopped operating, set it to "inactive" instead.`
                  : 'No transactions reference this club.'
              }`
            : ''
        }
        onConfirm={() =>
          deletingClub &&
          handleDelete(deleteClubMutation, deletingClub.id, 'Club', () => setDeletingClub(null))
        }
        onCancel={() => setDeletingClub(null)}
      />
      <ConfirmDialog
        open={!!deletingCategory}
        title="Delete Category"
        message={
          deletingCategory
            ? `Delete "${deletingCategory.name}"? ${
                txCount('category_id', deletingCategory.id) > 0
                  ? `${txCount('category_id', deletingCategory.id)} transactions use this category — they will be kept but left uncategorized.`
                  : 'No transactions use this category.'
              }`
            : ''
        }
        onConfirm={() =>
          deletingCategory &&
          handleDelete(deleteCategoryMutation, deletingCategory.id, 'Category', () => setDeletingCategory(null))
        }
        onCancel={() => setDeletingCategory(null)}
      />
      <ConfirmDialog
        open={!!deletingPerson}
        title="Delete Person"
        message={
          deletingPerson
            ? `Delete "${deletingPerson.name}"? ${
                txCount('person_id', deletingPerson.id) > 0
                  ? `${txCount('person_id', deletingPerson.id)} transactions reference this person — they will be kept but left without a person. Note: this can change the cash balance if the person had the "company" role.`
                  : 'No transactions reference this person.'
              }`
            : ''
        }
        onConfirm={() =>
          deletingPerson &&
          handleDelete(deletePersonMutation, deletingPerson.id, 'Person', () => setDeletingPerson(null))
        }
        onCancel={() => setDeletingPerson(null)}
      />
    </div>
  );
}
