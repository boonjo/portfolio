'use client'
import type { Health } from './types'
import { fmt } from './helpers'

function HStat({
  label,
  value,
  colorClass,
}: {
  label: string
  value: number
  colorClass: string
}) {
  const display = value > 0 ? fmt(value) : '—'
  const cls = value > 0 ? colorClass : 'text-zinc-400 dark:text-zinc-500'
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`font-bold text-sm ${cls}`}>{display}</p>
    </div>
  )
}

export function HealthCard({ health: h }: { health: Health }) {
  const moPct = Math.min(100, (h.months_liquid / 6) * 100)
  const moColor =
    h.months_liquid < 1
      ? 'bg-red-400'
      : h.months_liquid < 3
        ? 'bg-amber-400'
        : 'bg-emerald-400'

  let retSection = null
  if (h.retirement_target !== null) {
    const retPct = Math.min(100, (h.retirement_balance / h.retirement_target) * 100)
    const retColor =
      retPct < 50 ? 'bg-red-400' : retPct < 90 ? 'bg-amber-400' : 'bg-emerald-400'
    const ageLabel = h.retirement_milestone_age ? ` (age ${h.retirement_milestone_age} target)` : ''
    const gapLabel =
      h.retirement_gap >= 0 ? (
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          +{fmt(h.retirement_gap)} ahead
        </span>
      ) : (
        <span className="text-red-500 dark:text-red-400 font-semibold">
          {fmt(Math.abs(h.retirement_gap))} behind
        </span>
      )

    retSection = (
      <div className="border-t border-zinc-100 dark:border-zinc-700 pt-3 mt-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-zinc-500 dark:text-zinc-400">
            Retirement vs Fidelity Milestone{ageLabel}
          </span>
          {gapLabel}
        </div>
        <div className="bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${retColor} transition-all duration-700`}
            style={{ width: `${retPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
          <span>{fmt(h.retirement_balance)} saved</span>
          <span>Target {fmt(h.retirement_target)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-4 text-sm">
        Account Health Check
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <HStat label="Checking" value={h.checking} colorClass="text-zinc-700 dark:text-zinc-200" />
        <HStat label="Savings / HYSA" value={h.savings} colorClass="text-blue-600 dark:text-blue-400" />
        <HStat label="Retirement" value={h.retirement_balance} colorClass="text-purple-600 dark:text-purple-400" />
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">
              Liquid Emergency Coverage
            </span>
            <span className="font-bold text-zinc-700 dark:text-zinc-200">
              {h.months_liquid.toFixed(1)} / 6 months
            </span>
          </div>
          <div className="bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${moColor} transition-all duration-700`}
              style={{ width: `${moPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
            <span>{fmt(h.liquid_total)} liquid</span>
            <span>6-mo goal: {fmt(h.monthly_expenses_used * 6)}</span>
          </div>
        </div>

        <div className="flex justify-between text-sm pt-1 border-t border-zinc-200 dark:border-zinc-700">
          <span className="text-zinc-500 dark:text-zinc-400">Est. Net Worth (excl. debt)</span>
          <span className="font-bold text-zinc-800 dark:text-zinc-100">
            {fmt(h.net_worth_estimate)}
          </span>
        </div>

        {retSection}
      </div>
    </div>
  )
}
