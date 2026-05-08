'use client'
import { useEffect, useState, useMemo } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Player, POSITION_ORDER } from './_components/types'
import { PlayerCard } from './_components/PlayerCard'
import { PlayerDrawer } from './_components/PlayerDrawer'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

type Filter = 'all' | 'high' | 'medium' | 'low' | 'injured'
type Sort = 'risk' | 'position' | 'name'

export default function HealthballPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Player | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('risk')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/healthball/players')
      .then((r) => r.json())
      .then((d) => setPlayers(d))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = players
    if (filter === 'injured') {
      list = list.filter((p) => p.currently_injured)
    } else if (filter !== 'all') {
      list = list.filter((p) => p.risk_level === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.position.toLowerCase().includes(q),
      )
    }
    return [...list].sort((a, b) => {
      if (sort === 'risk') return b.risk_score - a.risk_score
      if (sort === 'position') {
        return POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position)
      }
      return a.name.localeCompare(b.name)
    })
  }, [players, filter, sort, search])

  const counts = useMemo(() => ({
    high:    players.filter((p) => p.risk_level === 'high').length,
    medium:  players.filter((p) => p.risk_level === 'medium').length,
    low:     players.filter((p) => p.risk_level === 'low').length,
    injured: players.filter((p) => p.currently_injured).length,
  }), [players])

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-screen-sm px-4 pb-24 pt-12">
        {/* Back nav */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Healthball
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Injury risk predictions for Arsenal FC players — powered by career injury history,
            workload, and age.
          </p>

          {/* Summary pills */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 flex flex-wrap gap-2"
            >
              <SummaryPill label="High risk"    count={counts.high}    color="text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900" />
              <SummaryPill label="Medium risk"  count={counts.medium}  color="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900" />
              <SummaryPill label="Low risk"     count={counts.low}     color="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900" />
              {counts.injured > 0 && (
                <SummaryPill label="Out injured" count={counts.injured} color="text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900" />
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-3"
        >
          <input
            type="text"
            placeholder="Search players…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
          />
          <div className="flex gap-2 flex-wrap">
            <FilterBtn active={filter === 'all'}     onClick={() => setFilter('all')}     label="All" />
            <FilterBtn active={filter === 'high'}    onClick={() => setFilter('high')}    label="High" />
            <FilterBtn active={filter === 'medium'}  onClick={() => setFilter('medium')}  label="Medium" />
            <FilterBtn active={filter === 'low'}     onClick={() => setFilter('low')}     label="Low" />
            <FilterBtn active={filter === 'injured'} onClick={() => setFilter('injured')} label="Out" accent />
            <div className="ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="risk">Sort: Risk</option>
                <option value="position">Sort: Position</option>
                <option value="name">Sort: Name</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No players match your filter.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            variants={VARIANTS_CONTAINER}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((player) => (
              <motion.div key={player.player_id} variants={VARIANTS_ITEM}>
                <PlayerCard player={player} onClick={() => setSelected(player)} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Methodology note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-xs text-zinc-400 dark:text-zinc-600"
        >
          Risk scores (0–100) combine career injury frequency, severity (ligament/muscle type),
          recency, age, and current availability. Data sourced from Transfermarkt. Updated seasonally.
        </motion.p>
      </div>

      <PlayerDrawer player={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function FilterBtn({
  active,
  onClick,
  label,
  accent,
}: {
  active: boolean
  onClick: () => void
  label: string
  accent?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
        active && accent
          ? 'bg-orange-600 text-white dark:bg-orange-500 dark:text-white'
          : active
          ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
          : accent
          ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:hover:bg-orange-950/70'
          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
      }`}
    >
      {label}
    </button>
  )
}

function SummaryPill({
  label,
  count,
  color,
}: {
  label: string
  count: number
  color: string
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${color}`}>
      <span className="tabular-nums font-semibold">{count}</span>
      {label}
    </span>
  )
}
