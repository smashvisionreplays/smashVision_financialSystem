import jsPDF from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';
import {
  LIME_DARK,
  CARBON,
  INK,
  GRAY_TEXT,
  NEGATIVE,
  HEADER_H,
  KPI_CARD_H,
  type Kpi,
  drawKpiCards,
  drawSectionTitle,
  brandTableOptions,
  subtotalStyles,
  limeStyles,
  styledRow,
  ISO_DATE,
  registerFonts,
  loadLogo,
  money,
  fmtDate,
  lastTableY,
  drawBrandHeader,
  drawPageFooters,
} from './pdfBrand';

// ── Shared ROI types ──────────────────────────────────────────────────
export interface CostItem {
  id: string;
  name: string;
  cost: number;
}

export interface RoiInputs {
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

export interface CashflowRow {
  month: number;
  label: string;
  revenue: number;
  cost: number;
  cumulative: number;
  isGrace: boolean;
  fraction: number;
}

export interface RoiCalc {
  totalCameraCost: number;
  installationTotal: number;
  initialContributionsTotal: number;
  totalInitialInvestment: number;
  netInitialInvestment: number;
  monthlyCostPerCamera: number;
  totalMonthlyCost: number;
  totalMonthlyRevenue: number;
  monthlyNetProfit: number;
  contractMonths: number;
  graceMonths: number;
  billingMonths: number;
  roiMonths: number;
  roiFromContractStart: number;
  totalRevenue: number;
  totalOperatingCost: number;
  totalContractProfit: number;
  cashflow: CashflowRow[];
}

export const defaultRoiInputs: RoiInputs = {
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

export function genId() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Embedded payload (lossless re-import) ─────────────────────────────
const PAYLOAD_MARKER = 'SVROI1:';

function encodeRoiPayload(inputs: RoiInputs): string {
  const bytes = new TextEncoder().encode(JSON.stringify({ v: 1, inputs }));
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return PAYLOAD_MARKER + btoa(bin);
}

export function sanitizeRoiInputs(x: unknown): RoiInputs | null {
  if (!x || typeof x !== 'object') return null;
  const o = x as Record<string, unknown>;
  const num = (v: unknown) => (typeof v === 'number' && isFinite(v) ? v : 0);
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  const isoOrEmpty = (v: unknown) => (typeof v === 'string' && ISO_DATE.test(v) ? v : '');
  const items = (v: unknown): CostItem[] =>
    Array.isArray(v)
      ? v
          .filter((i): i is Record<string, unknown> => !!i && typeof i === 'object')
          .map((i) => ({ id: genId(), name: str(i.name).trim(), cost: Math.max(0, num(i.cost)) }))
          .filter((i) => i.name.length > 0)
      : [];

  return {
    clubName: str(o.clubName).trim(),
    cameraCost: Math.max(0, num(o.cameraCost)),
    numberOfCameras: Math.max(1, Math.round(num(o.numberOfCameras)) || 1),
    switchCost: Math.max(0, num(o.switchCost)),
    pcCost: Math.max(0, num(o.pcCost)),
    installationItems: items(o.installationItems),
    contractStartDate: isoOrEmpty(o.contractStartDate),
    billingStartDate: isoOrEmpty(o.billingStartDate),
    contractMonths: Math.max(0, Math.round(num(o.contractMonths))),
    monthlyCostItems: items(o.monthlyCostItems),
    monthlyRevenuePerCamera: Math.max(0, num(o.monthlyRevenuePerCamera)),
    initialContributions: items(o.initialContributions),
  };
}

// ── PDF export (brand layout) ─────────────────────────────────────────
export async function exportRoiPdf(inputs: RoiInputs, calc: RoiCalc): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const F = await registerFonts(doc);
  const logo = await loadLogo();

  const ph = doc.internal.pageSize.getHeight();
  const margin = 16;
  const clubName = inputs.clubName.trim() || 'New Club';

  doc.setProperties({
    title: `Smash Vision — ROI Projection · ${clubName}`,
    subject: 'ROI Projection',
    author: 'Smash Vision',
    creator: 'Smash Vision Financial System',
    keywords: encodeRoiPayload(inputs),
  });

  // ---- Dark brand header
  const headerH = HEADER_H;
  drawBrandHeader(doc, F, logo, {
    margin,
    pill: 'ROI REPORT',
    title: 'ROI Projection',
    highlight: `${clubName}.`,
    subline: `${inputs.numberOfCameras} cameras · ${calc.contractMonths}-month contract · Start ${fmtDate(inputs.contractStartDate)} · Billing from ${fmtDate(inputs.billingStartDate)}`,
  });

  // ---- KPI cards (Marfil panels on white)
  let y = headerH + 8;
  const cardH = KPI_CARD_H;
  const roiText = calc.roiMonths === Infinity ? 'N/A' : `${calc.roiMonths.toFixed(1)} mo`;
  const kpis: Kpi[] = [
    {
      label: 'NET INVESTMENT',
      value: money(calc.netInitialInvestment),
      sub:
        calc.initialContributionsTotal > 0
          ? `after ${money(calc.initialContributionsTotal)} club contribution`
          : 'initial capital required',
      color: CARBON,
    },
    {
      label: 'MONTHLY NET PROFIT',
      value: money(calc.monthlyNetProfit),
      sub: `${money(calc.totalMonthlyRevenue)} - ${money(calc.totalMonthlyCost)} per month`,
      color: calc.monthlyNetProfit >= 0 ? LIME_DARK : NEGATIVE,
    },
    {
      label: 'ROI · FROM BILLING',
      value: roiText,
      sub:
        calc.roiFromContractStart === Infinity
          ? 'not reached within contract'
          : `${calc.roiFromContractStart.toFixed(1)} mo from contract start`,
      color: calc.roiMonths === Infinity ? NEGATIVE : LIME_DARK,
    },
    {
      label: 'CONTRACT PROFIT',
      value: money(calc.totalContractProfit),
      sub: `over ${calc.contractMonths} months`,
      color: calc.totalContractProfit >= 0 ? LIME_DARK : NEGATIVE,
    },
  ];
  drawKpiCards(doc, F, margin, y, kpis);
  y += cardH + 12;

  // ---- Section + table helpers
  const finalY = () => lastTableY(doc);

  const sectionTitle = (title: string): void => {
    y = drawSectionTitle(doc, F, margin, y, title);
  };

  const ensureSpace = (needed: number): void => {
    if (y + needed > ph - 22) {
      doc.addPage();
      y = 24;
    }
  };

  const drawTable = (head: string[], body: RowInput[], rightCols: number[]) => {
    autoTable(doc, {
      startY: y,
      head: [head],
      body,
      ...brandTableOptions(F, margin),
      columnStyles: Object.fromEntries(rightCols.map((c) => [c, { halign: 'right' as const }])),
    });
    y = finalY() + 12;
  };

  // ---- Initial Investment
  sectionTitle('Initial Investment');
  const investBody: RowInput[] = [
    ['Cameras', `${inputs.numberOfCameras} × ${money(inputs.cameraCost)}`, money(calc.totalCameraCost)],
    ['Network Switch', '', money(inputs.switchCost)],
    ['PC / Server', '', money(inputs.pcCost)],
    ...inputs.installationItems.map(
      (item): RowInput => [`Installation · ${item.name}`, '', money(item.cost)],
    ),
    styledRow(['Total Initial Investment', '', money(calc.totalInitialInvestment)], subtotalStyles),
    ...inputs.initialContributions.map(
      (item): RowInput => [
        { content: `Club contribution · ${item.name}`, styles: { textColor: LIME_DARK } },
        '',
        { content: '-' + money(item.cost), styles: { textColor: LIME_DARK } },
      ],
    ),
    styledRow(['Net Initial Investment', '', money(calc.netInitialInvestment)], limeStyles),
  ];
  drawTable(['ITEM', 'DETAIL', 'AMOUNT (USD)'], investBody, [2]);

  // ---- Monthly economics
  ensureSpace(40 + inputs.monthlyCostItems.length * 8);
  sectionTitle('Monthly Economics');
  const monthlyBody: RowInput[] = [
    ...inputs.monthlyCostItems.map(
      (item): RowInput => [
        `Cost · ${item.name}`,
        money(item.cost),
        money(item.cost * inputs.numberOfCameras),
      ],
    ),
    styledRow(
      ['Total Monthly Cost', money(calc.monthlyCostPerCamera), money(calc.totalMonthlyCost)],
      subtotalStyles,
    ),
    ['Monthly Revenue', money(inputs.monthlyRevenuePerCamera), money(calc.totalMonthlyRevenue)],
    styledRow(['Monthly Net Profit', '', money(calc.monthlyNetProfit)], limeStyles),
  ];
  drawTable(['MONTHLY ITEM', 'PER CAMERA', `TOTAL (× ${inputs.numberOfCameras})`], monthlyBody, [1, 2]);

  // ---- ROI summary
  ensureSpace(80);
  sectionTitle('ROI Summary');
  const monthsLabel = (n: number) => `${n} month${n === 1 ? '' : 's'}`;
  const roiBody: RowInput[] = [
    ['Contract duration', monthsLabel(calc.contractMonths)],
    ['Grace period (no billing)', monthsLabel(calc.graceMonths)],
    ['Active billing months', monthsLabel(calc.billingMonths)],
    ['ROI from billing start', calc.roiMonths === Infinity ? 'N/A' : `${calc.roiMonths.toFixed(1)} months`],
    [
      'ROI from contract start',
      calc.roiFromContractStart === Infinity ? 'N/A' : `${calc.roiFromContractStart.toFixed(1)} months`,
    ],
    ['Total contract revenue', money(calc.totalRevenue)],
    ['Total operating cost', money(calc.totalOperatingCost)],
    styledRow(['Total Contract Profit', money(calc.totalContractProfit)], limeStyles),
  ];
  drawTable(['METRIC', 'VALUE'], roiBody, [1]);

  // ---- Cashflow projection
  if (calc.cashflow.length > 0) {
    ensureSpace(60);
    sectionTitle('Monthly Cashflow Projection');
    const breakevenIndex = calc.cashflow.findIndex((cf) => cf.cumulative >= 0);
    const cfBody: RowInput[] = calc.cashflow.map((cf, i) => {
      let label = cf.label;
      if (cf.isGrace) label += ' · grace';
      else if (cf.fraction > 0 && cf.fraction < 1) label += ` · ${Math.round(cf.fraction * 100)}%`;
      if (i === breakevenIndex) {
        return styledRow(
          [label + ' · break-even', money(cf.revenue), money(cf.cost), money(cf.cumulative)],
          limeStyles,
        );
      }
      return [
        cf.isGrace ? { content: label, styles: { textColor: GRAY_TEXT } } : label,
        money(cf.revenue),
        money(cf.cost),
        {
          content: money(cf.cumulative),
          styles:
            cf.cumulative >= 0
              ? { textColor: LIME_DARK, fontStyle: 'bold' as const }
              : { textColor: INK },
        },
      ];
    });
    drawTable(['MONTH', 'REVENUE', 'COST', 'CUMULATIVE'], cfBody, [1, 2, 3]);
  }

  // ---- Footer on every page
  drawPageFooters(doc, F, margin);

  doc.save(
    `ROI_${clubName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`,
  );
}

// ── PDF import ────────────────────────────────────────────────────────
export interface ParsedRoiPdf {
  inputs: RoiInputs;
  source: 'embedded' | 'legacy';
}

export function parseRoiPdf(buffer: ArrayBuffer): ParsedRoiPdf | null {
  const raw = new TextDecoder('latin1').decode(buffer);

  const embedded = parseEmbedded(raw);
  if (embedded) return { inputs: embedded, source: 'embedded' };

  const legacy = parseLegacy(raw);
  if (legacy) return { inputs: legacy, source: 'legacy' };

  return null;
}

function parseEmbedded(raw: string): RoiInputs | null {
  const m = new RegExp(PAYLOAD_MARKER + '([A-Za-z0-9+/=]+)').exec(raw);
  if (!m) return null;
  try {
    const bin = atob(m[1]);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as { inputs?: unknown };
    return sanitizeRoiInputs(parsed.inputs);
  } catch {
    return null;
  }
}

// Legacy PDFs (pre-brand redesign) used built-in Helvetica, so their text
// is stored as plain literal strings in uncompressed content streams.
function extractTextStrings(raw: string): string[] {
  const out: string[] = [];
  const re = /\(((?:\\.|[^()\\])*)\)\s*Tj/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    out.push(m[1].replace(/\\([()\\])/g, '$1'));
  }
  return out;
}

function parseMoney(s: string): number | null {
  const m = /^(-?)\$([\d,]+(?:\.\d+)?)$/.exec(s.trim());
  if (!m) return null;
  const v = parseFloat(m[2].replace(/,/g, ''));
  return isNaN(v) ? null : (m[1] ? -v : v);
}

function nextMoney(strings: string[], from: number, maxAhead = 3): number | null {
  for (let i = from; i < Math.min(strings.length, from + maxAhead); i++) {
    const v = parseMoney(strings[i]);
    if (v !== null) return v;
  }
  return null;
}

function parseLegacy(raw: string): RoiInputs | null {
  const strings = extractTextStrings(raw);

  const detailRe = /^(\d+)\s+cameras\s+\|\s+(\d+)\s+months contract\s+\|\s+Start:\s*(\S+)\s+\|\s+Billing starts:\s*(\S+)$/;
  const detailIndex = strings.findIndex((s) => detailRe.test(s));
  if (detailIndex < 0) return null;

  const detail = detailRe.exec(strings[detailIndex])!;
  const inputs: RoiInputs = {
    ...defaultRoiInputs,
    installationItems: [],
    monthlyCostItems: [],
    initialContributions: [],
    clubName: detailIndex > 0 ? strings[detailIndex - 1].trim() : '',
    numberOfCameras: Math.max(1, parseInt(detail[1], 10) || 1),
    contractMonths: Math.max(0, parseInt(detail[2], 10) || 0),
    contractStartDate: ISO_DATE.test(detail[3]) ? detail[3] : '',
    billingStartDate: ISO_DATE.test(detail[4]) ? detail[4] : '',
  };
  if (inputs.clubName === 'New Club') inputs.clubName = '';

  let revenueParsed = false;
  for (let i = detailIndex + 1; i < strings.length; i++) {
    const s = strings[i].trim();

    if (s === 'Cameras') {
      const detailCell = /^(\d+)\s*[×x]\s*\$([\d,]+(?:\.\d+)?)$/.exec(strings[i + 1]?.trim() ?? '');
      if (detailCell) {
        inputs.cameraCost = parseFloat(detailCell[2].replace(/,/g, '')) || 0;
      } else {
        const total = nextMoney(strings, i + 1);
        if (total !== null) inputs.cameraCost = total / inputs.numberOfCameras;
      }
    } else if (s === 'Network Switch') {
      inputs.switchCost = Math.max(0, nextMoney(strings, i + 1) ?? 0);
    } else if (s === 'PC / Server') {
      inputs.pcCost = Math.max(0, nextMoney(strings, i + 1) ?? 0);
    } else if (s.startsWith('Installation: ')) {
      const cost = nextMoney(strings, i + 1);
      if (cost !== null) {
        inputs.installationItems.push({ id: genId(), name: s.slice('Installation: '.length), cost });
      }
    } else if (s.startsWith('Club Contribution: ')) {
      const cost = nextMoney(strings, i + 1);
      if (cost !== null) {
        inputs.initialContributions.push({
          id: genId(),
          name: s.slice('Club Contribution: '.length),
          cost: Math.abs(cost),
        });
      }
    } else if (s.startsWith('Cost: ')) {
      const cost = nextMoney(strings, i + 1);
      if (cost !== null) {
        inputs.monthlyCostItems.push({ id: genId(), name: s.slice('Cost: '.length), cost });
      }
    } else if (s === 'Monthly Revenue' && !revenueParsed) {
      const perCamera = nextMoney(strings, i + 1);
      if (perCamera !== null) {
        inputs.monthlyRevenuePerCamera = perCamera;
        revenueParsed = true;
      }
    }
  }

  return inputs;
}
