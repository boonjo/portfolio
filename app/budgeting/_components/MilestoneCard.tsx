'use client'
import type { BudgetResult } from './types'
import { fmt } from './helpers'

export function MilestoneCard({ result: d }: { result: BudgetResult }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-4 text-sm">
        Financial Milestones
      </h2>

      <div>
        {d.milestones.map((m, i) => (
          <div
            key={i}
            className={`flex items-start justify-between gap-4 py-2 border-b border-zinc-50 dark:border-zinc-800 last:border-0 ${
              m.past ? 'opacity-35' : ''
            }`}
          >
            <div>
              <p
                className={`text-xs font-medium text-zinc-700 dark:text-zinc-200 ${
                  m.past ? 'line-through' : ''
                }`}
              >
                {m.label}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{m.note}</p>
            </div>
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200 shrink-0">
              {fmt(m.amount)}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-3">
        Sources: CFPB, Fidelity, Vanguard, NerdWallet, Dave Ramsey, Elizabeth Warren (50/30/20)
      </p>
    </div>
  )
}
