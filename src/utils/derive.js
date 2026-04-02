import { monthKey } from './format'

export function computeSummary(transactions) {
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (t.type === 'income') income += Number(t.amount) || 0
    else expense += Number(t.amount) || 0
  }
  return {
    income,
    expense,
    balance: income - expense,
  }
}

export function filterAndSort(transactions, search, categoryFilter, typeFilter, sortBy, sortDir) {
  let list = [...transactions]
  const q = search.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (t) =>
        (t.note && t.note.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        String(t.amount).includes(q),
    )
  }
  if (categoryFilter !== 'all') {
    list = list.filter((t) => t.category === categoryFilter)
  }
  if (typeFilter !== 'all') {
    list = list.filter((t) => t.type === typeFilter)
  }

  const dir = sortDir === 'asc' ? 1 : -1
  list.sort((a, b) => {
    if (sortBy === 'date') {
      const da = new Date(a.date).getTime()
      const db = new Date(b.date).getTime()
      return (da - db) * dir
    }
    if (sortBy === 'amount') {
      return ((Number(a.amount) || 0) - (Number(b.amount) || 0)) * dir
    }
    if (sortBy === 'category') {
      return String(a.category).localeCompare(String(b.category)) * dir
    }
    return 0
  })
  return list
}

/** Cumulative balance over time (sorted by date) */
export function balanceTrendPoints(transactions) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  )
  const byMonth = new Map()
  for (const t of sorted) {
    const key = monthKey(t.date)
    if (!key) continue
    const signed =
      t.type === 'income' ? Number(t.amount) || 0 : -(Number(t.amount) || 0)
    byMonth.set(key, (byMonth.get(key) || 0) + signed)
  }
  const keys = [...byMonth.keys()].sort()
  let cum = 0
  return keys.map((k) => {
    cum += byMonth.get(k)
    const [y, m] = k.split('-')
    const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-IN', {
      month: 'short',
      year: '2-digit',
    })
    return { key: k, label, balance: cum, monthNet: byMonth.get(k) }
  })
}

export function spendingByCategory(transactions) {
  const map = new Map()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    const c = t.category || 'Other'
    map.set(c, (map.get(c) || 0) + (Number(t.amount) || 0))
  }
  const rows = [...map.entries()].map(([category, amount]) => ({ category, amount }))
  rows.sort((a, b) => b.amount - a.amount)
  const total = rows.reduce((s, r) => s + r.amount, 0)
  return { rows, total }
}

export function monthlyTotals(transactions) {
  const income = new Map()
  const expense = new Map()
  for (const t of transactions) {
    const k = monthKey(t.date)
    if (!k) continue
    const n = Number(t.amount) || 0
    if (t.type === 'income') income.set(k, (income.get(k) || 0) + n)
    else expense.set(k, (expense.get(k) || 0) + n)
  }
  return { income, expense }
}

export function buildInsights(transactions) {
  const { rows } = spendingByCategory(transactions)
  const topCategory = rows.length ? rows[0] : null

  const keys = [...new Set(transactions.map((t) => monthKey(t.date)).filter(Boolean))].sort()
  const last = keys[keys.length - 1]
  const prev = keys[keys.length - 2]
  const { income, expense } = monthlyTotals(transactions)
  const lastNet =
    last != null ? (income.get(last) || 0) - (expense.get(last) || 0) : null
  const prevNet =
    prev != null ? (income.get(prev) || 0) - (expense.get(prev) || 0) : null

  let comparison = null
  if (last != null && prev != null && prevNet !== 0) {
    const pct = ((lastNet - prevNet) / Math.abs(prevNet)) * 100
    comparison = {
      labelLast: last,
      labelPrev: prev,
      lastNet,
      prevNet,
      pct,
    }
  } else if (last != null && prev != null) {
    comparison = { labelLast: last, labelPrev: prev, lastNet, prevNet, pct: null }
  }

  const avgExpense =
    transactions.filter((t) => t.type === 'expense').length > 0
      ? transactions
          .filter((t) => t.type === 'expense')
          .reduce((s, t) => s + (Number(t.amount) || 0), 0) /
        transactions.filter((t) => t.type === 'expense').length
      : 0

  return {
    topCategory,
    comparison,
    avgExpense,
    transactionCount: transactions.length,
  }
}
