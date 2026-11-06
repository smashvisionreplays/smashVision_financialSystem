import type jsPDF from 'jspdf';
import type { RowInput, UserOptions } from 'jspdf-autotable';

// Shared brand layer for generated PDFs (SmashVision_IdentidadDeMarca_2026):
// palette, Poppins fonts, logo, dark gradient header and page footer.

export type RGB = [number, number, number];

// ── Brand palette ─────────────────────────────────────────────────────
export const LIME: RGB = [197, 240, 43]; // #C5F02B Lima Smash
export const LIME_DARK: RGB = [122, 148, 20]; // #7A9414 lime on light bg
export const CARBON: RGB = [18, 18, 18]; // #121212 Negro Carbón
export const INK: RGB = [26, 26, 26];
export const GRAY_TEXT: RGB = [110, 116, 106];
export const IVORY: RGB = [245, 247, 241]; // #F5F7F1 Marfil Panel
export const IVORY_DEEP: RGB = [233, 237, 226];
export const RULE: RGB = [228, 231, 222];
export const HEADER_TOP: RGB = [6, 16, 3]; // #061003 Verde Profundo
export const HEADER_BOTTOM: RGB = [11, 18, 10]; // #0B120A
export const HEADER_MUTED: RGB = [173, 178, 168]; // white 60% on dark
export const NEGATIVE: RGB = [166, 72, 60];

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

export interface FontSet {
  family: string;
  semibold: string;
}

export async function registerFonts(doc: jsPDF): Promise<FontSet> {
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

export async function loadLogo(): Promise<string | null> {
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
export const money = (n: number) =>
  (n < 0 ? '-$' : '$') +
  Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function fmtDate(iso: string): string {
  if (!ISO_DATE.test(iso)) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const fmtToday = (d = new Date()) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const lastTableY = (doc: jsPDF) =>
  (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

// ── Header ────────────────────────────────────────────────────────────
export const HEADER_H = 58;

/**
 * Dark Verde Profundo gradient header with lime rule, pill label + date,
 * logo, white title, lime key phrase (auto-shrinks to fit) and a muted sub-line.
 */
export function drawBrandHeader(
  doc: jsPDF,
  F: FontSet,
  logo: string | null,
  opts: { margin: number; pill: string; title: string; highlight: string; subline: string; date?: Date },
): void {
  const pw = doc.internal.pageSize.getWidth();
  const { margin } = opts;
  const cw = pw - margin * 2;

  const headerH = HEADER_H;
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
  const pillText = `${opts.pill} · ${fmtToday(opts.date).toUpperCase()}`;
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

  // ---- Title: white + key phrase in lime
  doc.setFont(F.family, 'bold');
  doc.setFontSize(19);
  doc.setTextColor(255, 255, 255);
  doc.text(opts.title, margin, 34.5);
  let size = 19;
  doc.setFontSize(size);
  while (doc.getTextWidth(opts.highlight) > cw && size > 11) {
    size -= 1;
    doc.setFontSize(size);
  }
  doc.setTextColor(...LIME);
  doc.text(opts.highlight, margin, 43.5);

  // ---- Sub-line
  doc.setFont(F.family, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...HEADER_MUTED);
  doc.text(opts.subline, margin, 50.5);
}

// ── KPI cards (Marfil panels) ─────────────────────────────────────────
export interface Kpi {
  label: string;
  value: string;
  sub: string;
  color: RGB;
}

export const KPI_CARD_H = 24;

export function drawKpiCards(doc: jsPDF, F: FontSet, margin: number, y: number, kpis: Kpi[]): void {
  const cw = doc.internal.pageSize.getWidth() - margin * 2;
  const gap = 4;
  const cardW = (cw - gap * (kpis.length - 1)) / kpis.length;
  const cardH = KPI_CARD_H;
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
}

// ── Section title + table styling ─────────────────────────────────────
/** Lime bar + uppercase title with its baseline at y. Returns the y where content starts. */
export function drawSectionTitle(doc: jsPDF, F: FontSet, margin: number, y: number, title: string): number {
  doc.setFillColor(...LIME);
  doc.rect(margin, y - 3.4, 1.7, 4.6, 'F');
  doc.setFont(F.family, F.semibold);
  doc.setFontSize(9);
  doc.setTextColor(...CARBON);
  doc.text(title.toUpperCase(), margin + 4.2, y, { charSpace: 0.8 });
  return y + 4;
}

/** autoTable fontStyle for the semibold weight (falls back to bold with Helvetica). */
export const semibold = (F: FontSet) => (F.semibold === 'semibold' ? ('semibold' as 'bold') : 'bold');

/** Brand table look: carbon header with lime labels, marfil zebra rows. */
export function brandTableOptions(F: FontSet, margin: number): UserOptions {
  return {
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
      fontStyle: semibold(F),
      cellPadding: { top: 2.6, bottom: 2.6, left: 3, right: 3 },
    },
    alternateRowStyles: { fillColor: IVORY },
  };
}

type CellStyles = Record<string, unknown>;
export const subtotalStyles: CellStyles = { fillColor: IVORY_DEEP, fontStyle: 'bold', textColor: INK };
export const limeStyles: CellStyles = { fillColor: LIME, fontStyle: 'bold', textColor: CARBON };
export const styledRow = (cells: string[], styles: CellStyles): RowInput =>
  cells.map((content) => ({ content, styles }));

// ── Footer (every page) ───────────────────────────────────────────────
export function drawPageFooters(doc: jsPDF, F: FontSet, margin: number, runningHeader?: string): void {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    if (runningHeader && p > 1) {
      doc.setFillColor(...LIME);
      doc.rect(margin, 11.2, 1.4, 3.6, 'F');
      doc.setFont(F.family, F.semibold);
      doc.setFontSize(6.5);
      doc.setTextColor(...GRAY_TEXT);
      doc.text(runningHeader.toUpperCase(), margin + 3.4, 14, { charSpace: 0.6 });
    }
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
}
