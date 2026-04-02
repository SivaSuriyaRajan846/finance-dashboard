import { formatMoney } from '../utils/format'

export function SummaryCards({ income, expense, balance }) {
  return (
    <div className="card-grid">
      <div className="stat-card balance">
        <div className="label">Total balance (net)</div>
        <div className="value">{formatMoney(balance)}</div>
      </div>
      <div className="stat-card income">
        <div className="label">Income</div>
        <div className="value">{formatMoney(income)}</div>
      </div>
      <div className="stat-card expense">
        <div className="label">Expenses</div>
        <div className="value">{formatMoney(expense)}</div>
      </div>
    </div>
  )
}
