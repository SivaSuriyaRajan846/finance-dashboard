import { formatMoney } from '../utils/format'

export function SummaryCards({ income, expense, balance }) {
  return (
    <div className="card-grid">
      <div className="stat-card balance">
        <div className="label">Net (in − out)</div>
        <div className="value">{formatMoney(balance)}</div>
      </div>
      <div className="stat-card income">
        <div className="label">Money in</div>
        <div className="value">{formatMoney(income)}</div>
      </div>
      <div className="stat-card expense">
        <div className="label">Money out</div>
        <div className="value">{formatMoney(expense)}</div>
      </div>
    </div>
  )
}
