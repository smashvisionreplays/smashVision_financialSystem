import jsPDF from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';

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

// ── Brand palette (SmashVision_IdentidadDeMarca_2026) ─────────────────
const LIME: [number, number, number] = [197, 240, 43]; // #C5F02B Lima Smash
const LIME_DARK: [number, number, number] = [122, 148, 20]; // #7A9414 lime on light bg
const CARBON: [number, number, number] = [18, 18, 18]; // #121212 Negro Carbón
const INK: [number, number, number] = [26, 26, 26];
const GRAY_TEXT: [number, number, number] = [110, 116, 106];
const IVORY: [number, number, number] = [245, 247, 241]; // #F5F7F1 Marfil Panel
const IVORY_DEEP: [number, number, number] = [233, 237, 226];
const RULE: [number, number, number] = [228, 231, 222];
const HEADER_TOP: [number, number, number] = [6, 16, 3]; // #061003 Verde Profundo
const HEADER_BOTTOM: [number, number, number] = [11, 18, 10]; // #0B120A
const HEADER_MUTED: [number, number, number] = [173, 178, 168]; // white 60% on dark
const NEGATIVE: [number, number, number] = [166, 72, 60];

// ── Assets (fonts + logo), cached per session ─────────────────────────
let fontCache: { regular: string; semibold: string; bold: string } | null = null;
let fontsFailed = false;
let logoCache: string | null | undefined;

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

async function fetchBase64(path: string): Promise<string> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return bufferToBase64(await res.arrayBuffer());
}

interface FontSet {
  family: string;
  semibold: string;
}

async function registerFonts(doc: jsPDF): Promise<FontSet> {
  if (!fontCache && !fontsFailed) {
    try {
      const [regular, semibold, bold] = await Promise.all([
        fetchBase64('/fonts/Poppins-Regular.ttf'),
        fetchBase64('/fonts/Poppins-SemiBold.ttf'),
        fetchBase64('/fonts/Poppins-Bold.ttf'),
      ]);
      fontCache = { regular, semibold, bold };
    } catch {
      fontsFailed = true;
    }
  }
  if (!fontCache) return { family: 'helvetica', semibold: 'bold' };
  doc.addFileToVFS('Poppins-Regular.ttf', fontCache.regular);
  doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');
  doc.addFileToVFS('Poppins-SemiBold.ttf', fontCache.semibold);
  doc.addFont('Poppins-SemiBold.ttf', 'Poppins', 'semibold');
  doc.addFileToVFS('Poppins-Bold.ttf', fontCache.bold);
  doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');
  return { family: 'Poppins', semibold: 'semibold' };
}

async function loadLogo(): Promise<string | null> {
  if (logoCache !== undefined) return logoCache;
  try {
    const res = await fetch('/logo.png');
    const blob = await res.blob();
    logoCache = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    logoCache = null;
  }
  return logoCache;
}

// ── Formatting helpers ────────────────────────────────────────────────
const money = (n: number) =>
  (n < 0 ? '-$' : '$') +
  Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function fmtDate(iso: string): string {
  if (!ISO_DATE.test(iso)) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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

  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const margin = 16;
  const cw = pw - margin * 2;
  const clubName = inputs.clubName.trim() || 'New Club';

  doc.setProperties({
    title: `Smash Vision — ROI Projection · ${clubName}`,
    subject: 'ROI Projection',
    author: 'Smash Vision',
    creator: 'Smash Vision Financial System',
    keywords: encodeRoiPayload(inputs),
  });

  // ---- Dark header with Verde Profundo gradient
  const headerH = 58;
  const steps = 36;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    doc.setFillColor(
      Math.round(HEADER_TOP[0] + (HEADER_BOTTOM[0] - HEADER_TOP[0]) * t),
      Math.round(HEADER_TOP[1] + (HEADER_BOTTOM[1] - HEADER_TOP[1]) * t),
      Math.round(HEADER_TOP[2] + (HEADER_BOTTOM[2] - HEADER_TOP[2]) * t),
    );
    doc.rect(0, (headerH / steps) * i, pw, headerH / steps + 0.4, 'F');
  }
  doc.setFillColor(...LIME);
  doc.rect(0, headerH - 1.2, pw, 1.2, 'F');

  // ---- Pill label (top-left, brand style)
  const today = new Date();
  const pillText =
    'ROI REPORT · ' +
    today
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      .toUpperCase();
  const cs = 0.6;
  doc.setFont(F.family, F.semibold);
  doc.setFontSize(6.5);
  const pillTextW = doc.getTextWidth(pillText) + cs * (pillText.length - 1);
  const pillW = pillTextW + 13;
  doc.setDrawColor(92, 102, 84);
  doc.setLineWidth(0.25);
  doc.roundedRect(margin, 11, pillW, 8, 4, 4, 'S');
  doc.setFillColor(...LIME);
  doc.circle(margin + 4.8, 15, 1.1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(pillText, margin + 8.3, 16.3, { charSpace: cs });

  // ---- Logo (top-right, isotype on dark)
  if (logo) doc.addImage(logo, 'PNG', pw - margin - 17, 8.5, 17, 17);

  // ---- Title: white + club name as the lime key phrase
  doc.setFont(F.family, 'bold');
  doc.setFontSize(19);
  doc.setTextColor(255, 255, 255);
  doc.text('ROI Projection', margin, 34.5);
  let clubSize = 19;
  doc.setFontSize(clubSize);
  while (doc.getTextWidth(`${clubName}.`) > cw && clubSize > 11) {
    clubSize -= 1;
    doc.setFontSize(clubSize);
  }
  doc.setTextColor(...LIME);
  doc.text(`${clubName}.`, margin, 43.5);

  // ---- Sub-line
  doc.setFont(F.family, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...HEADER_MUTED);
  doc.text(
    `${inputs.numberOfCameras} cameras · ${calc.contractMonths}-month contract · Start ${fmtDate(inputs.contractStartDate)} · Billing from ${fmtDate(inputs.billingStartDate)}`,
    margin,
    50.5,
  );

  // ---- KPI cards (Marfil panels on white)
  let y = headerH + 8;
  const gap = 4;
  const cardW = (cw - gap * 3) / 4;
  const cardH = 24;
  const roiText = calc.roiMonths === Infinity ? 'N/A' : `${calc.roiMonths.toFixed(1)} mo`;
  const kpis: { label: string; value: string; sub: string; color: [number, number, number] }[] = [
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
  kpis.forEach((kpi, i) => {
    const x = margin + i * (cardW + gap);
    doc.setFillColor(...IVORY);
    doc.roundedRect(x, y, cardW, cardH, 2.5, 2.5, 'F');
    doc.setFont(F.family, F.semibold);
    doc.setFontSize(5.8);
    doc.setTextColor(...GRAY_TEXT);
    doc.text(kpi.label, x + 4, y + 6.5, { charSpace: 0.4 });
    doc.setFont(F.family, 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(...kpi.color);
    doc.text(kpi.value, x + 4, y + 14.5);
    doc.setFont(F.family, 'normal');
    doc.setFontSize(5.6);
    doc.setTextColor(...GRAY_TEXT);
    doc.text(kpi.sub, x + 4, y + 20, { maxWidth: cardW - 8 });
  });
  y += cardH + 12;

  // ---- Section + table helpers
  const finalY = () =>
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  const sectionTitle = (title: string): void => {
    doc.setFillColor(...LIME);
    doc.rect(margin, y - 3.4, 1.7, 4.6, 'F');
    doc.setFont(F.family, F.semibold);
    doc.setFontSize(9);
    doc.setTextColor(...CARBON);
    doc.text(title.toUpperCase(), margin + 4.2, y, { charSpace: 0.8 });
    y += 4;
  };

  const ensureSpace = (needed: number): void => {
    if (y + needed > ph - 22) {
      doc.addPage();
      y = 24;
    }
  };

  type CellStyles = Record<string, unknown>;
  const subtotalStyles: CellStyles = { fillColor: IVORY_DEEP, fontStyle: 'bold', textColor: INK };
  const limeStyles: CellStyles = { fillColor: LIME, fontStyle: 'bold', textColor: CARBON };
  const styledRow = (cells: string[], styles: CellStyles): RowInput =>
    cells.map((content) => ({ content, styles }));

  const drawTable = (head: string[], body: RowInput[], rightCols: number[]) => {
    autoTable(doc, {
      startY: y,
      head: [head],
      body,
      theme: 'plain',
      margin: { left: margin, right: margin, top: 24, bottom: 20 },
      styles: {
        font: F.family,
        fontSize: 8.2,
        cellPadding: { top: 2.4, bottom: 2.4, left: 3, right: 3 },
        textColor: INK,
      },
      headStyles: {
        fillColor: CARBON,
        textColor: LIME,
        fontSize: 6.8,
        fontStyle: F.semibold === 'semibold' ? ('semibold' as 'bold') : 'bold',
        cellPadding: { top: 2.6, bottom: 2.6, left: 3, right: 3 },
      },
      alternateRowStyles: { fillColor: IVORY },
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
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.3);
    doc.line(margin, ph - 14, pw - margin, ph - 14);
    doc.setFillColor(...LIME);
    doc.circle(margin + 1, ph - 9.3, 0.9, 'F');
    doc.setFont(F.family, F.semibold);
    doc.setFontSize(6);
    doc.setTextColor(...GRAY_TEXT);
    doc.text('SMASH VISION · CONFIDENTIAL', margin + 4, ph - 8.2, { charSpace: 0.7 });
    doc.setFont(F.family, 'normal');
    doc.setFontSize(6.5);
    doc.text(`smashvisionapp.com · Page ${p} of ${pageCount}`, pw - margin, ph - 8.2, {
      align: 'right',
    });
  }

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
