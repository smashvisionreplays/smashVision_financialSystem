# CLAUDE.md — Smash Vision Financial System

Context file for Claude Code. Read this before exploring the codebase.

## Stack
React 19 + TypeScript + Vite + Tailwind CSS + Supabase + Recharts + TanStack Query v5 + React Router v7 + jsPDF

## Key conventions
- All Tailwind colors are prefixed `sv-` (sv-black, sv-dark, sv-gray, sv-gray-light, sv-gray-text, sv-lime, sv-lime-dark, sv-white). Never use raw Tailwind color classes.
- Supabase client uses `db: { schema: 'finance' }` — table names are clean (`clubs`, `people`, `categories`, `transactions`), no schema prefix needed in queries.
- TanStack Query keys: `['transactions', filters]`, `['clubs']`, `['people']`, `['categories']`
- All monetary values stored as `usd_amount` (number). Multi-currency: `original_amount + original_currency + exchange_rate + usd_amount`.
- Formatters live in `src/lib/formatters.ts` — use `formatCurrency`, `formatDate`, `transactionTypeLabels`, `transactionTypeColors`.

## File map
```
src/
├── pages/          Dashboard.tsx, Transactions.tsx, Clubs.tsx, People.tsx, RoiCalculator.tsx, Settings.tsx
├── components/
│   ├── layout/     Sidebar.tsx, Layout.tsx
│   ├── transactions/ TransactionModal.tsx, TransactionFilters.tsx, TransactionTable.tsx
│   ├── dashboard/  (KPI cards, charts, filters)
│   └── ui/         ConfirmDialog.tsx
├── hooks/          useTransactions.ts, useClubs.ts, usePeople.ts, useCategories.ts
├── lib/            supabase.ts, formatters.ts
└── types/          index.ts
public/             logo.png, favicon.svg
sql/                001–007 schema + seed files
```

## Database schema (finance.*)
- `clubs`: id, name, country, city, status, number_cameras, created_at
- `people`: id, name, role ('founder'|'investor'|'collaborator'|'company'), created_at
- `categories`: id, name, type ('expense'|'income'|'both')
- `transactions`: id, date, type, original_amount, original_currency, exchange_rate, usd_amount, description, notes, club_id, person_id, category_id, created_at, updated_at

## Multi-club splitting
`TransactionFormData` has `club_ids: string[]` and `club_percentages: Record<string, number>`.
These are NOT columns in the DB — `useCreateTransaction` strips them before insert and creates one row per club.
- Default percentages = proportional to `club.number_cameras`
- User can override percentages; must sum to 100%
- Single club or no club → one row, same logic as before

## Transaction types & financial logic
- `expense` + `person.role === 'company'` → affects cash
- `expense` (personal) → affects profit only
- `income` → affects both
- `withdrawal` / `reimbursement` → cash only, not profit
- `gap_contribution` → cash only (capital injection)

## ROI Calculator
Page at `/roi`. Inputs: club name, camera cost, # cameras, switch, PC, installation items (dynamic list), contract start date, billing start date, contract months, monthly cost items per camera (× num cameras), monthly revenue per camera, initial club contributions (dynamic list).
Proration: all months = 30 days. Partial first/last billing months prorated by day.
- PDF export/import lives in `src/lib/roiPdf.ts` (brand-styled layout per SmashVision_IdentidadDeMarca_2026: dark gradient header, lime #C5F02B accents, marfil #F5F7F1 panels, Poppins fonts loaded from `public/fonts/`).
- Exported PDFs embed the form inputs as `SVROI1:<base64 JSON>` in PDF keywords metadata → lossless re-import via the Import PDF button. Legacy (pre-redesign, Helvetica) PDFs are parsed from their plain text streams as a fallback.
- Inputs persist in localStorage under `sv-roi-calculator`; Clear button resets form + storage (ConfirmDialog accepts optional `confirmLabel`).

## Settings panel
Page at `/settings` (tabs: Clubs / Categories / People / System). Full CRUD for clubs, categories and people via mutations in `useClubs.ts` / `useCategories.ts` / `usePeople.ts` (each invalidates its own key + `['transactions']` to refresh joins). Transaction types and currencies are shown read-only — they are fixed by DB CHECK constraints and hardcoded financial logic. Deleting a referenced entity leaves transactions intact (FK `ON DELETE SET NULL`); ConfirmDialog shows the reference count.

## Clubs (camera counts, editable in /settings)
- Padeling Pance: 4 cameras
- Smash Padel: 2 cameras
- Padel Nation: 2 cameras (inactive)
- Prime Padel: 2 cameras

## Env vars needed
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Git / deploy
- Repo: https://github.com/smashvisionreplays/smashVision_financialSystem
- Branch: main
- Deployed on Vercel (auto-deploy on push to main)
- Build: `npm run build` → output `dist/`
- Excel source files (2024–2026) excluded from git via .gitignore
