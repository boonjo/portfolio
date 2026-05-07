'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useTheme } from 'next-themes'
import { TaxCard } from './_components/TaxCard'
import { SSCard } from './_components/SSCard'
import { HealthCard } from './_components/HealthCard'
import { InsightsCard } from './_components/InsightsCard'
import { CategoryCard } from './_components/CategoryCard'
import { FrameworkCard } from './_components/FrameworkCard'
import { MilestoneCard } from './_components/MilestoneCard'
import { CATEGORY_LABELS, PERSIST_KEY, type BudgetResult, type StateOption } from './_components/types'
import { fmt } from './_components/helpers'

// ── Input styles — py-2.5 keeps touch targets ≥44px on mobile ────────────────
const INPUT_CLS =
  'w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 ' +
  'dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl px-3 py-2.5 text-sm ' +
  'focus:outline-none focus:border-zinc-400'

const INPUT_SM =
  'w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 ' +
  'dark:text-zinc-100 dark:placeholder-zinc-500 rounded-lg px-3 py-2.5 text-sm ' +
  'focus:outline-none focus:border-zinc-400'

// ── Collapsible section ───────────────────────────────────────────────────────
function Collapsible({
  id,
  label,
  badge,
  open,
  onToggle,
  children,
}: {
  id: string
  label: string
  badge?: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div id={id}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none flex items-center gap-1.5 min-w-0 py-1"
      >
        <span
          className={`inline-block text-xs shrink-0 transition-transform duration-150 ${
            open ? 'rotate-90' : ''
          }`}
        >
          ▶
        </span>
        <span className="truncate">
          {label}
          {badge && (
            <span className="text-xs text-zinc-400 font-normal whitespace-nowrap"> {badge}</span>
          )}
        </span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BudgetPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Prevent hydration mismatch for theme-dependent chart colors
  const [mounted, setMounted] = useState(false)
  const resultsRef = useRef<HTMLElement>(null)

  // Server data
  const [states, setStates] = useState<StateOption[]>([])
  const [stateError, setStateError] = useState(false)

  // Results
  const [result, setResult] = useState<BudgetResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  // Banner
  const [staleBanner, setStaleBanner] = useState('')
  const [yearBadge, setYearBadge] = useState('')

  // Profile inputs
  const [gross, setGross] = useState('')
  const [state, setState] = useState('')
  const [age, setAge] = useState('')
  const [filing, setFiling] = useState('single')
  const [pretax, setPretax] = useState('')

  // Account balances
  const [balChecking, setBalChecking] = useState('')
  const [balSavings, setBalSavings] = useState('')
  const [balRetirement, setBalRetirement] = useState('')

  // Current spending actuals keyed by input-key
  const [actuals, setActuals] = useState<Record<string, string>>({})

  // Collapsible open state
  const [openPretax, setOpenPretax] = useState(false)
  const [openBalances, setOpenBalances] = useState(false)
  const [openActuals, setOpenActuals] = useState(false)

  // ── Load states + restore form ──────────────────────────────────────────────
  useEffect(() => {
    setMounted(true)

    async function loadStates() {
      try {
        const res = await fetch('/api/budget/states')
        if (!res.ok) throw new Error()
        const data: StateOption[] = await res.json()
        setStates(data)
      } catch {
        setStateError(true)
      }
    }
    loadStates()

    // Restore persisted form
    try {
      const saved = JSON.parse(localStorage.getItem(PERSIST_KEY) ?? 'null')
      if (saved) {
        if (saved.gross) setGross(saved.gross)
        if (saved.state) setState(saved.state)
        if (saved.age) setAge(saved.age)
        if (saved.filing) setFiling(saved.filing)
        if (saved.pretax) { setPretax(saved.pretax); setOpenPretax(true) }
        if (saved['bal-checking']) { setBalChecking(saved['bal-checking']); setOpenBalances(true) }
        if (saved['bal-savings']) { setBalSavings(saved['bal-savings']); setOpenBalances(true) }
        if (saved['bal-retirement']) { setBalRetirement(saved['bal-retirement']); setOpenBalances(true) }
        if (saved.actuals && Object.keys(saved.actuals).length) {
          setActuals(saved.actuals)
          setOpenActuals(true)
        }
      }
    } catch { /* ignore */ }
  }, [])

  // ── Persist form on change ──────────────────────────────────────────────────
  const saveForm = useCallback(() => {
    const data = {
      gross, state, age, filing, pretax,
      'bal-checking': balChecking,
      'bal-savings': balSavings,
      'bal-retirement': balRetirement,
      actuals,
    }
    localStorage.setItem(PERSIST_KEY, JSON.stringify(data))
  }, [gross, state, age, filing, pretax, balChecking, balSavings, balRetirement, actuals])

  useEffect(() => { saveForm() }, [saveForm])

  // ── Actuals total ───────────────────────────────────────────────────────────
  const actualsTotal = CATEGORY_LABELS.reduce((sum, [key]) => {
    return sum + (parseFloat(actuals[key] ?? '') || 0)
  }, 0)

  const actualsTotalColor = result
    ? actualsTotal > result.taxes.net_monthly
      ? 'text-red-500 dark:text-red-400'
      : actualsTotal > result.taxes.net_monthly * 0.9
        ? 'text-amber-500 dark:text-amber-400'
        : 'text-emerald-600 dark:text-emerald-400'
    : 'text-zinc-500 dark:text-zinc-400'

  // ── Calculate ───────────────────────────────────────────────────────────────
  async function calculate() {
    setFormError('')
    const grossVal = parseFloat(gross)
    if (!grossVal || grossVal <= 0) { setFormError('Enter a valid gross income.'); return }
    if (!state) { setFormError('Select a state.'); return }
    if (!filing) { setFormError('Select a filing status.'); return }

    // Combine groceries + dining_out → food
    const actualsPayload: Record<string, number> = {}
    CATEGORY_LABELS.forEach(([key, , submitKey]) => {
      const v = parseFloat(actuals[key] ?? '')
      if (v > 0) actualsPayload[submitKey] = (actualsPayload[submitKey] ?? 0) + v
    })

    const balancesPayload =
      balChecking || balSavings || balRetirement
        ? {
            checking: parseFloat(balChecking) || null,
            savings: parseFloat(balSavings) || null,
            retirement: parseFloat(balRetirement) || null,
          }
        : null

    setLoading(true)
    setResult(null)
    setStaleBanner('')
    setYearBadge('')

    try {
      const res = await fetch('/api/budget/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gross_annual: grossVal,
          pretax_contrib: parseFloat(pretax) || null,
          filing_status: filing,
          state,
          age: age ? parseInt(age) : null,
          actuals: Object.keys(actualsPayload).length ? actualsPayload : null,
          balances: balancesPayload,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data: BudgetResult = await res.json()

      setYearBadge(`${data.taxes.tax_year} rates`)
      if (!data.taxes.rates_current) {
        setStaleBanner(
          `ℹ️  Showing ${data.taxes.tax_year} rates — the most recent available. ` +
            `${new Date().getFullYear()} brackets haven't been added yet; figures are a close estimate.`
        )
      }
      setResult(data)
      // Scroll to results on mobile (stacked layout)
      if (window.matchMedia('(max-width: 1023px)').matches) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
      }
    } catch (e: unknown) {
      setFormError('Calculation failed: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setLoading(false)
    }
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  function resetForm() {
    setGross(''); setState(''); setAge(''); setFiling('single'); setPretax('')
    setBalChecking(''); setBalSavings(''); setBalRetirement('')
    setActuals({})
    setOpenPretax(false); setOpenBalances(false); setOpenActuals(false)
    setResult(null); setFormError(''); setStaleBanner(''); setYearBadge('')
    localStorage.removeItem(PERSIST_KEY)
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Stale rates banner */}
      {staleBanner && (
        <div className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
          <p className="max-w-7xl mx-auto text-xs text-amber-700 dark:text-amber-300 text-center">
            {staleBanner}
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-5 items-start">
        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                Your Profile
              </h2>
              {yearBadge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {yearBadge}
                </span>
              )}
            </div>

            {/* Gross income */}
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">
                Annual Gross Income
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  min={1}
                  placeholder="75,000"
                  value={gross}
                  onChange={(e) => setGross(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className={INPUT_CLS + ' pl-7'}
                />
              </div>
            </div>

            {/* State + Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className={INPUT_SM.replace('px-3', 'px-2')}
                >
                  <option value="">
                    {stateError ? '⚠ Could not load' : states.length ? 'Select…' : 'Loading…'}
                  </option>
                  {states.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">
                  Age{' '}
                  <span className="text-zinc-400 font-normal">(opt.)</span>
                </label>
                <input
                  type="number"
                  min={16}
                  max={100}
                  placeholder="e.g. 32"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className={INPUT_SM}
                />
              </div>
            </div>

            {/* Filing status */}
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">
                Filing Status
              </label>
              <select
                value={filing}
                onChange={(e) => setFiling(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && calculate()}
                className={INPUT_CLS}
              >
                <option value="single">Single</option>
                <option value="married_jointly">Married Filing Jointly</option>
                <option value="married_separately">Married Filing Separately</option>
                <option value="head_of_household">Head of Household</option>
              </select>
            </div>

            {/* Pre-tax deductions */}
            <Collapsible
              id="pretax-section"
              label="Pre-tax deductions"
              badge="(401k, HSA, FSA)"
              open={openPretax}
              onToggle={() => setOpenPretax((v) => !v)}
            >
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 23500"
                  value={pretax}
                  onChange={(e) => setPretax(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  className={INPUT_SM + ' pl-6'}
                />
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5">
                Annual total. Reduces your taxable income — use W-2 Box 12 or your plan statement.
              </p>
            </Collapsible>

            {/* Account balances */}
            <Collapsible
              id="balances-section"
              label="Account balances"
              badge="(health check)"
              open={openBalances}
              onToggle={() => setOpenBalances((v) => !v)}
            >
              <div className="space-y-2">
                {(
                  [
                    ['Checking', balChecking, setBalChecking],
                    ['Savings / HYSA', balSavings, setBalSavings],
                    ['Retirement (401k/IRA)', balRetirement, setBalRetirement],
                  ] as [string, string, (v: string) => void][]
                ).map(([label, val, setter]) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">
                      {label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={val}
                        onChange={(e) => setter(e.target.value)}
                        className={INPUT_SM + ' pl-6'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Collapsible>

            {/* Current spending */}
            <Collapsible
              id="actuals-section"
              label="Current spending"
              badge="($/mo actual)"
              open={openActuals}
              onToggle={() => setOpenActuals((v) => !v)}
            >
              <div className="space-y-1.5">
                {CATEGORY_LABELS.map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="text-zinc-500 dark:text-zinc-400 text-xs">{label}</span>
                    <div className="relative mt-0.5">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min={0}
                        placeholder="0/mo"
                        value={actuals[key] ?? ''}
                        onChange={(e) =>
                          setActuals((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className={INPUT_SM + ' pl-6'}
                      />
                    </div>
                  </label>
                ))}

                {/* Running total */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-700 flex justify-between items-center text-xs">
                  <span className="text-zinc-400 dark:text-zinc-500">Total entered / mo</span>
                  <span className={`font-semibold ${actualsTotalColor}`}>
                    ${Math.round(actualsTotal).toLocaleString()}/mo
                  </span>
                </div>
              </div>
            </Collapsible>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={calculate}
                className="flex-1 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 active:scale-95 text-white font-semibold rounded-xl py-3 text-sm transition-all"
              >
                {loading ? 'Calculating…' : 'Calculate'}
              </button>
              <button
                onClick={resetForm}
                title="Clear all inputs"
                className="shrink-0 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded-xl px-3.5 text-sm transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            {formError && (
              <p className="text-red-500 dark:text-red-400 text-xs">{formError}</p>
            )}
          </div>
        </aside>

        {/* ── Results ── */}
        <main ref={resultsRef} className="flex-1 min-w-0 space-y-4 scroll-mt-20">
          {/* Empty state — compact on mobile since form is right above */}
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center py-12 lg:py-24 text-zinc-400 dark:text-zinc-500">
              <span className="text-4xl lg:text-5xl mb-3">📊</span>
              <p className="font-medium text-sm lg:text-base">Enter your details and tap Calculate</p>
              <p className="text-xs lg:text-sm mt-1 text-center px-4">
                Federal + state taxes · Spending guidance · Account health check
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12 lg:py-24 text-zinc-400 dark:text-zinc-500 gap-3">
              <svg className="animate-spin h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-sm">Calculating…</span>
            </div>
          )}

          {/* Results cards — only render after mount so charts get correct dark-mode colors */}
          {result && mounted && (
            <div className="space-y-4 animate-fadeIn">
              <TaxCard result={result} isDark={isDark} />
              {result.health && <HealthCard health={result.health} />}
              {result.ss_estimate && <SSCard ss={result.ss_estimate} taxes={result.taxes} />}
              {result.insights?.length ? <InsightsCard insights={result.insights} /> : null}
              <CategoryCard result={result} />
              <FrameworkCard result={result} isDark={isDark} />
              <MilestoneCard result={result} />
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
      `}</style>
    </>
  )
}
