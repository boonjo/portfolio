export type RiskLevel = 'low' | 'medium' | 'high'

export type Player = {
  player_id: number
  name: string
  position: string
  age: number
  nationality: string
  currently_injured: boolean
  risk_score: number
  risk_level: RiskLevel
  total_injuries: number
  total_days_out: number
}

export type Injury = {
  injury_id: number
  season: string
  injury_type: string
  injury_from: string | null
  injury_to: string | null
  days_out: number | null
  games_missed: number | null
}

export type PlayerDetail = Player & {
  features: Record<string, number> | null
  injuries: Injury[]
}

export const INJURED_BADGE = 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'

export const RISK_COLOR: Record<RiskLevel, string> = {
  low:    'text-emerald-600 dark:text-emerald-400',
  medium: 'text-amber-500  dark:text-amber-400',
  high:   'text-red-600    dark:text-red-500',
}

export const RISK_BG: Record<RiskLevel, string> = {
  low:    'bg-emerald-50  dark:bg-emerald-950/40 border-emerald-200  dark:border-emerald-800',
  medium: 'bg-amber-50    dark:bg-amber-950/40   border-amber-200    dark:border-amber-800',
  high:   'bg-red-50      dark:bg-red-950/40     border-red-200      dark:border-red-800',
}

export const RISK_GAUGE_COLOR: Record<RiskLevel, string> = {
  low:    '#10b981',
  medium: '#f59e0b',
  high:   '#ef4444',
}

export const POSITION_ORDER = ['GK', 'RB', 'CB', 'LB', 'WB', 'CM', 'CAM', 'IW', 'RW', 'LW', 'WF', 'CF']
