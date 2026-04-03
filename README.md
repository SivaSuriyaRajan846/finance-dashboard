# Finance Dashboard (Zorvyn frontend take-home)

Small React page for poking at income, expenses, and category splits. Everything is mock data in the browser — no API.

I kept the stack boring on purpose: **Vite + React**, **plain CSS** (one main stylesheet), **SVG + div bars** for charts instead of pulling in a chart package. Easier to read in a review, and the bundle stays small.

## Run it

Node.js 18+ is fine (anything that runs Vite 6 works).

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## What is in here

- **At a glance**: Net position, money in, money out.
- **Charts**: Running balance by month (hand-drawn SVG line) and spending bars by category (CSS).
- **Line items**: Table with search, filters, sorting. **Viewer** is read-only; **Admin** can add/edit/delete — all simulated on the client.
- **Quick reads**: A few sentences derived from the data (top category, month vs month when possible, rough averages).
- **State**: `useReducer` + Context. **localStorage** keeps transactions, role, and theme across refresh.

Currency is **INR** with `en-IN` formatting — change `src/utils/format.js` if you want something else.

## Files worth opening first

- `src/App.jsx` — layout and copy
- `src/context/FinanceContext.jsx` — state + persistence
- `src/utils/derive.js` — numbers for summaries and insights
- `src/App.css` — layout and light/dark variables

---

*Rough edges are intentional trade-offs for a small demo — happy to walk through choices in discussion.*
