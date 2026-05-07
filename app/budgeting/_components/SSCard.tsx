'use client'
import type { SSEstimate, TaxResult } from './types'
import { fmt } from './helpers'

export function SSCard({ ss, taxes }: { ss: SSEstimate; taxes: TaxResult }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 sm:p-6">
      <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1 text-sm">
        Social Security Estimate
      </h2>
      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-4">
        Simplified estimate using 2024 SSA bend points, assuming stable career earnings of{' '}
        {fmt(taxes.gross)}/yr. Verify at{' '}
        <a
          href="https://www.ssa.gov/myaccount/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:underline"
        >
          ssa.gov/myaccount
        </a>
        .
      </p>

      <div className="grid grid-cols-3 gap-3">
        {/* Claim at 62 */}
        <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl p-4 text-center border border-amber-100 dark:border-amber-900/50">
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wide mb-2">
            Claim at 62
          </p>
          <p className="font-bold text-xl text-amber-600 dark:text-amber-400">{fmt(ss.at_62)}</p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">per month</p>
          <p className="text-[10px] text-amber-500/80 dark:text-amber-400/70 mt-2">−30% vs. FRA</p>
        </div>

        {/* Full retirement age */}
        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4 text-center border border-zinc-200 dark:border-zinc-700 ring-2 ring-zinc-300 dark:ring-zinc-600">
          <p className="text-[10px] text-zinc-700 dark:text-zinc-300 font-semibold uppercase tracking-wide mb-2">
            Full Ret. Age · 67
          </p>
          <p className="font-bold text-xl text-zinc-900 dark:text-zinc-50">{fmt(ss.at_67)}</p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">per month</p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">{fmt(ss.annual_at_67)}/yr</p>
        </div>

        {/* Delay to 70 */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl p-4 text-center border border-emerald-100 dark:border-emerald-900/50">
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wide mb-2">
            Delay to 70
          </p>
          <p className="font-bold text-xl text-emerald-600 dark:text-emerald-400">{fmt(ss.at_70)}</p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">per month</p>
          <p className="text-[10px] text-emerald-500/80 dark:text-emerald-400/70 mt-2">+24% vs. FRA</p>
        </div>
      </div>

      {ss.years_to_fra != null && (
        <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-3">
          <strong>{ss.years_to_fra}</strong> year{ss.years_to_fra !== 1 ? 's' : ''} until Full
          Retirement Age (67)
        </p>
      )}
    </div>
  )
}
