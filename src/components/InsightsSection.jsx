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
        Quick reads
      </h2>
      <div className="panel">
        <ul className="insights-list">
          <li>
            {topCategory ? (
              <>
                The biggest sink so far is <strong>{topCategory.category}</strong> (
                <strong>{formatMoney(topCategory.amount)}</strong> across expenses).
              </>
            ) : (
              <>Once you log a few expenses, the heaviest category will show up here.</>
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
              <>Need two different months in the data before a fair side-by-side.</>
            )}
          </li>
          <li>
            Rough average per expense row: <strong>{formatMoney(avgExpense)}</strong> (
            <strong>{transactionCount}</strong> line{transactionCount === 1 ? '' : 's'} total). Net
            after everything: <strong>{formatMoney(summary.balance)}</strong>.
          </li>
        </ul>
      </div>
    </section>
  )
}
