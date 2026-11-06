import { useMemo, useState } from 'react';
import { Boxes, FileDown, Package, DollarSign, CheckCircle2, BookOpen, MapPin, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInventoryCatalog, useInventoryLocations, useInventoryUnits } from '../hooks/useInventory';
import { summarizeInventory } from '../lib/inventory';
import { formatCurrency } from '../lib/formatters';
import CatalogTab from '../components/inventory/CatalogTab';
import UnitsTab from '../components/inventory/UnitsTab';
import LocationsTab from '../components/inventory/LocationsTab';
import { isMissingTableError } from '../components/inventory/styles';

type Tab = 'catalog' | 'units' | 'locations';
const TAB_KEY = 'sv-inventory-tab';

function readTab(): Tab {
  try {
    const t = localStorage.getItem(TAB_KEY);
    if (t === 'catalog' || t === 'units' || t === 'locations') return t;
  } catch {
    // storage unavailable — use the default tab
  }
  return 'catalog';
}

export default function Inventory() {
  const [tab, setTabState] = useState<Tab>(readTab);
  const [exporting, setExporting] = useState(false);

  const catalogQuery = useInventoryCatalog();
  const locationsQuery = useInventoryLocations();
  const unitsQuery = useInventoryUnits();

  const catalog = useMemo(() => catalogQuery.data ?? [], [catalogQuery.data]);
  const locations = useMemo(() => locationsQuery.data ?? [], [locationsQuery.data]);
  const units = useMemo(() => unitsQuery.data ?? [], [unitsQuery.data]);
  const summary = useMemo(() => summarizeInventory(units, catalog), [units, catalog]);

  const loading = catalogQuery.isLoading || locationsQuery.isLoading || unitsQuery.isLoading;
  const error = catalogQuery.error || locationsQuery.error || unitsQuery.error;

  const setTab = (t: Tab) => {
    setTabState(t);
    try {
      localStorage.setItem(TAB_KEY, t);
    } catch {
      // ignore
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Loaded on demand: keeps jsPDF out of the page bundle until needed
      const { exportInventoryPdf } = await import('../lib/inventoryPdf');
      await exportInventoryPdf({ catalog, units, locations });
      toast.success('Inventory PDF downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Could not generate the PDF');
    } finally {
      setExporting(false);
    }
  };

  const kpis = [
    {
      label: 'Total Units',
      value: summary.totalQty.toLocaleString('en-US'),
      sub: `${summary.records} record${summary.records !== 1 ? 's' : ''} · excl. retired`,
      title: 'Pieces in inventory. Items measured by length or time (e.g. cable in meters) count once per record.',
      icon: Package,
    },
    {
      label: 'Inventory Value',
      value: formatCurrency(summary.valueUsd),
      sub: 'At purchase cost or catalog average',
      title: 'Σ quantity × (unit purchase cost, or the catalog average cost when it has none)',
      icon: DollarSign,
      highlight: true,
    },
    {
      label: 'Installed · In Stock',
      value: `${summary.installedQty} · ${summary.inStockQty}`,
      sub: summary.attentionQty > 0 ? `${summary.attentionQty} in repair or damaged` : 'None in repair or damaged',
      icon: CheckCircle2,
    },
    {
      label: 'Catalog',
      value: `${summary.activeProducts} · ${summary.activeServices}`,
      sub: 'Active products · services',
      icon: BookOpen,
    },
  ];

  const tabs: { key: Tab; label: string; icon: typeof Boxes; count?: number }[] = [
    { key: 'catalog', label: 'Average costs', icon: BookOpen, count: catalog.length },
    { key: 'units', label: 'Inventory', icon: Package, count: units.length },
    { key: 'locations', label: 'Locations', icon: MapPin, count: locations.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Boxes className="text-sv-lime" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-sv-white">Inventory</h1>
            <p className="text-sv-gray-text text-sm">Equipment, stock by location and average costs</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={loading || !!error || exporting}
          className="flex items-center gap-2 px-4 py-2 bg-sv-lime text-sv-black rounded-lg font-semibold text-sm hover:bg-sv-lime-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <FileDown size={16} />
          {exporting ? 'Generating…' : 'Download PDF'}
        </button>
      </div>

      {error ? (
        <div className="bg-sv-dark border border-sv-gray rounded-xl p-6 flex items-start gap-4">
          <div className="p-2 bg-sv-gray rounded-lg shrink-0">
            <AlertTriangle className="text-sv-lime" size={22} />
          </div>
          <div>
            <h3 className="text-sv-white font-semibold">
              {isMissingTableError(error) ? 'Inventory tables not found' : 'Could not load the inventory'}
            </h3>
            <p className="text-sv-gray-text text-sm mt-1">
              {isMissingTableError(error) ? (
                <>
                  Run <code className="text-sv-lime">sql/008_inventory.sql</code> in the Supabase SQL editor, then
                  reload this page.
                </>
              ) : (
                (error as { message?: string }).message || 'Unknown error'
              )}
            </p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-sv-lime border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <div
                key={k.label}
                title={k.title}
                className={`bg-sv-dark rounded-xl border p-5 ${k.highlight ? 'border-sv-lime/20' : 'border-sv-gray'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sv-gray-text text-sm font-medium">{k.label}</span>
                  <div className={`p-2 rounded-lg ${k.highlight ? 'bg-sv-lime/10' : 'bg-sv-gray'}`}>
                    <k.icon size={18} className={k.highlight ? 'text-sv-lime' : 'text-sv-white'} />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${k.highlight ? 'text-sv-lime' : 'text-sv-white'}`}>{k.value}</p>
                <p className="text-sv-gray-text text-xs mt-1">{k.sub}</p>
              </div>
            ))}
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

          {tab === 'catalog' && <CatalogTab catalog={catalog} units={units} />}
          {tab === 'units' && <UnitsTab units={units} catalog={catalog} locations={locations} />}
          {tab === 'locations' && <LocationsTab locations={locations} units={units} />}
        </>
      )}
    </div>
  );
}
