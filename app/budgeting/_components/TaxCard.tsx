'use client'
import { useRef, useEffect, useState } from 'react'
import { Chart, registerables } from 'chart.js'
import type { BudgetResult } from './types'
import { fmt, fmtPct, fmtRate } from './helpers'

Chart.register(...registerables)

function TaxRow({
  label,
  amount,
  colorClass,
  large = false,
}: {
  label: string
  amount: number
  colorClass: string
  large?: boolean
}) {
  return (
    <div className={`flex justify-between items-center gap-4 ${large ? 'text-sm' : 'text-xs'}`}>
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className={colorClass}>{fmt(amount)}</span>
    </div>
  )
}

export function TaxCard({
  result,
  isDark,
}: {
  result: BudgetResult
  isDark: boolean
}) {
  const t = result.taxes
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const [raiseInput, setRaiseInput] = useState('')

  const raise = parseFloat(raiseInput) || 0
  const marg = t.federal.marginal_rate + t.state.marginal_rate + 0.0765
  const raiseNet = raise * (1 - marg)

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Net Take-Home', 'Federal Tax', 'FICA', 'State Tax'],
        datasets: [
          {
            data: [t.net_annual, t.federal.tax, t.fica.total, t.state.tax],
            backgroundColor: ['#4ade80', '#f87171', '#fb923c', '#a78bfa'],
            borderWidth: 2,
            borderColor: isDark ? '#09090b' : '#ffffff',
          },
        ],
      },
      options: {
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => ` ${fmt(c.parsed)} (${fmtPct(c.parsed / t.gross)})`,
            },
          },
        },
      },
    })
    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [t, isDark])

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 sm:p-6">
      <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-4 text-sm">
        Tax Breakdown · {t.state.name || ''} · {t.tax_year}
      </h2>

      <div className="flex flex-col sm:flex-row gap-5 sm:flex-wrap sm:items-start items-center">
        {/* Doughnut chart */}
        <div className="flex flex-col items-center shrink-0">
          <canvas ref={canvasRef} width={140} height={140} />
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 justify-center text-[10px]">
            {(
              [
                ['#4ade80', 'Net'],
                ['#f87171', 'Federal'],
                ['#fb923c', 'FICA'],
                ['#a78bfa', 'State'],
              ] as [string, string][]
            ).map(([c, l]) => (
              <span key={l} className="flex items-center gap-1">
                <span
                  style={{ background: c }}
                  className="w-2 h-2 rounded-full inline-block"
                />
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Tax rows */}
        <div className="flex-1 min-w-44 space-y-2">
          <TaxRow label="Gross Income" amount={t.gross} colorClass="text-zinc-700 dark:text-zinc-200 font-semibold" large />
          {t.pretax_contrib > 0 && (
            <TaxRow label="Pre-tax Deductions" amount={-t.pretax_contrib} colorClass="text-zinc-500 dark:text-zinc-400" />
          )}
          <TaxRow label="Federal Income Tax" amount={t.federal.tax} colorClass="text-red-500" />
          <TaxRow label="Social Security" amount={t.fica.social_security} colorClass="text-orange-500" />
          <TaxRow label="Medicare" amount={t.fica.medicare + t.fica.additional_medicare} colorClass="text-orange-400" />
          <TaxRow label="State Income Tax" amount={t.state.tax} colorClass="text-purple-500 dark:text-purple-400" />
          <div className="border-t border-zinc-100 dark:border-zinc-700" />
          <TaxRow label="Total Taxes" amount={t.total_tax} colorClass="text-red-600 dark:text-red-400 font-semibold" />
          <TaxRow label="Net Annual" amount={t.net_annual} colorClass="text-green-600 dark:text-green-400 font-bold" large />
          <TaxRow label="Net Monthly" amount={t.net_monthly} colorClass="text-green-500 dark:text-green-400 font-semibold" />
        </div>

        {/* Rate info */}
        <div className="space-y-2 text-xs shrink-0 min-w-36">
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 space-y-1 text-zinc-600 dark:text-zinc-300">
            <p className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide text-[10px]">
              Effective Rates
            </p>
            <p>
              Overall:{' '}
              <strong className="text-zinc-800 dark:text-zinc-100">{fmtRate(t.effective_rate)}</strong>
            </p>
            <p>
              Federal: {fmtRate(t.federal.effective_rate)} · Marginal:{' '}
              {fmtRate(t.federal.marginal_rate)}
            </p>
            <p>
              State: {fmtRate(t.state.effective_rate)} · Marginal:{' '}
              {fmtRate(t.state.marginal_rate)}
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
            <p className="font-semibold text-[10px] uppercase tracking-wide">Federal Deduction</p>
            <p>
              Std. deduction: <strong>{fmt(t.federal.standard_deduction)}</strong>
            </p>
            <p>
              Taxable income: <strong>{fmt(t.federal.taxable_income)}</strong>
            </p>
          </div>
          {t.state.notes && (
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">{t.state.notes}</p>
          )}
        </div>
      </div>

      {/* Raise / bonus estimator */}
      <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700">
        <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-2">
          Raise / Bonus Estimator
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">If I earn an extra</span>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
            <input
              type="number"
              min={0}
              placeholder="5,000"
              value={raiseInput}
              onChange={(e) => setRaiseInput(e.target.value)}
              className="w-28 border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700
                         dark:text-zinc-100 rounded-lg pl-5 pr-2 py-2 text-xs
                         focus:outline-none focus:border-zinc-400"
            />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">this year → I keep</span>
          <span className="font-bold text-green-600 dark:text-green-400 text-sm">
            {raise > 0 ? `${fmt(raiseNet)}/yr (${fmt(raiseNet / 12)}/mo)` : '—'}
          </span>
        </div>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5">
          Marginal rate: Fed {fmtRate(t.federal.marginal_rate)} + State{' '}
          {fmtRate(t.state.marginal_rate)} + FICA 7.65% ={' '}
          <strong className="text-zinc-600 dark:text-zinc-300">{fmtRate(marg)}</strong> combined
        </p>
      </div>
    </div>
  )
}
