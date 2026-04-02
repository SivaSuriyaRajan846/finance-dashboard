# Finance Dashboard (Zorovyn assignment)

A small React dashboard for viewing income, expenses, and spending patterns. Everything runs in the browser with mock data — no API.

## How to run

You need Node.js 18+ (or any version that works with Vite 6).

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

## What I built

- **Overview**: Total balance (net), total income, total expenses.
- **Charts**: Cumulative balance by month (SVG line) and horizontal bars for spending by category (CSS).
- **Transactions**: Table with date, category, type, amount, note. Search, category filter, type filter, and column sorting.
- **Roles**: Dropdown switches between **viewer** (read-only) and **admin** (add / edit / delete). No server — it is only UI behavior.
- **Insights**: Highest spending category, month-to-month net comparison when there are two months of data, average expense size, and overall net position.
- **State**: `useReducer` + React Context for transactions, filters, sort, role, and theme.
- **Persistence**: Transactions, role, and theme are saved to `localStorage` so a refresh keeps your demo edits.
- **Extras**: Light/dark theme, CSV export of the **currently visible** (filtered) rows, “Reset sample data” to restore the seed list.

## Project layout

- `src/context/FinanceContext.jsx` — global state and persistence side effects
- `src/utils/derive.js` — pure helpers for summaries, filters, charts, insights
- `src/components/` — UI pieces (cards, charts, table, modal)
- `src/data/mockData.js` — starting transactions and category list
- `src/App.css` — plain CSS (variables for theming, no Tailwind)

## Notes

- Currency is formatted in **INR** (`en-IN`) to match a typical India-based demo; you can change `format.js` if you prefer USD.
- This is intentionally simple: readable files, no chart library, SVG + CSS for visuals.
