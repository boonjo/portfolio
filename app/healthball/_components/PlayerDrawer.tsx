'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Player, PlayerDetail } from './types'
import { RiskGauge } from './RiskGauge'
import { InjuryTimeline } from './InjuryTimeline'

type Props = {
  player: Player | null
  onClose: () => void
}

export function PlayerDrawer({ player, onClose }: Props) {
  const [detail, setDetail] = useState<PlayerDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!player) {
      setDetail(null)
      return
    }
    setLoading(true)
    fetch(`/api/healthball/players/${player.player_id}`)
      .then((r) => r.json())
      .then((d) => setDetail(d))
      .finally(() => setLoading(false))
  }, [player])

  // Close on Escape
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

              {/* Stats grid */}
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                  ))}
                </div>
              ) : detail && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <Stat label="Injuries" value={String(detail.injuries.length)} />
                    <Stat label="Days out" value={String(
                      detail.injuries.reduce((s, i) => s + (i.days_out ?? 0), 0)
                    )} />
                    <Stat label="Games missed" value={String(
                      detail.injuries.reduce((s, i) => s + (i.games_missed ?? 0), 0)
                    )} />
                    {features && (
                      <>
                        <Stat label="Recent (2yr)" value={String(features.recent_injuries ?? '—')} />
                        <Stat label="Severity" value={
                          features.severity_score != null
                            ? String(Math.round(features.severity_score * 10) / 10)
                            : '—'
                        } />
                        <Stat label="Avg days/inj" value={
                          features.avg_days_out
                            ? String(Math.round(features.avg_days_out))
                            : '—'
                        } />
                        <Stat label="Career apps" value={String(features.career_apps ?? '—')} />
                        <Stat label="Debut age" value={features.debut_age != null ? String(features.debut_age) : '—'} />
                        <Stat label="Recent mins" value={String(features.recent_minutes ?? '—')} />
                      </>
                    )}
                  </div>

                  {/* Timeline */}
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-3 py-3 text-center">
      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  )
}
