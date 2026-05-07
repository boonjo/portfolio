'use client'
import type { BudgetResult } from './types'
import { fmt, fmtPct } from './helpers'

const BUCKET_PILL: Record<string, string> = {
  needs:
    'text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  wants:
    'text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  savings:
    'text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
}

const BUCKET_LABEL: Record<string, string> = {
  needs: 'Need',
  wants: 'Want',
  savings: 'Save',
}

const STATUS_CLS: Record<string, string> = {
  ok: 'text-green-600 dark:text-green-400',
  over: 'text-red-500 dark:text-red-400',
  under: 'text-blue-600 dark:text-blue-400',
}

const STATUS_ICON: Record<string, string> = { ok: '✓', over: '↑', under: '↓' }

export function CategoryCard({ result: d }: { result: BudgetResult }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1 text-sm">
        Recommended Budget Categories
      </h2>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1">
        Gross{' '}
        <strong className="text-zinc-600 dark:text-zinc-300">{fmt(d.gross_monthly)}/mo</strong> ·
        Net take-home{' '}
        <strong className="text-zinc-600 dark:text-zinc-300">{fmt(d.net_monthly)}/mo</strong>
      </p>
      <p className="text-[10px] text-amber-600 dark:text-amber-500 mb-3">
        Ranges are % of gross (industry standard). Actual spending is measured against net
        take-home in the surplus line.
      </p>

      {d.dti != null && (
        <div className="flex justify-between items-center text-xs mb-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl px-3 py-2">
          <span className="text-zinc-500 dark:text-zinc-400">
            Debt-to-Income Ratio{' '}
            <span className="text-zinc-400">(housing + debt)</span>
          </span>
          <span
            className={`font-semibold ${
              d.dti > 0.43
                ? 'text-red-500'
                : d.dti > 0.36
                  ? 'text-amber-500'
                  : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {(d.dti * 100).toFixed(1)}% —{' '}
            {d.dti > 0.43
              ? 'High · limits mortgage eligibility'
              : d.dti > 0.36
                ? 'Elevated · CFPB caution zone'
                : 'Healthy · within CFPB guideline'}
          </span>
        </div>
      )}

      {d.categories.map((cat) => {
        const barPct = Math.min(100, (cat.pct_max * 100) / 0.35)
        return (
          <div
            key={cat.key}
            className="py-2.5 border-b border-zinc-50 dark:border-zinc-800 last:border-0"
          >
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {BUCKET_PILL[cat.bucket] && (
                  <span className={BUCKET_PILL[cat.bucket]}>{BUCKET_LABEL[cat.bucket]}</span>
                )}
                <span className="font-medium text-xs text-zinc-700 dark:text-zinc-200">
                  {cat.label}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                  {cat.detail}
                </span>
              </div>
              <div className="text-right text-xs shrink-0">
                <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                  {fmt(cat.monthly_min)} – {fmt(cat.monthly_max)}/mo
                </span>
                {cat.actual != null && (
                  <span
                    className={`text-[10px] ${STATUS_CLS[cat.status ?? ''] ?? ''} font-medium ml-1`}
                  >
                    {STATUS_ICON[cat.status ?? ''] ?? ''} {fmt(cat.actual)}/mo
                  </span>
                )}
              </div>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700">
              <div
                className="h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 transition-all duration-500"
                style={{ width: `${barPct}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{cat.note}</p>
          </div>
        )
      })}

      {d.surplus != null && (
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-700 flex justify-between text-sm font-semibold">
          <span className="text-zinc-600 dark:text-zinc-300">Monthly surplus / (deficit)</span>
          <span
            className={
              d.surplus >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            }
          >
            {fmt(d.surplus)}/mo
          </span>
        </div>
      )}
    </div>
  )
}
