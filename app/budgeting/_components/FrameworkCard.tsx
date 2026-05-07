'use client'
import { useRef, useEffect } from 'react'
import { Chart, registerables } from 'chart.js'
import type { BudgetResult } from './types'
import { fmt, fmtPct } from './helpers'

Chart.register(...registerables)

function computeActualSplit(d: BudgetResult) {
  const gmo = d.gross_monthly
  let n = 0, w = 0, s = 0
  d.categories.forEach((cat) => {
    if (cat.actual == null) return
    const pct = cat.actual / gmo
    if (cat.bucket === 'needs') n += pct
    else if (cat.bucket === 'wants') w += pct
    else if (cat.bucket === 'savings') s += pct
  })
  return n + w + s > 0 ? { needs: n, wants: w, savings: s } : null
}

export function FrameworkCard({
  result: d,
  isDark,
}: {
  result: BudgetResult
  isDark: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()

    const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
    const textColor = isDark ? '#a1a1aa' : '#71717a'
    const actual = computeActualSplit(d)
    const labels = [...d.frameworks.map((fw) => fw.name), ...(actual ? ['Your Actual'] : [])]

    const needsBg = [
      ...d.frameworks.map(() => 'rgba(96,165,250,0.80)'),
      ...(actual ? ['rgba(59,130,246,1)'] : []),
    ]
    const wantsBg = [
      ...d.frameworks.map(() => 'rgba(251,191,36,0.80)'),
      ...(actual ? ['rgba(245,158,11,1)'] : []),
    ]
    const savingsBg = [
      ...d.frameworks.map(() => 'rgba(52,211,153,0.80)'),
      ...(actual ? ['rgba(16,185,129,1)'] : []),
    ]

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Needs',
            data: [
              ...d.frameworks.map((fw) => fw.needs * 100),
              ...(actual ? [actual.needs * 100] : []),
            ],
            backgroundColor: needsBg,
          },
          {
            label: 'Wants',
            data: [
              ...d.frameworks.map((fw) => fw.wants * 100),
              ...(actual ? [actual.wants * 100] : []),
            ],
            backgroundColor: wantsBg,
          },
          {
            label: 'Savings',
            data: [
              ...d.frameworks.map((fw) => fw.savings * 100),
              ...(actual ? [actual.savings * 100] : []),
            ],
            backgroundColor: savingsBg,
            borderRadius: { topLeft: 4, topRight: 4 },
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: textColor, font: { size: 11 }, boxWidth: 12 },
          },
          tooltip: {
            callbacks: {
              label: (c) => ` ${c.dataset.label}: ${(c.parsed.y ?? 0).toFixed(1)}%`,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { color: textColor, font: { size: 11 } },
            grid: { color: gridColor },
          },
          y: {
            stacked: true,
            max: 105,
            ticks: {
              color: textColor,
              font: { size: 10 },
              callback: (v) => v + '%',
            },
            grid: { color: gridColor },
          },
        },
      },
    })

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [d, isDark])

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-4 text-sm">
        Budget Framework Comparison
      </h2>

      <canvas ref={canvasRef} height={185} />
      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 mb-4">
        Stacked bars show Needs / Wants / Savings split.{' '}
        <strong className="text-zinc-500 dark:text-zinc-400">Your Actual</strong> bar appears when
        current spending is entered.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-700">
              <th className="pb-2 pr-4">Framework</th>
              <th className="pb-2 pr-3 text-right text-blue-400">Needs</th>
              <th className="pb-2 pr-3 text-right text-amber-400">Wants</th>
              <th className="pb-2 text-right text-green-400">Savings</th>
            </tr>
          </thead>
          <tbody>
            {d.frameworks.map((fw) => (
              <tr
                key={fw.name}
                className="border-b border-zinc-50 dark:border-zinc-800 last:border-0"
              >
                <td className="py-2 pr-4">
                  <p className="font-medium text-xs text-zinc-700 dark:text-zinc-200">{fw.name}</p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{fw.best_for}</p>
                </td>
                <td className="py-2 text-right pr-3 text-xs">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {fmt(fw.needs_monthly)}
                  </span>{' '}
                  <span className="text-[10px] text-zinc-400">{fmtPct(fw.needs)}</span>
                </td>
                <td className="py-2 text-right pr-3 text-xs">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {fmt(fw.wants_monthly)}
                  </span>{' '}
                  <span className="text-[10px] text-zinc-400">{fmtPct(fw.wants)}</span>
                </td>
                <td className="py-2 text-right text-xs">
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {fmt(fw.savings_monthly)}
                  </span>{' '}
                  <span className="text-[10px] text-zinc-400">{fmtPct(fw.savings)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
