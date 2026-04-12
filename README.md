# Smash Vision - Financial System

Internal financial dashboard for **Smash Vision**, a company that installs camera recording systems in padel clubs across Mexico and Colombia. Built with React 19, TypeScript, and Supabase.

## Features

- **Dashboard**: Cash balance card (all-time, unaffected by filters), KPI cards (income, expenses, net profit, withdrawals), monthly income vs expense bar chart, net profit trend line, income by club donut chart, expenses by category donut chart, and recent transactions table. Includes a comprehensive filter bar with year quick-select buttons (All Time, 2026, 2025, 2024), transaction type, club, category, person, and custom date range filters. All charts and KPIs update dynamically based on the active filters
- **Transactions**: Full CRUD operations (create, read, update, delete) with filters by type, club, person, category, date range, and description search. Sortable columns and pagination. **Multi-club split**: when creating a transaction, select multiple clubs and assign a custom percentage to each club (defaults are calculated proportionally by camera count). The form validates that percentages sum to 100% before allowing submission
- **Clubs**: Financial summary cards per club showing income, expenses, net profit, and transaction count. Each club has a `number_cameras` field used to calculate proportional expense splits
- **People**: Team members and investors overview with expenses, reimbursements, withdrawals, gap contributions, and owed balance
- **ROI Calculator**: Standalone tool to estimate return on investment for potential new clubs. Inputs include camera count, hardware costs (cameras, switch, PC), itemized installation costs, contract dates with grace period support, monthly costs per camera (Cloudflare, AWS, etc.), monthly revenue per camera, and initial club contributions. Shows KPI summary cards, monthly cashflow projection table, and exports a professional PDF report with the Smash Vision logo
- **Multi-currency**: Records can be stored in USD, MXN, or COP with exchange rate tracking. Historical records preserved in USD

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS (custom dark theme) |
| Charts | Recharts |
| Data | Supabase (PostgreSQL) |
| State | TanStack Query (React Query) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| PDF Export | jsPDF + jspdf-autotable |
| Routing | React Router v6 |

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Black | `#0F0F0F` | Background |
| Dark | `#1A1A1A` | Cards, sidebar |
| Lime | `#AAFF00` | Primary accent, income |
| White | `#FFFFFF` | Text |
| Gray | `#9CA3AF` | Secondary text |

## Database Schema

The system uses a dedicated `finance` schema in PostgreSQL (separate from the `public` schema used by the recordingSystem):

- **`finance.clubs`**: Padel clubs with `number_cameras` field (Padel Nation: 2, Smash Padel: 2, Padeling Pance: 4, Prime Padel: 2)
- **`finance.people`**: Team members and investors
- **`finance.categories`**: Expense and income categories
- **`finance.transactions`**: All financial records with multi-currency support

### Proportional Expense Splitting

When a transaction applies to multiple clubs, the user can assign a custom percentage to each club. The default percentages are calculated proportionally based on each club's `number_cameras` relative to the total cameras of the selected clubs (e.g., Smash Padel with 2 cameras and Padeling Pance with 4 cameras default to 33.33% and 66.67% respectively). Users can override these defaults with any values as long as they sum to 100%. Each split creates a separate transaction row tied to its respective club, with a note indicating the shared expense. Rounding remainders are assigned to the last club to preserve exact totals.

### Transaction Types

| Type | Description | Affects Profit? | Affects Cash? |
|------|-------------|:-:|:-:|
| `expense` | Money spent on the business (materials, services, installation, etc.). Tracked per person — can be a personal expense (founder/investor paid) or a company expense (Smash Vision paid) | Yes | Only if person = Smash Vision |
| `income` | Revenue received from clubs for camera services | Yes | Yes |
| `withdrawal` | Founders taking money out of the company. This is a profit distribution, not a business cost | No | Yes |
| `reimbursement` | Company paying back a person who already covered an expense. The cost was already recorded as an `expense`, so the reimbursement is only a cash movement | No | Yes |
| `gap_contribution` | Founders injecting personal money to cover a cash shortfall. This is a capital contribution, not revenue | No | Yes |

### Financial Calculations

**Net Profit/Loss** = `Income − Expenses`

Only income and expenses affect profitability. Withdrawals, reimbursements, and gap contributions are cash flow events that don't change how profitable the business is:
- A reimbursement pays back a personal expense already counted → subtracting it again would double-count the cost
- A withdrawal is a founder taking earned profit out → it's a distribution, not a cost
- A gap contribution is a founder covering a cash shortfall → it's capital, not revenue

**Cash Balance** = `Income + Gap Contributions − Company Expenses − Withdrawals − Reimbursements`

The cash balance tracks actual money in the company account. Key distinction: only expenses made **by Smash Vision** (the company entity, `person.role = 'company'`) affect cash. Personal expenses by founders or investors were paid from their own pockets and don't reduce the company's cash — unless a reimbursement is issued.

| Event | Profit impact | Cash impact |
|-------|:---:|:---:|
| Club pays $500 for camera service (income) | +$500 | +$500 |
| Smash Vision pays $100 for AWS (company expense) | −$100 | −$100 |
| César pays $50 for Ubers from his pocket (personal expense) | −$50 | — |
| Company reimburses César $50 for the Ubers | — | −$50 |
| César withdraws $200 profit | — | −$200 |
| Tomás contributes $30 to cover a cash gap | — | +$30 |

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/smashvisionreplays/smashVision_financialSystem.git
cd smashVision_financialSystem
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

Copy the environment example and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project URL and anon key (same project as the recordingSystem):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set up the database

Go to your Supabase project's **SQL Editor** and run the SQL files in order:

0. `sql/000_cleanup_public.sql` - *(Optional)* Removes old `finance_` prefixed tables from the public schema
1. `sql/001_schema.sql` - Creates the `finance` schema, tables, indexes, triggers, and RLS policies
2. `sql/002_seed_clubs.sql` - Inserts the 4 clubs
3. `sql/003_seed_people.sql` - Inserts team members and investors
4. `sql/004_seed_categories.sql` - Inserts expense and income categories
5. `sql/005_seed_transactions_2024.sql` - Historical data from 2024
6. `sql/006_seed_transactions_2025.sql` - Historical data from 2025
7. `sql/007_seed_transactions_2026.sql` - Historical data from 2026

### 5. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, Layout wrapper
│   ├── dashboard/       # KPI cards, charts, filters
│   ├── transactions/    # Table, filters, modal form
│   ├── clubs/           # Club summary cards
│   ├── people/          # People summary cards
│   └── ui/              # Reusable UI (ConfirmDialog)
├── hooks/               # React Query hooks for Supabase
├── lib/                 # Supabase client, formatters
├── pages/               # Dashboard, Transactions, Clubs, People, ROI Calculator
├── types/               # TypeScript interfaces
├── App.tsx              # Router and providers
└── main.tsx             # Entry point
```

## Deployment (Vercel)

This is a static Vite app — no backend needed. Deploy to Vercel in minutes:

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo `smashvisionreplays/smashVision_financialSystem`
2. Vercel auto-detects Vite. Confirm settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   ```
   VITE_SUPABASE_URL      → your Supabase project URL
   VITE_SUPABASE_ANON_KEY → your Supabase anon key
   ```
4. Click **Deploy**. Every push to `main` auto-deploys.

> Supabase note: make sure the `finance` schema is listed under **Settings → API → Exposed schemas** in your Supabase project.

## Historical Data

All financial records from 2024-2026 have been migrated from Excel spreadsheets into the database. Records without exact dates use the 1st of the month. All historical amounts are stored in USD. Shared expenses are split proportionally by camera count (not equally).

---

Built for Smash Vision's internal team.
