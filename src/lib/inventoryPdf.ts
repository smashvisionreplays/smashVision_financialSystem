import jsPDF from 'jspdf';
import autoTable, { type CellInput, type RowInput, type UserOptions } from 'jspdf-autotable';
import type {
  InventoryCatalogItem,
  InventoryLocation,
  InventoryLocationType,
  InventoryStatus,
  InventoryUnit,
} from '../types';
import { inventoryStatusLabels, locationTypeLabels } from './formatters';
import {
  compareCatalog,
  countQty,
  formatQty,
  isMeasuredUnit,
  isCurrentUnit,
  localIsoDate,
  summarizeInventory,
  unitValueUsd,
} from './inventory';
import {
  LIME,
  LIME_DARK,
  CARBON,
  INK,
  GRAY_TEXT,
  IVORY,
  NEGATIVE,
  HEADER_H,
  KPI_CARD_H,
  type RGB,
  type Kpi,
  registerFonts,
  loadLogo,
  money,
  fmtDate,
  fmtToday,
  lastTableY,
  drawBrandHeader,
  drawKpiCards,
  drawSectionTitle,
  brandTableOptions,
  semibold,
  subtotalStyles,
  limeStyles,
  styledRow,
  drawPageFooters,
} from './pdfBrand';

export interface InventoryPdfData {
  catalog: InventoryCatalogItem[];
  units: InventoryUnit[];
  locations: InventoryLocation[];
}

const STATUS_RGB: Record<InventoryStatus, RGB> = {
  in_stock: INK,
  installed: LIME_DARK,
  in_repair: [176, 120, 20],
  damaged: NEGATIVE,
  retired: GRAY_TEXT,
};

const LOCATION_ORDER: InventoryLocationType[] = ['warehouse', 'club', 'office', 'person', 'other'];

const plural = (n: number, word: string) => `${n.toLocaleString('en-US')} ${word}${n === 1 ? '' : 's'}`;

export const inventoryPdfFilename = (d = new Date()) => `SmashVision_Inventory_${localIsoDate(d)}.pdf`;

interface LocationGroup {
  real: boolean;
  name: string;
  type: string;
  units: InventoryUnit[];
  qty: number;
  value: number;
}

function groupByLocation(units: InventoryUnit[], locations: InventoryLocation[]): LocationGroup[] {
  const byId = new Map(locations.map((l) => [l.id, l]));
  const groups = new Map<string, { loc: InventoryLocation | null; units: InventoryUnit[] }>();
  for (const u of units) {
    const loc = (u.location_id && byId.get(u.location_id)) || null;
    const key = loc?.id ?? '__none';
    const g = groups.get(key) ?? { loc, units: [] };
    g.units.push(u);
    groups.set(key, g);
  }
  return Array.from(groups.values())
    .sort((a, b) => {
      if (!a.loc) return 1;
      if (!b.loc) return -1;
      return (
        LOCATION_ORDER.indexOf(a.loc.type) - LOCATION_ORDER.indexOf(b.loc.type) || a.loc.name.localeCompare(b.loc.name)
      );
    })
    .map(({ loc, units: list }) => ({
      real: !!loc,
      name: loc?.name ?? 'No location',
      type: loc ? locationTypeLabels[loc.type] : 'Unassigned',
      units: list.sort(
        (a, b) =>
          (a.catalog?.category ?? '').localeCompare(b.catalog?.category ?? '') ||
          (a.catalog?.name ?? '').localeCompare(b.catalog?.name ?? '') ||
          (a.serial_number ?? '').localeCompare(b.serial_number ?? ''),
      ),
      qty: list.reduce((s, u) => s + countQty(u), 0),
      value: list.reduce((s, u) => s + unitValueUsd(u), 0),
    }));
}

/** Builds the branded inventory report (current inventory + average costs). */
export async function buildInventoryPdf(data: InventoryPdfData, now = new Date()): Promise<jsPDF> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const F = await registerFonts(doc);
  const logo = await loadLogo();

  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const margin = 16;
  const cw = pw - margin * 2;
  const dateLabel = fmtToday(now);
  const timeLabel = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const summary = summarizeInventory(data.units, data.catalog);
  const current = data.units.filter(isCurrentUnit);
  const groups = groupByLocation(current, data.locations);
  const activeCatalog = data.catalog.filter((c) => c.is_active).sort(compareCatalog);
  const products = activeCatalog.filter((c) => c.kind === 'product');
  const services = activeCatalog.filter((c) => c.kind === 'service');
  const estimatedCount = current.filter((u) => u.purchase_cost_usd === null || u.purchase_cost_usd === undefined).length;
  const missingDateCount = current.filter((u) => !u.purchase_date).length;

  doc.setProperties({
    title: `Smash Vision — Inventory Report · ${dateLabel}`,
    subject: 'Inventory Report',
    author: 'Smash Vision',
    creator: 'Smash Vision Financial System',
  });

  // ---- Header
  drawBrandHeader(doc, F, logo, {
    margin,
    date: now,
    pill: 'INVENTORY REPORT',
    title: 'Inventory Report',
    highlight: `As of ${dateLabel}.`,
    subline: `Generated ${dateLabel}, ${timeLabel} · ${plural(summary.totalQty, 'unit')} in ${plural(groups.filter((g) => g.real).length, 'location')} · ${plural(products.length, 'product')} · ${plural(services.length, 'service')} in catalog`,
  });

  // ---- KPI cards
  let y = HEADER_H + 8;
  const kpis: Kpi[] = [
    {
      label: 'TOTAL UNITS',
      value: summary.totalQty.toLocaleString('en-US'),
      sub: `${plural(summary.records, 'record')} · excl. retired`,
      color: CARBON,
    },
    {
      label: 'INVENTORY VALUE',
      value: money(summary.valueUsd),
      sub: 'purchase cost or catalog avg.',
      color: LIME_DARK,
    },
    {
      label: 'INSTALLED · IN STOCK',
      value: `${summary.installedQty.toLocaleString('en-US')} · ${summary.inStockQty.toLocaleString('en-US')}`,
      sub: summary.attentionQty > 0 ? `${summary.attentionQty} in repair or damaged` : 'none in repair or damaged',
      color: CARBON,
    },
    {
      label: 'CATALOG',
      value: `${products.length} · ${services.length}`,
      sub: 'active products · services',
      color: CARBON,
    },
  ];
  drawKpiCards(doc, F, margin, y, kpis);
  y += KPI_CARD_H + 12;

  // ---- Layout helpers
  const ensureSpace = (needed: number): void => {
    if (y + needed > ph - 22) {
      doc.addPage();
      y = 26;
    }
  };

  const sectionTitle = (title: string) => {
    y = drawSectionTitle(doc, F, margin, y, title);
  };

  const subheading = (left: string, right?: string) => {
    doc.setFont(F.family, F.semibold);
    doc.setFontSize(8.4);
    doc.setTextColor(...CARBON);
    doc.text(left, margin, y + 3.2);
    if (right) {
      doc.setFont(F.family, 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(...GRAY_TEXT);
      doc.text(right, pw - margin, y + 3.2, { align: 'right' });
    }
    y += 5.8;
  };

  const emptyNote = (text: string) => {
    doc.setFillColor(...IVORY);
    doc.roundedRect(margin, y, cw, 11, 2, 2, 'F');
    doc.setFont(F.family, 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(...GRAY_TEXT);
    doc.text(text, margin + 4, y + 6.9);
    y += 11 + 9;
  };

  const footnote = (text: string) => {
    doc.setFont(F.family, 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...GRAY_TEXT);
    const lines = doc.splitTextToSize(text, cw) as string[];
    ensureSpace(lines.length * 3.4 + 2);
    doc.text(lines, margin, y);
    y += lines.length * 3.4;
  };

  const table = (opts: UserOptions, gapAfter = 10) => {
    const cols = (opts.columnStyles ?? {}) as Record<string, { halign?: string }>;
    autoTable(doc, {
      startY: y,
      ...brandTableOptions(F, margin),
      ...opts,
      didParseCell: (hook) => {
        if (hook.section === 'head' && cols[hook.column.index]?.halign === 'right') {
          hook.cell.styles.halign = 'right';
        }
      },
    });
    y = lastTableY(doc) + gapAfter;
  };

  const right = { halign: 'right' as const };
  // Label spanning the first five detail columns + value in the last one
  const spanRow = (label: string, value: string, styles: Record<string, unknown>): RowInput => [
    { content: label, colSpan: 5, styles },
    { content: value, styles },
  ];
  const muted = (content: string): CellInput => ({ content, styles: { textColor: GRAY_TEXT } });

  // ---- Average costs
  sectionTitle('Average costs');
  y += 1.5;

  subheading('Products', plural(products.length, 'item'));
  if (products.length === 0) {
    emptyNote('No active products in the catalog yet.');
  } else {
    table({
      head: [['ITEM', 'BRAND / MODEL', 'CATEGORY', 'UNIT', 'AVG COST (USD)']],
      body: products.map((p): RowInput => [
        p.name,
        [p.brand, p.model].filter(Boolean).join(' ') || muted('—'),
        p.category,
        p.unit,
        money(Number(p.avg_cost_usd)),
      ]),
      columnStyles: {
        1: { cellWidth: 42 },
        2: { cellWidth: 27 },
        3: { cellWidth: 18 },
        4: { cellWidth: 28, ...right },
      },
    });
  }

  ensureSpace(30);
  subheading('Services', plural(services.length, 'item'));
  if (services.length === 0) {
    emptyNote('No active services in the catalog yet.');
  } else {
    table({
      head: [['SERVICE', 'CATEGORY', 'UNIT', 'AVG COST (USD)']],
      body: services.map((s): RowInput => [s.name, s.category, `per ${s.unit}`, money(Number(s.avg_cost_usd))]),
      columnStyles: {
        1: { cellWidth: 30 },
        2: { cellWidth: 26 },
        3: { cellWidth: 28, ...right },
      },
    });
  }

  // ---- Current inventory
  y += 2;
  ensureSpace(current.length === 0 ? 26 : 48);
  sectionTitle('Current inventory');
  y += 1.5;

  if (current.length === 0) {
    emptyNote('No units in inventory yet.');
  } else {
    // Overview by location
    subheading('By location', plural(groups.filter((g) => g.real).length, 'location'));
    table({
      head: [['LOCATION', 'TYPE', 'RECORDS', 'UNITS', 'VALUE (USD)']],
      body: [
        ...groups.map((g): RowInput => [
          g.name,
          g.type,
          String(g.units.length),
          g.qty.toLocaleString('en-US'),
          money(g.value),
        ]),
        styledRow(
          ['Total', '', String(summary.records), summary.totalQty.toLocaleString('en-US'), money(summary.valueUsd)],
          limeStyles,
        ),
      ],
      columnStyles: {
        1: { cellWidth: 28 },
        2: { cellWidth: 22, ...right },
        3: { cellWidth: 20, ...right },
        4: { cellWidth: 32, ...right },
      },
    }, 11);

    // Detail per location
    const detailColumns: UserOptions['columnStyles'] = {
      1: { cellWidth: 37, fontSize: 6.9 },
      2: { cellWidth: 21, fontSize: 7.6 },
      3: { cellWidth: 15, ...right },
      4: { cellWidth: 25, fontSize: 7.6 },
      5: { cellWidth: 27, ...right },
    };

    for (const g of groups) {
      ensureSpace(34);
      // Location heading
      doc.setFillColor(...LIME);
      doc.roundedRect(margin, y + 0.4, 2.6, 2.6, 0.6, 0.6, 'F');
      doc.setFont(F.family, 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...CARBON);
      doc.text(g.name, margin + 4.6, y + 3);
      const nameW = doc.getTextWidth(g.name);
      doc.setFont(F.family, 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(...GRAY_TEXT);
      doc.text(g.type.toUpperCase(), margin + 4.6 + nameW + 2.4, y + 3, { charSpace: 0.4 });
      doc.setFont(F.family, F.semibold);
      doc.setFontSize(7.6);
      doc.setTextColor(...INK);
      doc.text(`${plural(g.qty, 'unit')} · ${money(g.value)}`, pw - margin, y + 3, { align: 'right' });
      y += 5.6;

      table({
        head: [['ITEM', 'SERIAL', 'STATUS', 'QTY', 'PURCHASED', 'VALUE (USD)']],
        body: [
          ...g.units.map((u): RowInput => {
            const estimated = u.purchase_cost_usd === null || u.purchase_cost_usd === undefined;
            return [
              u.catalog?.name ?? 'Unknown item',
              u.serial_number || muted('—'),
              {
                content: inventoryStatusLabels[u.status],
                styles: { textColor: STATUS_RGB[u.status], fontStyle: semibold(F) },
              },
              formatQty(Number(u.quantity), u.catalog?.unit),
              u.purchase_date ? fmtDate(u.purchase_date) : muted('—'),
              money(unitValueUsd(u)) + (estimated ? ' *' : ''),
            ];
          }),
          spanRow(`Subtotal · ${g.name}`, money(g.value), subtotalStyles),
        ],
        columnStyles: detailColumns,
        rowPageBreak: 'avoid',
      }, 9);
    }

    // Grand total, aligned with the detail columns
    ensureSpace(14);
    table({
      showHead: false,
      body: [spanRow(`Total inventory · ${plural(summary.totalQty, 'unit')}`, money(summary.valueUsd), limeStyles)],
      columnStyles: detailColumns,
    }, 7);

    const notes: string[] = [];
    if (estimatedCount > 0)
      notes.push(`* ${plural(estimatedCount, 'record')} without a purchase cost, valued at the catalog average cost.`);
    if (missingDateCount > 0) notes.push(`${plural(missingDateCount, 'record')} without a purchase date (shown as —).`);
    if (current.some((u) => isMeasuredUnit(u.catalog?.unit)))
      notes.push('Unit counts are pieces; items measured by length or time (e.g. cable in meters) count once per record.');
    if (summary.retiredQty > 0) notes.push(`Excludes ${plural(summary.retiredQty, 'retired unit')}.`);
    notes.forEach((n) => {
      footnote(n);
      y += 0.6;
    });
  }

  drawPageFooters(doc, F, margin, `Inventory report · ${dateLabel}`);
  return doc;
}

export async function exportInventoryPdf(data: InventoryPdfData): Promise<void> {
  const now = new Date();
  const doc = await buildInventoryPdf(data, now);
  doc.save(inventoryPdfFilename(now));
}
