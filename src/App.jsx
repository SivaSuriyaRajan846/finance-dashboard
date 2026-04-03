import { useMemo } from 'react'
import { FinanceProvider, useFinance } from './context/FinanceContext'
import { SummaryCards } from './components/SummaryCards'
import { BalanceTrend } from './components/BalanceTrend'
import { SpendingBreakdown } from './components/SpendingBreakdown'
import { TransactionsSection } from './components/TransactionsSection'
import { InsightsSection } from './components/InsightsSection'
import { useFilteredTransactions } from './hooks/useFilteredTransactions'
import {
  balanceTrendPoints,
  buildInsights,
  computeSummary,
  spendingByCategory,
} from './utils/derive'
import './App.css'

function AppShell() {
  const { state, dispatch } = useFinance()
  const filteredRows = useFilteredTransactions()

  const summary = useMemo(
    () => computeSummary(state.transactions),
    [state.transactions],
  )

  const trendPoints = useMemo(
    () => balanceTrendPoints(state.transactions),
    [state.transactions],
  )

  const spending = useMemo(
    () => spendingByCategory(state.transactions),
    [state.transactions],
  )

  const insights = useMemo(
    () => buildInsights(state.transactions),
    [state.transactions],
  )

  return (
    <div className="app">
      <div className="app-inner">
        <header className="app-header">
          <div className="app-title-block">
            {/* <p className="kicker">Zorovyn · front-end exercise</p> */}
            <h1>Finance Dashboard</h1>
            <p>
              A pretend ledger so you can poke at charts and filters without wiring a server. I
              reached for React plus handwritten CSS — no UI kit, no chart library — because I
              wanted the bundle and the look to stay mine.
            </p>
          </div>
          <div className="header-actions">
            <div className="select-wrap">
              <span className="field-label" id="role-label">
                Role
              </span>
              <select
                aria-labelledby="role-label"
                value={state.role}
                onChange={(e) =>
                  dispatch({ type: 'SET_ROLE', payload: e.target.value })
                }
              >
                <option value="viewer">Viewer (read-only)</option>
                <option value="admin">Admin (edit data)</option>
              </select>
            </div>
            <div className="select-wrap">
              <span className="field-label" id="theme-label">
                Theme
              </span>
              <select
                aria-labelledby="theme-label"
                value={state.theme}
                onChange={(e) =>
                  dispatch({ type: 'SET_THEME', payload: e.target.value })
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                if (window.confirm('Reset all transactions to the built-in sample list?')) {
                  dispatch({ type: 'RESET_TO_SAMPLE' })
                }
              }}
            >
              Reset sample data
            </button>
          </div>
        </header>

        {state.role === 'viewer' && (
          <p
            style={{
              margin: '0 0 1rem',
              padding: '0.65rem 0.85rem',
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: 'var(--muted)',
            }}
          >
            You are in <strong style={{ color: 'var(--text)' }}>viewer</strong> mode: look around,
            export CSV if you like. Flip the role to admin above when you want to add or edit rows
            (it is all fake data living in your browser).
          </p>
        )}

        <section className="section" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="section-title">
            At a glance
          </h2>
          <SummaryCards
            income={summary.income}
            expense={summary.expense}
            balance={summary.balance}
          />
        </section>

        <section className="section">
          <div className="charts-row">
            <BalanceTrend points={trendPoints} />
            <SpendingBreakdown rows={spending.rows} total={spending.total} />
          </div>
        </section>

        <TransactionsSection filteredRows={filteredRows} />

        <InsightsSection insights={insights} summary={summary} />

        {/* <footer style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
          <p style={{ margin: 0 }}>
            State sits in React context and survives refresh via{' '}
            <code style={{ fontSize: '0.8rem' }}>localStorage</code> — same machine, same browser,
            nothing leaves your laptop.
          </p>
        </footer> */}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <FinanceProvider>
      <AppShell />
    </FinanceProvider>
  )
}
