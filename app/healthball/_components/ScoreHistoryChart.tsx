'use client'
import { RiskLevel } from './types'

export type HistoryPoint = {
  computed_at: string
  risk_score: number
  risk_level: RiskLevel
}

const STROKE: Record<RiskLevel, string> = {
  low:    '#10b981',
  medium: '#f59e0b',
  high:   '#ef4444',
}

type Props = {
  history: HistoryPoint[]
  currentLevel: RiskLevel
}

const W = 280
const H = 72
const PAD = { top: 6, right: 4, bottom: 18, left: 28 }

function fmt(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function ScoreHistoryChart({ history, currentLevel }: Props) {
  if (history.length < 2) return null

  const scores = history.map((h) => h.risk_score)
  const minY = Math.max(0, Math.min(...scores) - 5)
  const maxY = Math.min(100, Math.max(...scores) + 5)
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const toX = (i: number) => PAD.left + (i / (history.length - 1)) * innerW
  const toY = (v: number) => PAD.top + innerH - ((v - minY) / (maxY - minY)) * innerH

  const pathD = history
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(h.risk_score).toFixed(1)}`)
    .join(' ')

  // Area fill under the line
  const areaD =
    pathD +
    ` L ${toX(history.length - 1).toFixed(1)} ${(PAD.top + innerH).toFixed(1)}` +
    ` L ${toX(0).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`

  const stroke = STROKE[currentLevel]
  const first = history[0]
  const last = history[history.length - 1]

  // Y-axis tick values
  const yTicks = [minY, (minY + maxY) / 2, maxY].map(Math.round)

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Score history
      </h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        {/* Y-axis ticks */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={toY(v)}
              y2={toY(v)}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={1}
              className="text-zinc-900 dark:text-zinc-50"
            />
            <text
              x={PAD.left - 4}
              y={toY(v)}
              dominantBaseline="middle"
              textAnchor="end"
              fontSize={8}
              className="fill-zinc-400 dark:fill-zinc-500"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Risk level threshold lines */}
        {[20, 60].map((threshold) => {
          if (threshold < minY || threshold > maxY) return null
          return (
            <line
              key={threshold}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={toY(threshold)}
              y2={toY(threshold)}
              stroke={threshold === 60 ? '#ef4444' : '#f59e0b'}
              strokeOpacity={0.3}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )
        })}

        {/* Area */}
        <path d={areaD} fill={stroke} fillOpacity={0.08} />

        {/* Line */}
        <path d={pathD} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />

        {/* End dot */}
        <circle cx={toX(history.length - 1)} cy={toY(last.risk_score)} r={3} fill={stroke} />

        {/* X-axis labels: first and last date */}
        <text
          x={toX(0)}
          y={H - 2}
          textAnchor="start"
          fontSize={8}
          className="fill-zinc-400 dark:fill-zinc-500"
        >
          {fmt(first.computed_at)}
        </text>
        <text
          x={toX(history.length - 1)}
          y={H - 2}
          textAnchor="end"
          fontSize={8}
          className="fill-zinc-400 dark:fill-zinc-500"
        >
          {fmt(last.computed_at)}
        </text>
      </svg>
    </div>
  )
}
