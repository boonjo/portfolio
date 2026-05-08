'use client'
import { Player, RISK_COLOR, RISK_BG } from './types'

type Props = {
  player: Player
  onClick: () => void
}

const BAR_COLOR: Record<string, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-400',
  high: 'bg-red-500',
}

export function PlayerCard({ player, onClick }: Props) {
  const barColor = BAR_COLOR[player.risk_level]
  const barWidth = `${Math.round(player.risk_score)}%`

  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md ${RISK_BG[player.risk_level]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="truncate font-[450] text-zinc-900 dark:text-zinc-50">
              {player.name}
            </p>
            {player.currently_injured && (
              <span className="shrink-0 rounded-full border bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide leading-none">
                Out
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {player.position} · {player.age}y · {player.nationality}
          </p>
        </div>
        <span className={`shrink-0 text-sm font-semibold tabular-nums ${RISK_COLOR[player.risk_level]}`}>
          {Math.round(player.risk_score)}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: barWidth }}
        />
      </div>

      <div className="mt-2 flex gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{player.total_injuries} injur{player.total_injuries === 1 ? 'y' : 'ies'}</span>
        <span>·</span>
        <span>{player.total_days_out}d out</span>
      </div>
    </button>
  )
}
