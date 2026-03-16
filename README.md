# Smash Vision - Financial System

Internal financial dashboard for **Smash Vision**, a company that installs camera recording systems in padel clubs across Mexico and Colombia. Built with React 19, TypeScript, and Supabase.

## Features

- **Dashboard**: KPI cards (income, expenses, net profit, withdrawals), monthly income vs expense bar chart, net profit trend line, income by club donut chart, expenses by category donut chart, recent transactions table
- **Transactions**: Full CRUD operations (create, read, update, delete) with filters by type, club, person, category, date range, and description search. Sortable columns and pagination
- **Clubs**: Financial summary cards per club showing income, expenses, net profit, and transaction count
- **People**: Team members and investors overview with expenses, reimbursements, withdrawals, gap contributions, and owed balance
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

- **`finance.clubs`**: Padel clubs (Padel Nation, Smash Padel, Padeling Pance, Prime Padel)
- **`finance.people`**: Team members and investors
- **`finance.categories`**: Expense and income categories
- **`finance.transactions`**: All financial records with multi-currency support

### Transaction Types
- `expense` - Money spent (materials, services, installation, etc.)
- `income` - Money received from clubs
- `withdrawal` - Founder withdrawals
- `reimbursement` - Paying back investors/team for their expenses
- `gap_contribution` - Contributions to cover accounting gaps

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
│   ├── dashboard/       # KPI cards, charts
│   ├── transactions/    # Table, filters, modal form
│   ├── clubs/           # Club summary cards
│   ├── people/          # People summary cards
│   └── ui/              # Reusable UI (ConfirmDialog)
├── hooks/               # React Query hooks for Supabase
├── lib/                 # Supabase client, formatters
├── pages/               # Dashboard, Transactions, Clubs, People
├── types/               # TypeScript interfaces
├── App.tsx              # Router and providers
└── main.tsx             # Entry point
```

## Historical Data

All financial records from 2024-2026 have been migrated from Excel spreadsheets into the database. Records without exact dates use the 1st of the month. All historical amounts are stored in USD.

---

Built for Smash Vision's internal team.
