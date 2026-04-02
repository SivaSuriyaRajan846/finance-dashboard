import { formatMoney } from '../utils/format'

function monthLabel(key) {
  if (!key) return ''
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
}

export function InsightsSection({ insights, summary }) {
  const { topCategory, comparison, avgExpense, transactionCount } = insights

  return (
    <section className="section" aria-labelledby="insights-heading">
      <h2 id="insights-heading" className="section-title">
        Insights
      </h2>
      <div className="panel">
        <ul className="insights-list">
          <li>
            {topCategory ? (
              <>
                Highest spending category is <strong>{topCategory.category}</strong> at{' '}
                <strong>{formatMoney(topCategory.amount)}</strong> across all expenses.
              </>
            ) : (
              <>No expense categories yet — add some expenses to see a leader.</>
            )}
          </li>
          <li>
            {comparison && comparison.pct != null ? (
              <>
                Net cashflow for {monthLabel(comparison.labelLast)} is{' '}
                <strong>{formatMoney(comparison.lastNet)}</strong>, versus{' '}
                <strong>{formatMoney(comparison.prevNet)}</strong> in{' '}
                {monthLabel(comparison.labelPrev)} (
                {comparison.pct >= 0 ? 'up' : 'down'}{' '}
                <strong>{Math.abs(comparison.pct).toFixed(0)}%</strong> vs previous month).
              </>
            ) : comparison ? (
              <>
                Compare months: {monthLabel(comparison.labelLast)} net{' '}
                <strong>{formatMoney(comparison.lastNet)}</strong>,{' '}
                {monthLabel(comparison.labelPrev)} net{' '}
                <strong>{formatMoney(comparison.prevNet)}</strong>.
              </>
            ) : (
              <>Need at least two months of data for a clean month-to-month comparison.</>
            )}
          </li>
          <li>
            Average expense line item is <strong>{formatMoney(avgExpense)}</strong> across{' '}
            <strong>{transactionCount}</strong> recorded line{transactionCount === 1 ? '' : 's'}.
            Overall net position: <strong>{formatMoney(summary.balance)}</strong>.
          </li>
        </ul>
      </div>
    </section>
  )
}
