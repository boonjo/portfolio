'use client'
import type { Insight } from './types'

const TIER_META = {
  critical: {
    label: 'Critical',
    badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
  },
  warning: {
    label: 'Warning',
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  good: {
    label: 'On Track',
    badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  },
}

const TIER_CARD_BG = {
  critical: 'bg-red-50 dark:bg-red-950/40',
  warning: 'bg-amber-50 dark:bg-amber-950/30',
  good: 'bg-green-50 dark:bg-green-950/30',
}

const TIER_BORDER = {
  critical: 'border-l-[3px] border-red-500',
  warning: 'border-l-[3px] border-amber-400',
  good: 'border-l-[3px] border-green-500',
}

export function InsightsCard({ insights }: { insights: Insight[] }) {
  const counts = { critical: 0, warning: 0, good: 0 }
  insights.forEach((i) => {
    if (i.tier in counts) counts[i.tier as keyof typeof counts]++
  })

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 text-sm">
          Actionable Insights
        </h2>
        <div className="flex gap-1.5 flex-wrap">
          {(Object.entries(counts) as [keyof typeof counts, number][])
            .filter(([, n]) => n > 0)
            .map(([tier, n]) => {
              const m = TIER_META[tier]
              return (
                <span
                  key={tier}
                  className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${m.badge} font-medium`}
                >
                  {n} {m.label}
                </span>
              )
            })}
        </div>
      </div>

      <div className="space-y-2">
        {insights.map((ins, i) => {
          const m = TIER_META[ins.tier] ?? TIER_META.good
          const bg = TIER_CARD_BG[ins.tier] ?? TIER_CARD_BG.good
          const border = TIER_BORDER[ins.tier] ?? TIER_BORDER.good
          return (
            <div key={i} className={`${border} ${bg} rounded-xl p-3.5 space-y-1`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base">{ins.icon}</span>
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${m.badge}`}
                >
                  {m.label}
                </span>
                <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-100">
                  {ins.title}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 ml-7">{ins.body}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-7">
                <span className="font-medium text-zinc-700 dark:text-zinc-200">→ Action:</span>{' '}
                {ins.action}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
