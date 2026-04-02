import { formatMoney } from '../utils/format'

export function SpendingBreakdown({ rows, total }) {
  if (!rows.length || total <= 0) {
    return (
      <div className="panel">
        <h3>Spending by category</h3>
        <p className="empty-state" style={{ padding: '1rem' }}>
          No expense entries to chart.
        </p>
      </div>
    )
  }

  return (
    <div className="panel">
      <h3>Spending by category</h3>
      <div className="category-bars">
        {rows.map((r) => {
          const pct = total > 0 ? Math.round((r.amount / total) * 100) : 0
          const barPct = total > 0 ? (r.amount / total) * 100 : 0
          return (
            <div key={r.category} className="cat-row">
              <span className="cat-name" title={r.category}>
                {r.category}
              </span>
              <div className="cat-track">
                <div className="cat-fill" style={{ width: `${barPct}%` }} />
              </div>
              <span className="cat-pct">{formatMoney(r.amount)} · {pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
