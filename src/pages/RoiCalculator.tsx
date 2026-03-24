import { useState, useMemo } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Download,
  Camera,
  DollarSign,
  Calendar,
  TrendingUp,
  Clock,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CostItem {
  id: string;
  name: string;
  cost: number;
}

interface RoiInputs {
  clubName: string;
  cameraCost: number;
  numberOfCameras: number;
  switchCost: number;
  pcCost: number;
  installationItems: CostItem[];
  contractStartDate: string;
  billingStartDate: string;
  contractMonths: number;
  monthlyCostItems: CostItem[];
  monthlyRevenuePerCamera: number;
  initialContributions: CostItem[];
}

const defaultInputs: RoiInputs = {
  clubName: '',
  cameraCost: 0,
  numberOfCameras: 1,
  switchCost: 0,
  pcCost: 0,
  installationItems: [],
  contractStartDate: '',
  billingStartDate: '',
  contractMonths: 0,
  monthlyCostItems: [],
  monthlyRevenuePerCamera: 0,
  initialContributions: [],
};

function genId() {
  return Math.random().toString(36).slice(2, 9);
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
                  className="flex-1 bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-1.5 text-sm text-sv-white"
                />
                <input
                  type="number"
                  value={editCost}
                  onChange={(e) => setEditCost(e.target.value)}
                  className="w-28 bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-1.5 text-sm text-sv-white"
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
          className="flex-1 bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-1.5 text-sm text-sv-white placeholder-sv-gray-text"
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <input
          type="number"
          value={newCost}
          onChange={(e) => setNewCost(e.target.value)}
          placeholder={costLabel}
          className="w-28 bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-1.5 text-sm text-sv-white placeholder-sv-gray-text"
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
  const [inputs, setInputs] = useState<RoiInputs>(defaultInputs);

  const set = <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

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

    // Contract months
    const contractMonths = Math.max(0, inputs.contractMonths);
    let graceMonths = 0;
    if (inputs.contractStartDate && inputs.billingStartDate) {
      const start = new Date(inputs.contractStartDate + 'T00:00:00');
      const billing = new Date(inputs.billingStartDate + 'T00:00:00');
      graceMonths = Math.max(
        0,
        (billing.getFullYear() - start.getFullYear()) * 12 + (billing.getMonth() - start.getMonth()),
      );
    }
    const billingMonths = Math.max(0, contractMonths - graceMonths);

    // ROI in months — how many billing months needed to recover net investment
    // During grace months we pay costs but earn no revenue
    const gracePeriodCost = totalMonthlyCost * graceMonths;
    const totalToRecover = netInitialInvestment + gracePeriodCost;
    const roiMonths = monthlyNetProfit > 0 ? totalToRecover / monthlyNetProfit : Infinity;
    const roiFromContractStart = roiMonths + graceMonths;

    // Total contract profit
    const totalRevenue = totalMonthlyRevenue * billingMonths;
    const totalOperatingCost = totalMonthlyCost * contractMonths;
    const totalContractProfit = totalRevenue - totalOperatingCost - netInitialInvestment;

    // Monthly cashflow table
    const cashflow: { month: number; label: string; revenue: number; cost: number; cumulative: number }[] = [];
    let cumulative = -netInitialInvestment;
    for (let m = 1; m <= contractMonths; m++) {
      const isBilling = m > graceMonths;
      const revenue = isBilling ? totalMonthlyRevenue : 0;
      const cost = totalMonthlyCost;
      cumulative += revenue - cost;
      cashflow.push({ month: m, label: `Month ${m}`, revenue, cost, cumulative });
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

  // ── PDF export ────────────────────────────────────────────────────
  const exportPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Load logo
    let logoData: string | null = null;
    try {
      const response = await fetch('/logo.png');
      const blob = await response.blob();
      logoData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch {
      // continue without logo
    }

    // Header
    let y = 15;
    if (logoData) {
      doc.addImage(logoData, 'PNG', margin, y, 18, 18);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Smash Vision', margin + 22, y + 8);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Financial System — ROI Report', margin + 22, y + 14);
    } else {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Smash Vision', margin, y + 8);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Financial System — ROI Report', margin, y + 14);
    }

    // Date
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(9);
    doc.text(today, pageWidth - margin, y + 8, { align: 'right' });

    // Line
    y += 22;
    doc.setDrawColor(170, 255, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Club name
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(inputs.clubName || 'New Club', margin, y);
    y += 4;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${inputs.numberOfCameras} cameras  |  ${inputs.contractMonths} months contract  |  Start: ${inputs.contractStartDate || '—'}  |  Billing starts: ${inputs.billingStartDate || '—'}`,
      margin,
      y + 4,
    );
    y += 12;

    // ── Section: Initial Investment ──
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Initial Investment', margin, y);
    y += 2;

    const investmentRows: string[][] = [
      ['Cameras', `${inputs.numberOfCameras} × $${inputs.cameraCost.toFixed(2)}`, `$${calc.totalCameraCost.toFixed(2)}`],
      ['Network Switch', '', `$${inputs.switchCost.toFixed(2)}`],
      ['PC / Server', '', `$${inputs.pcCost.toFixed(2)}`],
    ];
    inputs.installationItems.forEach((item) => {
      investmentRows.push([`Installation: ${item.name}`, '', `$${item.cost.toFixed(2)}`]);
    });
    investmentRows.push(['', '', '']);
    investmentRows.push(['Total Initial Investment', '', `$${calc.totalInitialInvestment.toFixed(2)}`]);
    inputs.initialContributions.forEach((item) => {
      investmentRows.push([`Club Contribution: ${item.name}`, '', `-$${item.cost.toFixed(2)}`]);
    });
    investmentRows.push(['Net Initial Investment', '', `$${calc.netInitialInvestment.toFixed(2)}`]);

    autoTable(doc, {
      startY: y,
      head: [['Item', 'Detail', 'Amount']],
      body: investmentRows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 30, 30], textColor: [170, 255, 0] },
      columnStyles: { 2: { halign: 'right' } },
      margin: { left: margin, right: margin },
    });
    y = (doc as unknown as Record<string, number>).lastAutoTable.finalY + 8;

    // ── Section: Monthly Breakdown ──
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Monthly Breakdown (per camera × ' + inputs.numberOfCameras + ')', margin, y);
    y += 2;

    const monthlyRows: string[][] = [];
    inputs.monthlyCostItems.forEach((item) => {
      monthlyRows.push([`Cost: ${item.name}`, `$${item.cost.toFixed(2)}`, `$${(item.cost * inputs.numberOfCameras).toFixed(2)}`]);
    });
    monthlyRows.push(['Total Monthly Cost', '', `$${calc.totalMonthlyCost.toFixed(2)}`]);
    monthlyRows.push([
      'Monthly Revenue',
      `$${inputs.monthlyRevenuePerCamera.toFixed(2)}`,
      `$${calc.totalMonthlyRevenue.toFixed(2)}`,
    ]);
    monthlyRows.push(['Monthly Net Profit', '', `$${calc.monthlyNetProfit.toFixed(2)}`]);

    autoTable(doc, {
      startY: y,
      head: [['Item', 'Per Camera', 'Total']],
      body: monthlyRows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 30, 30], textColor: [170, 255, 0] },
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
      margin: { left: margin, right: margin },
    });
    y = (doc as unknown as Record<string, number>).lastAutoTable.finalY + 8;

    // ── Section: ROI Summary ──
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ROI Summary', margin, y);
    y += 2;

    const roiRows: string[][] = [
      ['Contract Duration', `${calc.contractMonths} months`],
      ['Grace Period (no billing)', `${calc.graceMonths} months`],
      ['Active Billing Months', `${calc.billingMonths} months`],
      ['ROI (from billing start)', calc.roiMonths === Infinity ? 'N/A' : `${calc.roiMonths.toFixed(1)} months`],
      [
        'ROI (from contract start)',
        calc.roiFromContractStart === Infinity ? 'N/A' : `${calc.roiFromContractStart.toFixed(1)} months`,
      ],
      ['Total Contract Revenue', `$${calc.totalRevenue.toFixed(2)}`],
      ['Total Operating Cost', `$${calc.totalOperatingCost.toFixed(2)}`],
      ['Total Contract Profit', `$${calc.totalContractProfit.toFixed(2)}`],
    ];

    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value']],
      body: roiRows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 30, 30], textColor: [170, 255, 0] },
      columnStyles: { 1: { halign: 'right' } },
      margin: { left: margin, right: margin },
    });
    y = (doc as unknown as Record<string, number>).lastAutoTable.finalY + 8;

    // ── Section: Monthly Cashflow ──
    if (calc.cashflow.length > 0) {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Monthly Cashflow Projection', margin, y);
      y += 2;

      const cfRows = calc.cashflow.map((cf) => [
        cf.label,
        `$${cf.revenue.toFixed(2)}`,
        `$${cf.cost.toFixed(2)}`,
        `$${cf.cumulative.toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Month', 'Revenue', 'Cost', 'Cumulative']],
        body: cfRows,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [30, 30, 30], textColor: [170, 255, 0] },
        columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
        margin: { left: margin, right: margin },
      });
    }

    // Footer on each page
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150);
      doc.text(
        `Smash Vision — Confidential  |  Page ${p} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' },
      );
      doc.setTextColor(0);
    }

    doc.save(`ROI_${(inputs.clubName || 'Club').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="text-sv-lime" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-sv-white">ROI Calculator</h1>
            <p className="text-sv-gray-text text-sm">Estimate return on investment for a new club</p>
          </div>
        </div>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 bg-sv-lime text-sv-black px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-sv-lime-dark transition-colors"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>

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
        <KpiCard icon={Calendar} label="Contract" value={`${calc.contractMonths} mo`} sub={`${calc.graceMonths} grace`} />
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
                          {cf.month <= calc.graceMonths && (
                            <span className="ml-1 text-xs text-amber-400">(grace)</span>
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
    </div>
  );
}
