'use client'
import { useEffect, useRef, useState } from 'react'

function Formula({ children }: { children: string }) {
  return (
    <pre className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 border-l-[3px] border-l-zinc-400 dark:border-l-zinc-500 rounded-r-md p-3 font-mono text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap my-3 overflow-x-auto">
      {children}
    </pre>
  )
}

function Source({ href, children }: { href?: string; children: React.ReactNode }) {
  const cls = "inline-flex items-center gap-1 text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded px-1.5 py-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
  if (!href) return <span className={cls}>{children}</span>
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
}

function CalloutWarn({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-sm text-amber-800 dark:text-amber-300 mb-4">
      {children}
    </div>
  )
}

function CalloutInfo({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm text-zinc-700 dark:text-zinc-300">
      {children}
    </div>
  )
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-2">
      {children}
    </a>
  )
}

const SECTIONS = [
  { id: 'philosophy', label: 'Philosophy', children: [] },
  { id: 'taxes', label: 'Tax Calculations', children: [
    { id: 'federal', label: 'Federal Income Tax' },
    { id: 'fica', label: 'FICA' },
    { id: 'state-tax', label: 'State Income Tax' },
  ]},
  { id: 'budget', label: 'Budget Categories', children: [] },
  { id: 'frameworks', label: 'Budget Frameworks', children: [] },
  { id: 'health', label: 'Health Check', children: [] },
  { id: 'insights', label: 'Insights Engine', children: [] },
  { id: 'sources', label: 'Data Sources', children: [] },
  { id: 'limitations', label: 'Limitations', children: [] },
  { id: 'tips', label: 'Tips for Accuracy', children: [] },
]

export default function GuidePage() {
  const [active, setActive] = useState('philosophy')
  const [tocOpen, setTocOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-section]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.getAttribute('data-section') ?? '')
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = tocOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [tocOpen])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Mobile floating TOC button — fixed bottom right, only < lg */}
      <div className="lg:hidden fixed bottom-6 right-4 z-30">
        <button
          onClick={() => setTocOpen(true)}
          aria-label="Open table of contents"
          className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium rounded-full px-4 py-3 shadow-xl active:scale-95 transition-transform"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" /></svg>
          Contents
        </button>
      </div>

      {/* Mobile bottom sheet */}
      {tocOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end" onClick={() => setTocOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            ref={sheetRef}
            className="relative bg-white dark:bg-zinc-950 rounded-t-2xl shadow-2xl max-h-[72vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <span className="font-semibold text-base text-zinc-900 dark:text-zinc-100">Contents</span>
              <button
                onClick={() => setTocOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <ul className="overflow-y-auto py-3 px-3 space-y-0.5 pb-[env(safe-area-inset-bottom,16px)]">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setTocOpen(false)}
                    className={`flex items-center px-3 py-3.5 rounded-xl text-[15px] transition-colors ${active === s.id ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 font-semibold' : 'text-zinc-600 dark:text-zinc-400'}`}
                  >
                    {s.label}
                  </a>
                  {s.children.length > 0 && (
                    <ul className="pl-3 mt-0.5 space-y-0.5">
                      {s.children.map((c) => (
                        <li key={c.id}>
                          <a
                            href={`#${c.id}`}
                            onClick={() => setTocOpen(false)}
                            className={`flex items-center px-3 py-3 rounded-xl text-sm transition-colors ${active === c.id ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 font-semibold' : 'text-zinc-500 dark:text-zinc-500'}`}
                          >
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main content row */}
      <div className="px-4 py-6 sm:py-8 flex gap-8 items-start">
        {/* TOC sidebar — desktop only */}
        <nav className="w-52 shrink-0 sticky top-20 hidden lg:block">
          <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Contents</p>
          <ul className="space-y-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={`block py-0.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50 ${active === s.id ? 'text-zinc-900 dark:text-zinc-50 font-semibold border-l-2 border-zinc-900 dark:border-zinc-100 pl-2 -ml-[10px]' : ''}`}>
                  {s.label}
                </a>
                {s.children.length > 0 && (
                  <ul className="pl-3 mt-0.5 space-y-0.5 text-xs">
                    {s.children.map((c) => (
                      <li key={c.id}>
                        <a href={`#${c.id}`} className={`block py-0.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50 ${active === c.id ? 'text-zinc-900 dark:text-zinc-50 font-semibold' : ''}`}>
                          {c.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Article */}
        <article className="flex-1 min-w-0 space-y-10 sm:space-y-12 pb-28 lg:pb-16">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-3">How It Works</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-2xl">
            Reference covering the methodology, data sources, and math behind every number displayed. Understanding the calculations helps use the tool more effectively and spot where situations might differ from the defaults explained below.
          </p>
        </div>

        {/* 1. Philosophy */}
        <section id="philosophy" data-section="philosophy" className="scroll-mt-16 lg:scroll-mt-20">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">Philosophy</h2>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            <p><strong className="text-zinc-800 dark:text-zinc-100">Transparent Math</strong> — Federal tax, state tax, FICA, and budget ranges are calculated from source formulas with no black boxes. The data files (<code className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-xs">tax_rates.json</code>, <code className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-xs">taxes.py</code>) are plain text and readable.</p>
            <p><strong className="text-zinc-800 dark:text-zinc-100">Frameworks and Recommendation Sources</strong> — Budget percentages, emergency fund targets, and retirement milestones are sourced from CFPB, Fidelity, and peer-reviewed personal finance frameworks. Every recommendation cites its source.</p>
            <p><strong className="text-zinc-800 dark:text-zinc-100">Conservative Bias</strong> — When guidance gives a range (e.g. &ldquo;save 10–15%&rdquo;), it displays the full range rather than the minimum.</p>
            <p><strong className="text-zinc-800 dark:text-zinc-100">Estimates, not Guarantees</strong> — It models a standardized taxpayer taking the standard deduction with no special credits, additional income sources, or itemized deductions. It is a planning tool, not a substitute for a CPA or CFP.</p>
          </div>
        </section>

        {/* 2. Tax Calculations */}
        <section id="taxes" data-section="taxes" className="scroll-mt-16 lg:scroll-mt-20">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">Tax Calculations</h2>
          <div className="space-y-8">
            <div id="federal" data-section="federal" className="scroll-mt-16 lg:scroll-mt-20">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-3 text-base">Federal Income Tax</h3>
              <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-3">
                <p>Federal income tax is <strong className="text-zinc-800 dark:text-zinc-100">progressive</strong>, with each bracket only applying to income <em>within</em> that bracket. The standard deduction is subtracted from gross income first to produce <em>taxable income</em>.</p>
                <Formula>{`taxable_income = gross_income - standard_deduction
federal_tax    = Σ (each_bracket_amount × marginal_rate)
effective_rate = federal_tax ÷ gross_income`}</Formula>
                <p><strong className="text-zinc-800 dark:text-zinc-100">Example</strong> — $100,000 gross, Single filer, 2025:</p>
                <Formula>{`Standard deduction: $15,000
Taxable income:    $85,000
  10% on $0 → $11,925        = $1,192.50
  12% on $11,925 → $48,475   = $4,386.00
  22% on $48,475 → $85,000   = $8,035.50
                             ───────────
Federal tax:    $13,614.00
Effective rate: 13.61%   Marginal rate: 22%`}</Formula>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 flex gap-2 flex-wrap items-center"><Source href="https://www.irs.gov/pub/irs-drop/rp-24-40.pdf">IRS Rev. Proc. 2024-40</Source> Bracket thresholds are inflation-adjusted annually. The tool auto-selects the most recent available year ≤ the current calendar year.</p>
              </div>
            </div>

            <div id="fica" data-section="fica" className="scroll-mt-16 lg:scroll-mt-20">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-3 text-base">FICA (Social Security &amp; Medicare)</h3>
              <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-3">
                <p>FICA is separate from income tax and not affected by the standard deduction; it applies to <em>gross</em> wages directly.</p>
                <Formula>{`Social Security:      6.20% of wages up to $176,100 (2025 wage base)
Medicare:            1.45% of all wages (no cap)
Additional Medicare: 0.90% of wages over $200,000 (single) / $250,000 (MFJ)
FICA total = SS + Medicare + Additional Medicare`}</Formula>
                <p>The SS wage base is adjusted annually and announced by the SSA in October. Employers match the 6.2% SS and 1.45% Medicare contributions; self-employed individuals pay the combined 15.3% (see <a href="#limitations" className="underline underline-offset-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Limitations</a>).</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 flex gap-2 flex-wrap"><Source href="https://www.irs.gov/publications/p15">IRS Publication 15 (Circular E)</Source><Source href="https://www.ssa.gov/oact/cola/cbb.html">SSA COLA Notice</Source></p>
              </div>
            </div>

            <div id="state-tax" data-section="state-tax" className="scroll-mt-16 lg:scroll-mt-20">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-3 text-base">State Income Tax</h3>
              <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-3">
                <p>States fall into three categories, each calculated differently:</p>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-800 text-left">
                        <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Type</th>
                        <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">States</th>
                        <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Calculation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-zinc-100 dark:border-zinc-800">
                        <td className="px-3 py-2 font-medium text-emerald-700 dark:text-emerald-400">No tax</td>
                        <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400">AK, FL, NV, NH, SD, TN, TX, WA, WY</td>
                        <td className="px-3 py-2">State tax = $0</td>
                      </tr>
                      <tr className="border-t border-zinc-100 dark:border-zinc-800">
                        <td className="px-3 py-2 font-medium text-blue-700 dark:text-blue-400">Flat rate</td>
                        <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400">AZ (2.5%), CO (4.4%), IL (4.95%), PA (3.07%), and others</td>
                        <td className="px-3 py-2"><code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">(gross - state_deduction - exemptions) × flat_rate</code></td>
                      </tr>
                      <tr className="border-t border-zinc-100 dark:border-zinc-800">
                        <td className="px-3 py-2 font-medium text-purple-700 dark:text-purple-400">Progressive</td>
                        <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400">CA, NY, MN, NJ, OR, and others</td>
                        <td className="px-3 py-2">Same bracket logic as federal, using state-specific thresholds and deductions</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="sm:hidden space-y-2">
                  {([
                    { label: 'No tax', cls: 'text-emerald-700 dark:text-emerald-400', states: 'AK, FL, NV, NH, SD, TN, TX, WA, WY', calc: 'State tax = $0' },
                    { label: 'Flat rate', cls: 'text-blue-700 dark:text-blue-400', states: 'AZ (2.5%), CO (4.4%), IL (4.95%), PA (3.07%), and others', calc: '(gross − deduction − exemptions) × flat_rate' },
                    { label: 'Progressive', cls: 'text-purple-700 dark:text-purple-400', states: 'CA, NY, MN, NJ, OR, and others', calc: 'Bracket logic as federal, using state thresholds' },
                  ] as { label: string; cls: string; states: string; calc: string }[]).map(r => (
                    <div key={r.label} className="border border-zinc-100 dark:border-zinc-800 rounded-lg p-3 text-xs space-y-1">
                      <div className={`font-semibold ${r.cls}`}>{r.label}</div>
                      <div className="text-zinc-500 dark:text-zinc-400">{r.states}</div>
                      <code className="block bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-700 dark:text-zinc-300 break-all">{r.calc}</code>
                    </div>
                  ))}
                </div>
                <p>Each state has its own standard deduction and personal exemption amounts. States currently phasing rates down (NC, GA, IA, IN, MO, MS, SC) have year-specific overrides applied automatically.</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 flex gap-2 flex-wrap"><Source>State Revenue Agencies</Source><Source href="https://taxfoundation.org/data/all/state/state-income-tax-rates/">Tax Foundation State Tax Data</Source></p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Budget Categories */}
        <section id="budget" data-section="budget" className="scroll-mt-16 lg:scroll-mt-20">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">Budget Categories</h2>
          <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-4">
            <p>Recommended ranges are expressed as a <strong className="text-zinc-800 dark:text-zinc-100">percentage of gross monthly income</strong> (not net). Gross is used because it&apos;s the standard benchmark across all published frameworks, making comparisons consistent regardless of effective tax rate.</p>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800">
                    <th className="px-3 py-2 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Category</th>
                    <th className="px-3 py-2 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Range</th>
                    <th className="px-3 py-2 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Bucket</th>
                    <th className="px-3 py-2 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Primary Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  <tr><td className="px-3 py-2">Housing</td><td className="px-3 py-2 font-mono">25–30%</td><td className="px-3 py-2 text-blue-600 dark:text-blue-400">Need</td><td className="px-3 py-2 text-zinc-400">28% mortgage qualifier (<A href="https://www.consumerfinance.gov/owning-a-home/">CFPB</A>, <A href="https://www.hud.gov/program_offices/housing/fhahistory">FHA</A>)</td></tr>
                  <tr><td className="px-3 py-2">Transportation</td><td className="px-3 py-2 font-mono">10–15%</td><td className="px-3 py-2 text-blue-600 dark:text-blue-400">Need</td><td className="px-3 py-2 text-zinc-400">All-in vehicle cost guideline (<A href="https://www.nerdwallet.com/auto-loans/learn/total-cost-owning-car">NerdWallet</A>)</td></tr>
                  <tr><td className="px-3 py-2">Food</td><td className="px-3 py-2 font-mono">10–15%</td><td className="px-3 py-2 text-blue-600 dark:text-blue-400">Need</td><td className="px-3 py-2 text-zinc-400"><A href="https://www.fns.usda.gov/research/cnpp/usda-food-plans/cost-food-monthly-reports">USDA Low Cost Food Plan</A></td></tr>
                  <tr><td className="px-3 py-2">Healthcare</td><td className="px-3 py-2 font-mono">5–10%</td><td className="px-3 py-2 text-blue-600 dark:text-blue-400">Need</td><td className="px-3 py-2 text-zinc-400"><A href="https://www.kff.org/health-costs/report/2024-employer-health-benefits-survey/">KFF Employer Health Benefits Survey</A></td></tr>
                  <tr><td className="px-3 py-2">Utilities &amp; Subscriptions</td><td className="px-3 py-2 font-mono">4–8%</td><td className="px-3 py-2 text-blue-600 dark:text-blue-400">Need</td><td className="px-3 py-2 text-zinc-400"><A href="https://www.bls.gov/cex/">BLS Consumer Expenditure Survey</A></td></tr>
                  <tr><td className="px-3 py-2">Life &amp; Disability Insurance</td><td className="px-3 py-2 font-mono">1–3%</td><td className="px-3 py-2 text-blue-600 dark:text-blue-400">Need</td><td className="px-3 py-2 text-zinc-400"><A href="https://www.ramseysolutions.com/dave-ramsey-7-baby-steps">Dave Ramsey Baby Steps</A></td></tr>
                  <tr><td className="px-3 py-2">Retirement Savings</td><td className="px-3 py-2 font-mono">10–15%</td><td className="px-3 py-2 text-emerald-600 dark:text-emerald-400">Save</td><td className="px-3 py-2 text-zinc-400"><A href="https://www.fidelity.com/viewpoints/retirement/how-much-do-i-need-to-retire">Fidelity: target 15% by age 35</A></td></tr>
                  <tr><td className="px-3 py-2">Emergency Fund</td><td className="px-3 py-2 font-mono">5–10%</td><td className="px-3 py-2 text-emerald-600 dark:text-emerald-400">Save</td><td className="px-3 py-2 text-zinc-400"><A href="https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/">CFPB Emergency Fund Guide</A></td></tr>
                  <tr><td className="px-3 py-2">Debt Repayment</td><td className="px-3 py-2 font-mono">0–15%</td><td className="px-3 py-2 text-blue-600 dark:text-blue-400">Need</td><td className="px-3 py-2 text-zinc-400"><A href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">CFPB: total DTI ≤36%</A></td></tr>
                  <tr><td className="px-3 py-2">Personal Care &amp; Clothing</td><td className="px-3 py-2 font-mono">2–5%</td><td className="px-3 py-2 text-amber-600 dark:text-amber-400">Want</td><td className="px-3 py-2 text-zinc-400"><A href="https://www.bls.gov/cex/">BLS Consumer Expenditure Survey</A></td></tr>
                  <tr><td className="px-3 py-2">Entertainment &amp; Fun</td><td className="px-3 py-2 font-mono">3–8%</td><td className="px-3 py-2 text-amber-600 dark:text-amber-400">Want</td><td className="px-3 py-2 text-zinc-400">50/30/20 &ldquo;wants&rdquo; allocation</td></tr>
                  <tr><td className="px-3 py-2">Giving &amp; Charity</td><td className="px-3 py-2 font-mono">0–10%</td><td className="px-3 py-2 text-amber-600 dark:text-amber-400">Want</td><td className="px-3 py-2 text-zinc-400"><A href="https://www.ramseysolutions.com/dave-ramsey-7-baby-steps">Dave Ramsey: 10% tithe guideline</A></td></tr>
                </tbody>
              </table>
            </div>
            {/* Mobile category cards */}
            <div className="sm:hidden divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden text-xs">
              {([
                { cat: 'Housing', range: '25–30%', bucket: 'Need', bucketCls: 'text-blue-600 dark:text-blue-400' },
                { cat: 'Transportation', range: '10–15%', bucket: 'Need', bucketCls: 'text-blue-600 dark:text-blue-400' },
                { cat: 'Food', range: '10–15%', bucket: 'Need', bucketCls: 'text-blue-600 dark:text-blue-400' },
                { cat: 'Healthcare', range: '5–10%', bucket: 'Need', bucketCls: 'text-blue-600 dark:text-blue-400' },
                { cat: 'Utilities & Subscriptions', range: '4–8%', bucket: 'Need', bucketCls: 'text-blue-600 dark:text-blue-400' },
                { cat: 'Life & Disability Insurance', range: '1–3%', bucket: 'Need', bucketCls: 'text-blue-600 dark:text-blue-400' },
                { cat: 'Retirement Savings', range: '10–15%', bucket: 'Save', bucketCls: 'text-emerald-600 dark:text-emerald-400' },
                { cat: 'Emergency Fund', range: '5–10%', bucket: 'Save', bucketCls: 'text-emerald-600 dark:text-emerald-400' },
                { cat: 'Debt Repayment', range: '0–15%', bucket: 'Need', bucketCls: 'text-blue-600 dark:text-blue-400' },
                { cat: 'Personal Care & Clothing', range: '2–5%', bucket: 'Want', bucketCls: 'text-amber-600 dark:text-amber-400' },
                { cat: 'Entertainment & Fun', range: '3–8%', bucket: 'Want', bucketCls: 'text-amber-600 dark:text-amber-400' },
                { cat: 'Giving & Charity', range: '0–10%', bucket: 'Want', bucketCls: 'text-amber-600 dark:text-amber-400' },
              ] as { cat: string; range: string; bucket: string; bucketCls: string }[]).map(r => (
                <div key={r.cat} className="flex items-center justify-between px-3 py-2.5 bg-white dark:bg-zinc-900">
                  <span className="text-zinc-700 dark:text-zinc-200 font-medium">{r.cat}</span>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className={`${r.bucketCls} font-medium`}>{r.bucket}</span>
                    <span className="font-mono text-zinc-500 dark:text-zinc-400 w-12 text-right">{r.range}</span>
                  </div>
                </div>
              ))}
            </div>
            <p>The <strong>status indicator</strong> on each category (✓ on track / ↑ over / ↓ under) compares entered actual spending against the recommended range. &ldquo;Under&rdquo; isn&apos;t always good — spending significantly under on healthcare or insurance may indicate underinsurance rather than frugality.</p>
          </div>
        </section>

        {/* 4. Budget Frameworks */}
        <section id="frameworks" data-section="frameworks" className="scroll-mt-16 lg:scroll-mt-20">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">Budget Frameworks</h2>
          <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-4">
            <p>The framework comparison table shows four established approaches applied to the given gross monthly income:</p>
            <div className="space-y-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
                <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">50/30/20 — Elizabeth Warren</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">50% needs · 30% wants · 20% savings</div>
                <p>Popularized in <em>All Your Worth: The Ultimate Lifetime Money Plan</em> (2005) by Senator Elizabeth Warren and Amelia Warren Tyagi. Designed as a flexible, sustainable framework for most Americans.</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
                <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Dave Ramsey — Baby Steps</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">55% needs · 20% wants · 25% savings/debt</div>
                <p>From <em>The Total Money Makeover</em> and Ramsey Solutions. More conservative on lifestyle, more aggressive on debt elimination. Allocates more to needs and less to discretionary wants.</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
                <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">FIRE (Lean) — Financial Independence</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">40% needs · 10% wants · 50% savings</div>
                <p>Popularized by Mr. Money Mustache and <em>Early Retirement Extreme</em> (Jacob Lund Fisker). Targets a 50%+ savings rate to achieve financial independence within 15–20 years. Best suited to high earners with low fixed costs.</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
                <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">70/20/10 — High Cost-of-Living</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">70% needs · 10% giving/fun · 20% savings</div>
                <p>Adapted for lower income households or very high cost-of-living markets (NYC, SF, Boston) where 70% of gross may legitimately go to essential living costs.</p>
              </div>
            </div>
            <CalloutInfo><strong>Note:</strong> No single framework fits everyone. Use the comparison table to see which framework most closely matches your actual spending, then use that as a planning target.</CalloutInfo>
          </div>
        </section>

        {/* 5. Health Check */}
        <section id="health" data-section="health" className="scroll-mt-16 lg:scroll-mt-20">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">Financial Health Check</h2>
          <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-4">
            <p>Enter account balances (checking, savings, retirement) to unlock the health check section. All three fields are optional.</p>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-100">Emergency Fund Coverage</h4>
            <Formula>{`liquid_total      = checking_balance + savings_balance
monthly_expenses = entered_actual_spending (or 80% of net if no actuals)
months_liquid    = liquid_total ÷ monthly_expenses`}</Formula>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-red-600 dark:text-red-400">Under 1 month:</strong> Critical — one unexpected expense becomes debt</li>
              <li><strong className="text-amber-600 dark:text-amber-400">1–3 months:</strong> Warning — minimum met, build toward 3+</li>
              <li><strong className="text-emerald-600 dark:text-emerald-400">3–6 months:</strong> On track — CFPB recommended minimum</li>
              <li><strong className="text-emerald-600 dark:text-emerald-400">6+ months:</strong> Fully funded — consider investing the excess</li>
            </ul>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 flex gap-2 flex-wrap"><Source href="https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/">CFPB — An Essential Guide to Building an Emergency Fund</Source><Source href="https://www.fidelity.com/viewpoints/personal-finance/emergency-fund">Fidelity — Emergency fund: Why you need one</Source></p>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-100 mt-4">Retirement Gap vs. Fidelity Milestones</h4>
            <p>Fidelity publishes age-based retirement savings targets as a multiple of current annual salary, assuming retirement at 68.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800">
                    <th className="px-3 py-2 text-left font-semibold text-zinc-500 dark:text-zinc-400">Age</th>
                    <th className="px-3 py-2 text-left font-semibold text-zinc-500 dark:text-zinc-400">Target</th>
                    <th className="px-3 py-2 text-left font-semibold text-zinc-500 dark:text-zinc-400">Example ($100k salary)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {([[30,'1×','$100,000'],[35,'2×','$200,000'],[40,'3×','$300,000'],[45,'4×','$400,000'],[50,'6×','$600,000'],[55,'7×','$700,000'],[60,'8×','$800,000'],[67,'10×','$1,000,000']] as [number, string, string][]).map(([age, mult, ex]) => (
                    <tr key={age}><td className="px-3 py-2">{age}</td><td className="px-3 py-2">{mult} salary</td><td className="px-3 py-2">{ex}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Formula>{`retirement_target = gross_annual × fidelity_multiplier_for_your_age
retirement_gap   = retirement_balance - retirement_target
                   (positive = ahead, negative = behind)`}</Formula>
            <p className="text-xs text-zinc-400 dark:text-zinc-500"><Source href="https://www.fidelity.com/viewpoints/retirement/how-much-do-i-need-to-retire">Fidelity — Retirement Savings Checkpoints by Age</Source></p>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-100 mt-4">Net Worth Estimate</h4>
            <Formula>{`net_worth_estimate = checking + savings + retirement_balance`}</Formula>
            <p>This is a simplified estimate that excludes liabilities (mortgage, student loans, credit cards), home equity, business equity, and non-retirement investments.</p>
          </div>
        </section>

        {/* 6. Insights Engine */}
        <section id="insights" data-section="insights" className="scroll-mt-16 lg:scroll-mt-20">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">Insights Engine</h2>
          <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-4">
            <p>Insights are generated automatically from entered spending and balances, tiered by urgency:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-red-50 dark:bg-red-950/40 border-l-4 border-red-500 rounded-r-xl p-3">
                <div className="font-semibold text-red-700 dark:text-red-300 text-xs uppercase mb-1">Critical</div>
                <p className="text-xs text-red-600 dark:text-red-400">Requires immediate attention. Left unaddressed, these erode financial stability.</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-r-xl p-3">
                <div className="font-semibold text-amber-700 dark:text-amber-300 text-xs uppercase mb-1">Warning</div>
                <p className="text-xs text-amber-600 dark:text-amber-400">Below recommended benchmarks. Take action before these become critical.</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 rounded-r-xl p-3">
                <div className="font-semibold text-green-700 dark:text-green-300 text-xs uppercase mb-1">On Track</div>
                <p className="text-xs text-green-600 dark:text-green-400">Meeting or exceeding the benchmark. Shows what to do next to optimize further.</p>
              </div>
            </div>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-100">What triggers each tier</h4>
            {(() => {
              const rows: [string, string, string, string][] = [
                ['Spending exceeds net income','total_actual > net_monthly','text-red-600 dark:text-red-400','Critical'],
                ['No emergency fund','months_liquid < 1','text-red-600 dark:text-red-400','Critical'],
                ['Housing cost extreme','housing > 38% of gross','text-red-600 dark:text-red-400','Critical'],
                ['High debt burden','debt > 20% of gross','text-red-600 dark:text-red-400','Critical'],
                ['No retirement at 30+','retirement = $0 & age ≥ 30','text-red-600 dark:text-red-400','Critical'],
                ['Far behind retirement target','gap < −50% of gross','text-red-600 dark:text-red-400','Critical'],
                ['Housing slightly over','30% < housing ≤ 38%','text-amber-600 dark:text-amber-400','Warning'],
                ['Thin emergency fund','1 ≤ months_liquid < 3','text-amber-600 dark:text-amber-400','Warning'],
                ['Low retirement savings','0 < retirement < 10% gross','text-amber-600 dark:text-amber-400','Warning'],
                ['Very thin monthly margin','surplus < 5% of net','text-amber-600 dark:text-amber-400','Warning'],
                ['Emergency fund ≥ 3 months','months_liquid ≥ 3','text-emerald-600 dark:text-emerald-400','On Track'],
                ['Retirement ≥ 10% of gross','retirement ≥ 10%','text-emerald-600 dark:text-emerald-400','On Track'],
                ['Housing efficient','housing ≤ 25%','text-emerald-600 dark:text-emerald-400','On Track'],
                ['Strong surplus','surplus ≥ 20% of net','text-emerald-600 dark:text-emerald-400','On Track'],
              ]
              return (
                <>
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-800">
                          <th className="px-3 py-2 text-left font-semibold text-zinc-500 dark:text-zinc-400">Insight</th>
                          <th className="px-3 py-2 text-left font-semibold text-zinc-500 dark:text-zinc-400">Condition</th>
                          <th className="px-3 py-2 text-left font-semibold text-zinc-500 dark:text-zinc-400">Tier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {rows.map(([insight, cond, cls, tier]) => (
                          <tr key={insight}>
                            <td className="px-3 py-2">{insight}</td>
                            <td className="px-3 py-2 font-mono">{cond}</td>
                            <td className={`px-3 py-2 ${cls}`}>{tier}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="sm:hidden divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
                    {rows.map(([insight, cond, cls, tier]) => (
                      <div key={insight} className="px-3 py-2.5 bg-white dark:bg-zinc-900 text-xs space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-zinc-700 dark:text-zinc-200 font-medium">{insight}</span>
                          <span className={`shrink-0 font-semibold ${cls}`}>{tier}</span>
                        </div>
                        <div className="font-mono text-zinc-400 dark:text-zinc-500">{cond}</div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Insights only appear when actual spending is entered. Balance insights (emergency fund, retirement) show whenever balances are entered.</p>
          </div>
        </section>

        {/* 7. Sources */}
        <section id="sources" data-section="sources" className="scroll-mt-16 lg:scroll-mt-20">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">Data Sources</h2>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800">
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">What</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Source</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-300">
                <tr><td className="px-4 py-2.5 font-medium">Federal tax brackets (2025)</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://www.irs.gov/pub/irs-drop/rp-24-40.pdf">IRS Rev. Proc. 2024-40</A></td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">Oct 2024</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">Federal tax brackets (2024)</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://www.irs.gov/pub/irs-drop/rp-23-34.pdf">IRS Rev. Proc. 2023-34</A></td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">Nov 2023</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">SS wage base</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://www.ssa.gov/oact/cola/cbb.html">SSA COLA Notice</A></td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">Annual (Oct)</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">State income tax rates</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://taxfoundation.org/data/all/state/state-income-tax-rates/">Tax Foundation</A> + state agencies</td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">Jan 2025</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">Emergency fund benchmark</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/">CFPB Emergency Fund Guide</A></td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">Ongoing</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">Retirement milestones</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://www.fidelity.com/viewpoints/retirement/how-much-do-i-need-to-retire">Fidelity Retirement Checkpoints</A></td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">Ongoing</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">50/30/20 rule</td><td className="px-4 py-2.5 text-zinc-400">Warren &amp; Tyagi — All Your Worth (2005)</td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">2005</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">Baby Steps / debt framework</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://www.ramseysolutions.com/store/books/the-total-money-makeover">Dave Ramsey — Total Money Makeover</A></td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">2003</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">FIRE savings rate</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://www.mrmoneymustache.com/">Mr. Money Mustache</A> / <A href="https://earlyretirementextreme.com/">Fisker — ERE</A></td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">2010</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">Housing 28% rule</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://www.consumerfinance.gov/owning-a-home/">CFPB</A> / <A href="https://www.hud.gov/program_offices/housing/fhahistory">FHA</A> guidelines</td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">Ongoing</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">Food cost benchmarks</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://www.fns.usda.gov/research/cnpp/usda-food-plans/cost-food-monthly-reports">USDA Low-Cost Food Plan</A></td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">Monthly</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">DTI limits</td><td className="px-4 py-2.5 text-zinc-400"><A href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/">CFPB DTI Guidance</A></td><td className="px-4 py-2.5 text-zinc-400 whitespace-nowrap">Ongoing</td></tr>
              </tbody>
            </table>
          </div>
          {/* Mobile source list */}
          <div className="sm:hidden divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
            {([
              ['Federal tax brackets (2025)', 'IRS Rev. Proc. 2024-40', 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf', 'Oct 2024'],
              ['Federal tax brackets (2024)', 'IRS Rev. Proc. 2023-34', 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf', 'Nov 2023'],
              ['SS wage base', 'SSA COLA Notice', 'https://www.ssa.gov/oact/cola/cbb.html', 'Annual (Oct)'],
              ['State income tax rates', 'Tax Foundation + state agencies', 'https://taxfoundation.org/data/all/state/state-income-tax-rates/', 'Jan 2025'],
              ['Emergency fund benchmark', 'CFPB Emergency Fund Guide', 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/', 'Ongoing'],
              ['Retirement milestones', 'Fidelity Retirement Checkpoints', 'https://www.fidelity.com/viewpoints/retirement/how-much-do-i-need-to-retire', 'Ongoing'],
              ['50/30/20 rule', 'Warren & Tyagi — All Your Worth (2005)', '', '2005'],
              ['Baby Steps / debt framework', 'Dave Ramsey — Total Money Makeover', 'https://www.ramseysolutions.com/store/books/the-total-money-makeover', '2003'],
              ['FIRE savings rate', 'Mr. Money Mustache / Fisker — ERE', 'https://www.mrmoneymustache.com/', '2010'],
              ['Housing 28% rule', 'CFPB / FHA guidelines', 'https://www.consumerfinance.gov/owning-a-home/', 'Ongoing'],
              ['Food cost benchmarks', 'USDA Low-Cost Food Plan', 'https://www.fns.usda.gov/research/cnpp/usda-food-plans/cost-food-monthly-reports', 'Monthly'],
              ['DTI limits', 'CFPB DTI Guidance', 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/', 'Ongoing'],
            ] as [string, string, string, string][]).map(([what, src, href, updated]) => (
              <div key={what} className="px-3 py-3 bg-white dark:bg-zinc-900 text-xs">
                <div className="font-medium text-zinc-700 dark:text-zinc-200 mb-0.5">{what}</div>
                <div className="flex items-center justify-between gap-2">
                  {href ? <A href={href}>{src}</A> : <span className="text-zinc-400">{src}</span>}
                  <span className="text-zinc-400 whitespace-nowrap shrink-0">{updated}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Limitations */}
        <section id="limitations" data-section="limitations" className="scroll-mt-16 lg:scroll-mt-20">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">Known Limitations</h2>
          <CalloutWarn><strong>This tool models a simplified, standardized taxpayer.</strong> Actual tax liability will differ if any of the following apply.</CalloutWarn>
          <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            <ul className="space-y-3">
              {([
                ['Standard deduction only.', 'Itemized deductions (mortgage interest, charitable contributions, SALT cap) are not modeled. If you itemize, federal taxable income is lower and actual tax is less than shown.'],
                ['No tax credits.', 'The child tax credit, EITC, education credits, and EV credits can substantially reduce taxes owed and are not included.'],
                ['No local taxes.', 'City and county income taxes are excluded — notably NYC (3.08–3.88%), Yonkers (1.48%), Philadelphia (3.75%), Baltimore (2.25%), and Ohio municipal taxes (1–2.5%).'],
                ['No self-employment tax.', 'Freelancers and 1099 contractors pay both halves of FICA (15.3% combined) rather than the 7.65% modeled. The SE deduction is also not included.'],
                ['No capital gains.', 'Long-term capital gains (0%, 15%, 20%) and qualified dividends are taxed differently from ordinary income and are not modeled.'],
                ['No AMT.', 'The Alternative Minimum Tax can apply to high-income filers with certain deductions and is not modeled.'],
                ['Pre-tax benefits not modeled.', '401(k), HSA, FSA, and employer-paid premiums reduce taxable income. Entering gross salary without accounting for these makes modeled tax slightly higher than actual.'],
                ['State rates may lag mid-transition.', 'Seven states are phasing rates down annually (NC, GA, IN, IA, MO, MS, SC). Post-2025 phase-down steps will need a new override entry each year.'],
                ['Single income modeled.', 'Two-income households (MFJ) should enter combined gross. Marriage penalty/bonus effects are not modeled in detail.'],
                ['Retirement balance excludes liabilities.', 'The net worth estimate excludes home equity, car equity, non-retirement investments, and all liabilities.'],
              ] as [string, string][]).map(([title, body]) => (
                <li key={title} className="flex gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">⚠</span>
                  <span><strong className="text-zinc-800 dark:text-zinc-100">{title}</strong> {body}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 9. Tips */}
        <section id="tips" data-section="tips" className="scroll-mt-16 lg:scroll-mt-20">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">Tips for Best Results</h2>
          <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                ['Use W-2 for income', 'Use Box 1 (wages) from your W-2 rather than stated salary. Box 1 already subtracts pre-tax 401(k) and HSA contributions, making the calculation more accurate.'],
                ['Update every January', 'After receiving your W-2 and after major income changes (raise, new job, bonus), re-run the calculator. New tax year data is applied automatically.'],
                ['Enter actuals for real insights', 'The insights engine is only as useful as your actual spending data. Enter real monthly amounts from bank or credit card statements.'],
                ['Include all retirement accounts', 'The retirement balance field should total all accounts: 401(k), 403(b), IRA, Roth IRA, SEP-IRA, etc.'],
                ['Re-run after life events', 'Major changes that affect taxes or budget: marriage, divorce, having a child, buying a home, starting a business, or changing states.'],
                ['Use it for scenario planning', 'Try different income levels to see the tax impact of a raise. Adjust housing costs to evaluate a move decision.'],
              ] as [string, string][]).map(([title, body]) => (
                <div key={title} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-2">{title}</div>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <CalloutInfo><strong>Consult a professional for complex situations.</strong> For situations involving business income, significant investments, inheritance, or major tax events, consult a Certified Public Accountant (CPA) or Certified Financial Planner (CFP).</CalloutInfo>
          </div>
        </section>

        <footer className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500 space-y-1">
          <p>Tax rates: IRS Publication 15-T &amp; state revenue agencies. Local taxes not included.</p>
          <p>Budget benchmarks: CFPB, Fidelity, Vanguard, NerdWallet, Dave Ramsey, Elizabeth Warren (50/30/20).</p>
          <p>This guide is for informational and educational purposes only and does not constitute tax or financial advice.</p>
        </footer>
        </article>
      </div>
    </div>
  )
}
