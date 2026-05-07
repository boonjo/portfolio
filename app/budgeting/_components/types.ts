export interface FederalTax {
  tax: number
  effective_rate: number
  marginal_rate: number
  standard_deduction: number
  taxable_income: number
}

export interface StateTax {
  tax: number
  effective_rate: number
  marginal_rate: number
  name: string
  notes?: string
}

export interface FICA {
  social_security: number
  medicare: number
  additional_medicare: number
  total: number
}

export interface TaxResult {
  gross: number
  pretax_contrib: number
  federal: FederalTax
  state: StateTax
  fica: FICA
  total_tax: number
  net_annual: number
  net_monthly: number
  effective_rate: number
  tax_year: number
  rates_current: boolean
  marginal_combined: number
}

export interface Category {
  key: string
  label: string
  bucket: 'needs' | 'wants' | 'savings'
  monthly_min: number
  monthly_max: number
  pct_max: number
  note: string
  detail: string
  actual?: number
  status?: 'ok' | 'over' | 'under'
}

export interface Framework {
  name: string
  best_for: string
  needs: number
  wants: number
  savings: number
  needs_monthly: number
  wants_monthly: number
  savings_monthly: number
}

export interface Insight {
  tier: 'critical' | 'warning' | 'good'
  icon: string
  title: string
  body: string
  action: string
}

export interface Health {
  checking: number
  savings: number
  retirement_balance: number
  months_liquid: number
  liquid_total: number
  monthly_expenses_used: number
  net_worth_estimate: number
  retirement_target: number | null
  retirement_gap: number
  retirement_milestone_age: number | null
}

export interface SSEstimate {
  at_62: number
  at_67: number
  at_70: number
  annual_at_67: number
  years_to_fra: number | null
}

export interface Milestone {
  label: string
  amount: number
  note: string
  past: boolean
}

export interface BudgetResult {
  taxes: TaxResult
  health?: Health
  ss_estimate?: SSEstimate
  insights?: Insight[]
  categories: Category[]
  frameworks: Framework[]
  milestones: Milestone[]
  gross_monthly: number
  net_monthly: number
  dti?: number
  surplus?: number
}

export interface StateOption {
  code: string
  name: string
}

// [input-key, display-label, submit-key]
export const CATEGORY_LABELS: [string, string, string][] = [
  ['housing',        'Housing (rent/mortgage)',     'housing'],
  ['transportation', 'Transportation',              'transportation'],
  ['groceries',      'Groceries',                   'food'],
  ['dining_out',     'Dining Out',                  'food'],
  ['healthcare',     'Healthcare',                  'healthcare'],
  ['utilities',      'Utilities & Subscriptions',   'utilities'],
  ['insurance',      'Life & Disability Insurance', 'insurance'],
  ['retirement',     'Retirement Savings',          'retirement'],
  ['emergency_fund', 'Emergency Fund Building',     'emergency_fund'],
  ['debt',           'Debt Repayment',              'debt'],
  ['personal',       'Personal Care & Clothing',    'personal'],
  ['entertainment',  'Entertainment & Fun',         'entertainment'],
  ['giving',         'Giving & Charity',            'giving'],
]

export const PERSIST_KEY = 'budget_form_v2'
