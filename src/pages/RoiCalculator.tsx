import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Download,
  Upload,
  Eraser,
  Camera,
  DollarSign,
  Calendar,
  TrendingUp,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import {
  type CostItem,
  type RoiInputs,
  defaultRoiInputs,
  genId,
  exportRoiPdf,
  parseRoiPdf,
  sanitizeRoiInputs,
} from '../lib/roiPdf';

const STORAGE_KEY = 'sv-roi-calculator';

function loadStoredInputs(): RoiInputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = sanitizeRoiInputs(JSON.parse(raw));
      if (stored) return stored;
    }
  } catch {
    // corrupted storage — start fresh
  }
  return defaultRoiInputs;
}

// ── Editable list component ───────────────────────────────────────────
function EditableList({
  items,
  setItems,
  label,
  costLabel = 'Cost (USD)',
}: {
  items: CostItem[];
  setItems: (items: CostItem[]) => void;
  label: string;
  costLabel?: string;
}) {
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCost, setEditCost] = useState('');

  const add = () => {
    const name = newName.trim();
    const cost = parseFloat(newCost);
    if (!name || isNaN(cost) || cost < 0) return;
    setItems([...items, { id: genId(), name, cost }]);
    setNewName('');
    setNewCost('');
  };

  const remove = (id: string) => setItems(items.filter((i) => i.id !== id));

  const startEdit = (item: CostItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCost(item.cost.toString());
  };

  const saveEdit = () => {
    const name = editName.trim();
    const cost = parseFloat(editCost);
    if (!name || isNaN(cost) || cost < 0) return;
    setItems(items.map((i) => (i.id === editingId ? { ...i, name, cost } : i)));
    setEditingId(null);
  };

  const total = items.reduce((s, i) => s + i.cost, 0);

  return (
    <div>
      <label className="block text-sm font-medium text-sv-gray-text mb-2">{label}</label>

      {/* Items */}
      {items.length > 0 && (
        <div className="space-y-1 mb-2">
          {items.map((item) =>
            editingId === item.id ? (
              <div key={item.id} className="flex gap-2 items-center">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 min-w-0 bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-1.5 text-sm text-sv-white"
                />
                <input
                  type="number"
                  value={editCost}
                  onChange={(e) => setEditCost(e.target.value)}
                  className="w-24 sm:w-28 bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-1.5 text-sm text-sv-white"
                  min="0"
                  step="0.01"
                />
                <button onClick={saveEdit} className="text-sv-lime hover:text-sv-lime-dark p-1">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300 p-1">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div key={item.id} className="flex justify-between items-center bg-sv-gray/50 rounded-lg px-3 py-1.5">
                <span className="text-sm text-sv-white">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-sv-lime font-medium">${item.cost.toFixed(2)}</span>
                  <button onClick={() => startEdit(item)} className="text-sv-gray-text hover:text-sv-white p-1">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ),
          )}
          {items.length > 1 && (
            <div className="flex justify-between items-center px-3 py-1 border-t border-sv-gray">
              <span className="text-xs text-sv-gray-text font-medium">Total</span>
              <span className="text-sm text-sv-lime font-bold">${total.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* Add new row */}
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Item name"
          className="flex-1 min-w-0 bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-1.5 text-sm text-sv-white placeholder-sv-gray-text"
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <input
          type="number"
          value={newCost}
          onChange={(e) => setNewCost(e.target.value)}
          placeholder={costLabel}
          className="w-24 sm:w-28 bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-1.5 text-sm text-sv-white placeholder-sv-gray-text"
          min="0"
          step="0.01"
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button
          onClick={add}
          className="bg-sv-lime/10 text-sv-lime border border-sv-lime/20 rounded-lg px-3 py-1.5 hover:bg-sv-lime/20 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function RoiCalculator() {
  const [inputs, setInputs] = useState<RoiInputs>(loadStoredInputs);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist inputs so a refresh or navigation doesn't lose the calculation
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      // storage unavailable — non-critical
    }
  }, [inputs]);

  const set = <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const clearAll = () => {
    setInputs(defaultRoiInputs);
    setImportError(null);
    setImportNotice(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setConfirmClear(false);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImportError(null);
    setImportNotice(null);
    try {
      const parsed = parseRoiPdf(await file.arrayBuffer());
      if (!parsed) {
        setImportError(
          'Could not read ROI data from this PDF. Make sure it is a ROI report exported from this system.',
        );
        return;
      }
      setInputs(parsed.inputs);
      setImportNotice(
        `Imported "${parsed.inputs.clubName || 'New Club'}"${
          parsed.source === 'legacy' ? ' (older PDF format — please double-check the values)' : ''
        }`,
      );
    } catch {
      setImportError('Failed to read the file. Please try again with a valid PDF.');
    }
  };

  // ── Helpers for date math ─────────────────────────────────────────
  function addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  function formatMonth(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  // ── Calculations ──────────────────────────────────────────────────
  const calc = useMemo(() => {
    const n = inputs.numberOfCameras;

    const totalCameraCost = inputs.cameraCost * n;
    const installationTotal = inputs.installationItems.reduce((s, i) => s + i.cost, 0);
    const initialContributionsTotal = inputs.initialContributions.reduce((s, i) => s + i.cost, 0);

    const totalInitialInvestment = totalCameraCost + inputs.switchCost + inputs.pcCost + installationTotal;
    const netInitialInvestment = totalInitialInvestment - initialContributionsTotal;

    const monthlyCostPerCamera = inputs.monthlyCostItems.reduce((s, i) => s + i.cost, 0);
    const totalMonthlyCost = monthlyCostPerCamera * n;
    const totalMonthlyRevenue = inputs.monthlyRevenuePerCamera * n;
    const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyCost;

    const contractMonths = Math.max(0, inputs.contractMonths);

    // Build cashflow with real calendar days and proration
    type CashflowRow = {
      month: number;
      label: string;
      revenue: number;
      cost: number;
      cumulative: number;
      isGrace: boolean;
      fraction: number;
    };
    const cashflow: CashflowRow[] = [];
    let totalRevenue = 0;
    let totalOperatingCost = 0;
    let graceMonths = 0;
    let billingMonths = 0;

    if (inputs.contractStartDate && contractMonths > 0) {
      const contractStart = new Date(inputs.contractStartDate + 'T00:00:00');
      const contractEnd = addMonths(contractStart, contractMonths);
      const billingStart = inputs.billingStartDate
        ? new Date(inputs.billingStartDate + 'T00:00:00')
        : contractStart;

      // Iterate calendar months from contract start to contract end
      let cursor = new Date(contractStart);
      let cumulative = -netInitialInvestment;
      let monthIndex = 0;

      while (cursor < contractEnd) {
        monthIndex++;
        const year = cursor.getFullYear();
        const month = cursor.getMonth();
        const DAYS_PER_MONTH = 30; // all months treated as 30 days for proration

        // Contract fraction: how many days of this month fall within the contract
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0); // last day of month
        const isFirstMonth = contractStart.getFullYear() === year && contractStart.getMonth() === month;
        const isLastMonth = contractEnd.getFullYear() === year && contractEnd.getMonth() === month;

        let contractDaysInMonth: number;
        if (isFirstMonth && isLastMonth) {
          contractDaysInMonth = contractEnd.getDate() - contractStart.getDate();
        } else if (isFirstMonth) {
          contractDaysInMonth = DAYS_PER_MONTH - contractStart.getDate() + 1;
        } else if (isLastMonth) {
          contractDaysInMonth = contractEnd.getDate() - 1;
        } else {
          contractDaysInMonth = DAYS_PER_MONTH;
        }
        const contractFraction = Math.max(0, Math.min(1, contractDaysInMonth / DAYS_PER_MONTH));

        // Billing fraction: how many days of this month fall within the billing period
        const isBillingFirstMonth = billingStart.getFullYear() === year && billingStart.getMonth() === month;
        let billingDaysInMonth = 0;
        if (billingStart <= monthEnd && contractEnd > monthStart && billingStart < contractEnd) {
          if (isBillingFirstMonth && isLastMonth) {
            billingDaysInMonth = contractEnd.getDate() - billingStart.getDate();
          } else if (isBillingFirstMonth) {
            billingDaysInMonth = DAYS_PER_MONTH - billingStart.getDate() + 1;
          } else if (isLastMonth && billingStart < monthStart) {
            billingDaysInMonth = contractEnd.getDate() - 1;
          } else if (billingStart < monthStart) {
            billingDaysInMonth = DAYS_PER_MONTH;
          }
        }
        const billingFraction = Math.max(0, Math.min(1, billingDaysInMonth / DAYS_PER_MONTH));

        const isGrace = billingFraction === 0;
        const revenue = totalMonthlyRevenue * billingFraction;
        const cost = totalMonthlyCost * contractFraction;
        cumulative += revenue - cost;

        totalRevenue += revenue;
        totalOperatingCost += cost;
        if (isGrace) graceMonths++;
        if (billingFraction > 0) billingMonths++;

        cashflow.push({
          month: monthIndex,
          label: formatMonth(new Date(year, month, 1)),
          revenue,
          cost,
          cumulative,
          isGrace,
          fraction: billingFraction,
        });

        // Move to next month
        cursor = new Date(year, month + 1, 1);
      }
    }

    const totalContractProfit = totalRevenue - totalOperatingCost - netInitialInvestment;

    // ROI: find the month where cumulative crosses zero
    let roiFromContractStart = Infinity;
    let roiMonths = Infinity;
    for (let i = 0; i < cashflow.length; i++) {
      if (cashflow[i].cumulative >= 0) {
        // Interpolate within this month
        const prev = i > 0 ? cashflow[i - 1].cumulative : -netInitialInvestment;
        const delta = cashflow[i].cumulative - prev;
        const fractionInMonth = delta !== 0 ? (-prev) / delta : 0;
        roiFromContractStart = i + fractionInMonth;
        // Count billing months only
        const graceCount = cashflow.slice(0, i).filter((r) => r.isGrace).length;
        roiMonths = roiFromContractStart - graceCount;
        break;
      }
    }

    return {
      totalCameraCost,
      installationTotal,
      initialContributionsTotal,
      totalInitialInvestment,
      netInitialInvestment,
      monthlyCostPerCamera,
      totalMonthlyCost,
      totalMonthlyRevenue,
      monthlyNetProfit,
      contractMonths,
      graceMonths,
      billingMonths,
      roiMonths,
      roiFromContractStart,
      totalRevenue,
      totalOperatingCost,
      totalContractProfit,
      cashflow,
    };
  }, [inputs]);

  const chartData = useMemo(
    () =>
      calc.cashflow.map((cf) => ({
        label: cf.label,
        Cumulative: Number(cf.cumulative.toFixed(2)),
      })),
    [calc.cashflow],
  );

  // ── Helpers ───────────────────────────────────────────────────────
  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const KpiCard = ({ icon: Icon, label, value, sub, accent }: { icon: typeof DollarSign; label: string; value: string; sub?: string; accent?: string }) => (
    <div className="bg-sv-dark border border-sv-gray rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className={accent || 'text-sv-gray-text'} />
        <span className="text-xs text-sv-gray-text font-medium">{label}</span>
      </div>
      <p className={`text-xl font-bold ${accent || 'text-sv-white'}`}>{value}</p>
      {sub && <p className="text-xs text-sv-gray-text mt-0.5">{sub}</p>}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Calculator className="text-sv-lime" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-sv-white">ROI Calculator</h1>
            <p className="text-sv-gray-text text-sm">Estimate return on investment for a new club</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleImportFile}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-sv-dark border border-sv-gray text-sv-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:border-sv-lime hover:text-sv-lime transition-colors"
          >
            <Upload size={16} />
            Import PDF
          </button>
          <button
            onClick={() => setConfirmClear(true)}
            className="flex items-center gap-2 bg-sv-dark border border-sv-gray text-sv-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:border-red-400 hover:text-red-400 transition-colors"
          >
            <Eraser size={16} />
            Clear
          </button>
          <button
            onClick={() => exportRoiPdf(inputs, calc)}
            className="flex items-center gap-2 bg-sv-lime text-sv-black px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-sv-lime-dark transition-colors"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Import feedback */}
      {importError && (
        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2.5 text-sm">
          <span>{importError}</span>
          <button onClick={() => setImportError(null)} className="hover:text-red-300 ml-3">
            <X size={16} />
          </button>
        </div>
      )}
      {importNotice && (
        <div className="flex items-center justify-between bg-sv-lime/10 border border-sv-lime/30 text-sv-lime rounded-lg px-4 py-2.5 text-sm">
          <span>{importNotice}</span>
          <button onClick={() => setImportNotice(null)} className="hover:text-sv-lime-dark ml-3">
            <X size={16} />
          </button>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={DollarSign} label="Net Investment" value={fmt(calc.netInitialInvestment)} accent="text-red-400" />
        <KpiCard icon={TrendingUp} label="Monthly Profit" value={fmt(calc.monthlyNetProfit)} accent={calc.monthlyNetProfit >= 0 ? 'text-sv-lime' : 'text-red-400'} />
        <KpiCard
          icon={Clock}
          label="ROI (from billing)"
          value={calc.roiMonths === Infinity ? 'N/A' : `${calc.roiMonths.toFixed(1)} mo`}
          accent="text-sv-lime"
        />
        <KpiCard
          icon={Clock}
          label="ROI (from contract)"
          value={calc.roiFromContractStart === Infinity ? 'N/A' : `${calc.roiFromContractStart.toFixed(1)} mo`}
          accent="text-amber-400"
        />
        <KpiCard icon={Calendar} label="Contract" value={`${calc.contractMonths} mo`} sub={`${calc.graceMonths} grace, ${calc.billingMonths} billing`} />
        <KpiCard
          icon={DollarSign}
          label="Contract Profit"
          value={fmt(calc.totalContractProfit)}
          accent={calc.totalContractProfit >= 0 ? 'text-sv-lime' : 'text-red-400'}
        />
      </div>

      {/* Main form — 2 column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column — Inputs */}
        <div className="space-y-6">
          {/* Club & Hardware */}
          <section className="bg-sv-dark border border-sv-gray rounded-xl p-5">
            <h2 className="text-sv-white font-semibold text-base mb-4 flex items-center gap-2">
              <Camera size={18} className="text-sv-lime" />
              Club & Hardware
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sv-gray-text mb-1">Club Name</label>
                <input
                  value={inputs.clubName}
                  onChange={(e) => set('clubName', e.target.value)}
                  placeholder="e.g. Prime Padel"
                  className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white placeholder-sv-gray-text"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sv-gray-text mb-1">Camera Cost (USD)</label>
                  <input
                    type="number"
                    value={inputs.cameraCost || ''}
                    onChange={(e) => set('cameraCost', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white placeholder-sv-gray-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sv-gray-text mb-1">Number of Cameras</label>
                  <input
                    type="number"
                    value={inputs.numberOfCameras || ''}
                    onChange={(e) => set('numberOfCameras', parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white placeholder-sv-gray-text"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sv-gray-text mb-1">Switch Cost (USD)</label>
                  <input
                    type="number"
                    value={inputs.switchCost || ''}
                    onChange={(e) => set('switchCost', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white placeholder-sv-gray-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sv-gray-text mb-1">PC / Server Cost (USD)</label>
                  <input
                    type="number"
                    value={inputs.pcCost || ''}
                    onChange={(e) => set('pcCost', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white placeholder-sv-gray-text"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Installation Costs */}
          <section className="bg-sv-dark border border-sv-gray rounded-xl p-5">
            <h2 className="text-sv-white font-semibold text-base mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-sv-lime" />
              Installation Costs
            </h2>
            <EditableList
              items={inputs.installationItems}
              setItems={(items) => set('installationItems', items)}
              label="Add installation cost items (labor, cables, etc.)"
            />
          </section>

          {/* Initial Contributions from Club */}
          <section className="bg-sv-dark border border-sv-gray rounded-xl p-5">
            <h2 className="text-sv-white font-semibold text-base mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-green-400" />
              Initial Club Contributions
            </h2>
            <EditableList
              items={inputs.initialContributions}
              setItems={(items) => set('initialContributions', items)}
              label="Add initial club contributions (installation fee, initial payment, etc.)"
            />
          </section>
        </div>

        {/* Right Column — Dates, Monthly, Cashflow */}
        <div className="space-y-6">
          {/* Contract Dates */}
          <section className="bg-sv-dark border border-sv-gray rounded-xl p-5">
            <h2 className="text-sv-white font-semibold text-base mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-sv-lime" />
              Contract Dates
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-sv-gray-text mb-1">Contract Start</label>
                <input
                  type="date"
                  value={inputs.contractStartDate}
                  onChange={(e) => set('contractStartDate', e.target.value)}
                  className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sv-gray-text mb-1">Billing Start</label>
                <input
                  type="date"
                  value={inputs.billingStartDate}
                  onChange={(e) => set('billingStartDate', e.target.value)}
                  className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sv-gray-text mb-1">Contract Months</label>
                <input
                  type="number"
                  value={inputs.contractMonths || ''}
                  onChange={(e) => set('contractMonths', parseInt(e.target.value) || 0)}
                  placeholder="e.g. 24"
                  min="0"
                  className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white placeholder-sv-gray-text"
                />
              </div>
            </div>
          </section>

          {/* Monthly Costs */}
          <section className="bg-sv-dark border border-sv-gray rounded-xl p-5">
            <h2 className="text-sv-white font-semibold text-base mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-red-400" />
              Monthly Costs per Camera
            </h2>
            <EditableList
              items={inputs.monthlyCostItems}
              setItems={(items) => set('monthlyCostItems', items)}
              label="Add monthly cost items per camera (Cloudflare, AWS, etc.)"
              costLabel="$/cam"
            />
            {inputs.monthlyCostItems.length > 0 && (
              <p className="text-xs text-sv-gray-text mt-2">
                Total for {inputs.numberOfCameras} cameras: <span className="text-red-400 font-medium">{fmt(calc.totalMonthlyCost)}/mo</span>
              </p>
            )}
          </section>

          {/* Monthly Revenue */}
          <section className="bg-sv-dark border border-sv-gray rounded-xl p-5">
            <h2 className="text-sv-white font-semibold text-base mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-sv-lime" />
              Monthly Revenue
            </h2>
            <div>
              <label className="block text-sm font-medium text-sv-gray-text mb-1">Revenue per Camera (USD/mo)</label>
              <input
                type="number"
                value={inputs.monthlyRevenuePerCamera || ''}
                onChange={(e) => set('monthlyRevenuePerCamera', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white placeholder-sv-gray-text"
              />
            </div>
            <p className="text-xs text-sv-gray-text mt-2">
              Total for {inputs.numberOfCameras} cameras: <span className="text-sv-lime font-medium">{fmt(calc.totalMonthlyRevenue)}/mo</span>
            </p>
          </section>

          {/* Cumulative Cashflow Chart */}
          {calc.cashflow.length > 0 && (
            <section className="bg-sv-dark border border-sv-gray rounded-xl p-5">
              <h2 className="text-sv-white font-semibold text-base mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-sv-lime" />
                Break-even Curve
              </h2>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="roiCumulative" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#AAFF00" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#AAFF00" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                    <XAxis dataKey="label" tick={{ fill: '#9CA3AF', fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #2A2A2A',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                      formatter={(value) => [fmt(Number(value)), 'Cumulative']}
                    />
                    <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="4 4" />
                    <Area
                      type="monotone"
                      dataKey="Cumulative"
                      stroke="#AAFF00"
                      strokeWidth={2}
                      fill="url(#roiCumulative)"
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {calc.roiFromContractStart !== Infinity && (
                <p className="text-xs text-sv-gray-text mt-2">
                  Break-even reached in month {Math.ceil(calc.roiFromContractStart)} (
                  {calc.cashflow[Math.min(calc.cashflow.length - 1, Math.max(0, Math.ceil(calc.roiFromContractStart) - 1))]?.label})
                </p>
              )}
            </section>
          )}

          {/* Cashflow Table */}
          {calc.cashflow.length > 0 && (
            <section className="bg-sv-dark border border-sv-gray rounded-xl p-5">
              <h2 className="text-sv-white font-semibold text-base mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-sv-lime" />
                Monthly Cashflow Projection
              </h2>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-sv-dark">
                    <tr className="text-sv-gray-text text-xs border-b border-sv-gray">
                      <th className="text-left py-2 px-2">Month</th>
                      <th className="text-right py-2 px-2">Revenue</th>
                      <th className="text-right py-2 px-2">Cost</th>
                      <th className="text-right py-2 px-2">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.cashflow.map((cf) => (
                      <tr
                        key={cf.month}
                        className={`border-b border-sv-gray/50 ${cf.month === Math.ceil(calc.roiFromContractStart) ? 'bg-sv-lime/10' : ''}`}
                      >
                        <td className="py-1.5 px-2 text-sv-white">
                          {cf.label}
                          {cf.isGrace && (
                            <span className="ml-1 text-xs text-amber-400">(grace)</span>
                          )}
                          {cf.fraction > 0 && cf.fraction < 1 && (
                            <span className="ml-1 text-xs text-blue-400">({Math.round(cf.fraction * 100)}%)</span>
                          )}
                        </td>
                        <td className="py-1.5 px-2 text-right text-sv-lime">{fmt(cf.revenue)}</td>
                        <td className="py-1.5 px-2 text-right text-red-400">{fmt(cf.cost)}</td>
                        <td className={`py-1.5 px-2 text-right font-medium ${cf.cumulative >= 0 ? 'text-sv-lime' : 'text-red-400'}`}>
                          {fmt(cf.cumulative)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Clear confirmation */}
      <ConfirmDialog
        open={confirmClear}
        title="Clear all fields"
        message="This will reset every field in the ROI calculator. This cannot be undone."
        confirmLabel="Clear"
        onConfirm={clearAll}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
