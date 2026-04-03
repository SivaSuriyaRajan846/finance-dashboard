import { formatMoney } from '../utils/format'

export function BalanceTrend({ points }) {
  if (!points.length) {
    return (
      <div className="panel">
        <h3>Running balance by month</h3>
        <p className="empty-state" style={{ padding: '1rem' }}>
          Not enough data for a trend yet.
        </p>
      </div>
    )
  }

  const balances = points.map((p) => p.balance)
  const minB = Math.min(...balances, 0)
  const maxB = Math.max(...balances, 0)
  const pad = Math.max((maxB - minB) * 0.08, 1)
  const yMin = minB - pad
  const yMax = maxB + pad
  const yRange = yMax - yMin || 1

  const w = 480
  const h = 200
  const padL = 44
  const padR = 12
  const padT = 16
  const padB = 36
  const innerW = w - padL - padR
  const innerH = h - padT - padB

  const n = points.length
  const pathD = points
    .map((p, i) => {
      const x = padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
      const yNorm = (p.balance - yMin) / yRange
      const y = padT + innerH - yNorm * innerH
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  const last = points[points.length - 1]

  return (
    <div className="panel">
      <h3>Running balance by month</h3>
      <div className="trend-svg-wrap">
        <svg
          className="trend-svg"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--chart1)" />
              <stop offset="100%" stopColor="var(--chart2)" />
            </linearGradient>
          </defs>
          <line
            x1={padL}
            y1={padT + innerH}
            x2={w - padR}
            y2={padT + innerH}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p, i) => {
            const x = padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
            const yNorm = (p.balance - yMin) / yRange
            const y = padT + innerH - yNorm * innerH
            return (
              <circle
                key={p.key}
                cx={x}
                cy={y}
                r="4"
                fill="var(--surface)"
                stroke="var(--chart1)"
                strokeWidth="2"
              />
            )
          })}
          {points.map((p, i) => {
            const x = padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
            return (
              <text
                key={`label-${p.key}`}
                x={x}
                y={h - 8}
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="11"
              >
                {p.label}
              </text>
            )
          })}
        </svg>
      </div>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
        Where the line lands: <strong style={{ color: 'var(--text)' }}>{formatMoney(last.balance)}</strong>
      </p>
    </div>
  )
}
