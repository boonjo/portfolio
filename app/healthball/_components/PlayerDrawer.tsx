'use client'
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Player, PlayerDetail, RiskLevel } from './types'
import { RiskGauge } from './RiskGauge'
import { InjuryTimeline } from './InjuryTimeline'
import { ScoreHistoryChart, HistoryPoint } from './ScoreHistoryChart'

type Props = {
  player: Player | null
  onClose: () => void
}

// Mirrors POSITION_MULTIPLIERS in train.py — update both if formula changes.
const POSITION_MULTS: Record<string, [number, number]> = {
  GK:   [0.55, 0.65], CB: [0.85, 0.85], FB: [1.20, 1.10], WB: [1.25, 1.20],
  CM:   [1.00, 1.00], AM: [1.00, 1.00], IW: [1.20, 1.15], WF: [1.10, 1.00],
  Wide: [1.30, 1.15], CF: [1.15, 1.00],
}

const BAR_COLOR: Record<RiskLevel, string> = {
  low:    'bg-emerald-500',
  medium: 'bg-amber-400',
  high:   'bg-red-500',
}

type BreakdownRow = { label: string; pts: number }

// Mirrors score_formula() in train.py — update both if formula changes.
function computeBreakdown(f: Record<string, number | string>): BreakdownRow[] {
  // Safe numeric read — returns 0 for missing/null/NaN features (e.g. stale DB rows).
  const n = (key: string): number => { const v = Number(f[key]); return isNaN(v) ? 0 : v }
  const pg = String(f.position_group ?? 'CM')
  const [sm, wm] = POSITION_MULTS[pg] ?? [1.0, 1.0]
  const age = n('age')
  let agePts = 0
  if (age >= 32) agePts = 18
  else if (age >= 30) agePts = 10
  else if (age >= 28) agePts = 5
  return [
    { label: 'Currently injured', pts: n('currently_injured') * 12 },
    { label: 'Age',               pts: agePts },
    { label: 'Early debut',       pts: Math.min(Math.max(0, 19 - n('debut_age')) * 1.5, 4.5) },
    { label: 'Career mileage',    pts: Math.min(n('career_apps') / 430 * 5, 5) },
    { label: 'Workload',          pts: Math.min(Math.max(0, n('recent_minutes') - 6000) * 0.002 * wm, 6) },
    { label: 'Injury count',      pts: Math.min(n('total_injuries') * 4, 20) },
    { label: 'Severity',          pts: n('severity_score') * sm },
    { label: 'Avg days out',      pts: Math.min(n('avg_days_out') / 5, 10) },
    { label: 'Recent injuries',   pts: Math.min(n('recent_injuries') * 6, 18) },
    { label: 'Recency',           pts: Math.min(n('days_since_last') / 365 * 12, 12) },
  ].sort((a, b) => b.pts - a.pts)
}

export function PlayerDrawer({ player, onClose }: Props) {
  const [detail, setDetail] = useState<PlayerDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HistoryPoint[]>([])
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    if (!player) {
      setDetail(null)
      setHistory([])
      return
    }
    setLoading(true)
    setFetchError(false)
    Promise.all([
      fetch(`/api/healthball/players/${player.player_id}`).then((r) => r.json()),
      fetch(`/api/healthball/players/${player.player_id}/history`).then((r) => r.json()),
    ])
      .then(([d, h]) => {
        setDetail(d)
        setHistory(Array.isArray(h) ? h : [])
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }, [player])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const features = detail?.features

  return (
    <AnimatePresence>
      {player && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-xl dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                    {player.name}
                  </h2>
                  {player.currently_injured && (
                    <span className="rounded-full border bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide leading-none">
                      Injured
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {player.position} · {player.age}y · {player.nationality}
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-0.5 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-8 px-6 py-6">
              {/* Gauge */}
              <div className="flex justify-center">
                <RiskGauge score={player.risk_score} level={player.risk_level} size={180} />
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                  ))}
                </div>
              ) : fetchError ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
                  Failed to load player data.
                </p>
              ) : detail && (
                <>
                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <Stat label="Injuries" value={String(detail.injuries.length)}
                      tooltip="Total number of injuries recorded across the player's career." />
                    <Stat label="Days out" value={String(
                      detail.injuries.reduce((s, i) => s + (i.days_out ?? 0), 0)
                    )} tooltip="Total days missed due to injury across the player's career." />
                    <Stat label="Games missed" value={String(
                      detail.injuries.reduce((s, i) => s + (i.games_missed ?? 0), 0)
                    )} tooltip="Total matches missed due to injury across the player's career." />
                    {features && (
                      <>
                        <Stat label="Recent (2yr)" value={String(features.recent_injuries ?? '—')}
                          tooltip="Number of injuries recorded in the last two seasons — a key predictor of near-term risk." />
                        <Stat label="Severity" value={(() => {
                          const v = Number(features.severity_score)
                          return isNaN(v) ? '—' : String(Math.round(v * 10) / 10)
                        })()} tooltip="Weighted injury severity (0–10). Ligament and ACL injuries score highest; minor muscle strains score lowest." />
                        <Stat label="Avg days/inj" value={(() => {
                          const v = Number(features.avg_days_out)
                          return isNaN(v) || v === 0 ? '—' : String(Math.round(v))
                        })()} tooltip="Average days missed per injury. Higher values indicate more serious injuries on average." />
                        <Stat label="Career apps" value={String(features.career_apps ?? '—')}
                          tooltip="Total career appearances played. High mileage over many seasons raises long-term wear risk." />
                        <Stat label="Debut age" value={features.debut_age != null ? String(features.debut_age) : '—'}
                          tooltip="Age at first professional appearance. Players who debut very young accumulate more physical load early in life." />
                        <Stat label="Recent mins" value={String(features.recent_minutes ?? '—')}
                          tooltip="Minutes played in the last two seasons. Very high minutes signals heavy workload and increased fatigue risk." />
                      </>
                    )}
                  </div>

                  {/* Score history */}
                  {history.length >= 2 && (
                    <ScoreHistoryChart history={history} currentLevel={player.risk_level} />
                  )}

                  {/* Score breakdown */}
                  {features && (() => {
                    const rows = computeBreakdown(features)
                    const rawTotal = rows.reduce((s, r) => s + r.pts, 0)
                    const capped = rawTotal > 100.5
                    // Bars normalise against the raw (uncapped) total so they
                    // always fill the full width when summed, regardless of capping.
                    const barDenominator = Math.max(rawTotal, 1)
                    return (
                      <div>
                        <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Score breakdown
                        </h3>
                        <div className="space-y-3">
                          {rows.map(({ label, pts }) => {
                            const pct = Math.min((pts / barDenominator) * 100, 100)
                            const isZero = pts < 0.05
                            return (
                              <div key={label} className={isZero ? 'opacity-30' : ''}>
                                <div className="flex items-baseline justify-between mb-1">
                                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
                                  <span className="text-xs font-mono tabular-nums text-zinc-700 dark:text-zinc-300">
                                    {pts.toFixed(1)}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${BAR_COLOR[player.risk_level]}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="mt-3 flex items-baseline justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            {capped ? 'Raw total (capped at 100)' : 'Total'}
                          </span>
                          <span className="text-xs font-mono tabular-nums font-medium text-zinc-700 dark:text-zinc-300">
                            {rawTotal.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Injury timeline */}
                  <div>
                    <h3 className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Injury History
                    </h3>
                    <InjuryTimeline injuries={detail.injuries} />
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Stat({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) {
  const [hovered, setHovered] = useState(false)
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center')
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (ref.current) {
      const { left, width } = ref.current.getBoundingClientRect()
      const centerX = left + width / 2
      const tooltipHalfW = 80 // half of w-40 (160px)
      if (centerX - tooltipHalfW < 8) setAlign('left')
      else if (centerX + tooltipHalfW > window.innerWidth - 8) setAlign('right')
      else setAlign('center')
    }
    setHovered(true)
  }

  const tooltipClass = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
  const caretClass  = align === 'left' ? 'left-3' : align === 'right' ? 'right-3' : 'left-1/2 -translate-x-1/2'

  return (
    <div
      ref={ref}
      className="relative rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-3 py-3 text-center cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      {tooltip && hovered && (
        <div className={`absolute bottom-full ${tooltipClass} mb-2 z-10 w-40 rounded-lg bg-zinc-800 dark:bg-zinc-700 px-2.5 py-1.5 text-[10px] text-zinc-100 leading-snug shadow-lg pointer-events-none`}>
          {tooltip}
          <div className={`absolute top-full ${caretClass} border-[3px] border-transparent border-t-zinc-800 dark:border-t-zinc-700`} />
        </div>
      )}
      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  )
}
