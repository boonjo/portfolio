'use client'
import { Injury } from './types'

type Props = { injuries: Injury[] }

const SEVERE = ['cruciate', 'ligament', 'achilles', 'acl']
const MUSCLE = ['hamstring', 'thigh', 'adductor', 'calf', 'groin', 'muscle']

function injuryColor(type: string) {
  const t = type.toLowerCase()
  if (SEVERE.some((s) => t.includes(s))) return 'bg-red-500'
  if (MUSCLE.some((s) => t.includes(s))) return 'bg-amber-400'
  return 'bg-blue-400'
}

function fmt(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

export function InjuryTimeline({ injuries }: Props) {
  if (injuries.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">No injury records found.</p>
    )
  }

  return (
    <ol className="space-y-3">
      {injuries.map((inj) => (
        <li key={inj.injury_id} className="flex gap-3">
          <div className="flex flex-col items-center pt-1">
            <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${injuryColor(inj.injury_type)}`} />
            <span className="mt-1 w-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="pb-3 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
              {inj.injury_type}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {fmt(inj.injury_from)} – {inj.injury_to ? fmt(inj.injury_to) : <span className="text-orange-500 dark:text-orange-400 font-medium">ongoing</span>}
              {inj.days_out != null && (
                <span className="ml-2 font-medium text-zinc-700 dark:text-zinc-300">
                  {inj.days_out}d out · {inj.games_missed ?? 0} games
                </span>
              )}
            </p>
            <span className="inline-block mt-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
              {inj.season}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}
