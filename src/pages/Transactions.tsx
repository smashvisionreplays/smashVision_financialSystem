import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '../hooks/useTransactions';
import TransactionFiltersComponent from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionModal from '../components/transactions/TransactionModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import type { Transaction, TransactionFormData, TransactionFilters } from '../types';

export default function Transactions() {
  const [filters, setFilters] = useState<TransactionFilters>({
    type: '',
    club_id: '',
    person_id: '',
    category_id: '',
    date_from: '',
    date_to: '',
    search: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const { data: transactions, isLoading } = useTransactions(filters);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setModalOpen(true);
  };

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data });
        toast.success('Transaction updated');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Transaction created');
      }
      setModalOpen(false);
      setEditing(null);
    } catch {
      toast.error('Failed to save transaction');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success('Transaction deleted');
      setDeleting(null);
    } catch {
      toast.error('Failed to delete transaction');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sv-white">Transactions</h1>
          <p className="text-sv-gray-text text-sm mt-1">
            {transactions?.length || 0} total transactions
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-sv-lime text-sv-black rounded-lg font-semibold text-sm hover:bg-sv-lime-dark transition-colors"
        >
          <Plus size={16} />
          Add Transaction
        </button>
      </div>

      <TransactionFiltersComponent filters={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-sv-lime border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <TransactionTable
          transactions={transactions || []}
          onEdit={handleEdit}
          onDelete={setDeleting}
        />
      )}

      <TransactionModal
        open={modalOpen}
        transaction={editing}
        onSubmit={handleSubmit}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deleting?.description}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
