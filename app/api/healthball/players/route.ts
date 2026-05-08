import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const sql = neon(process.env.HEALTHBALL_DATABASE_URL!)

  const rows = await sql`
    SELECT
      p.player_id,
      p.name,
      p.position,
      p.age,
      p.nationality,
      p.currently_injured,
      COALESCE(r.risk_score, 0)     AS risk_score,
      COALESCE(r.risk_level, 'low') AS risk_level,
      COUNT(i.injury_id)::int       AS total_injuries,
      COALESCE(SUM(i.days_out), 0)::int AS total_days_out
    FROM players p
    LEFT JOIN risk_scores r ON r.player_id = p.player_id
    LEFT JOIN injuries    i ON i.player_id = p.player_id
    GROUP BY p.player_id, p.name, p.position, p.age, p.nationality,
             p.currently_injured, r.risk_score, r.risk_level
    ORDER BY COALESCE(r.risk_score, 0) DESC
  `

  return NextResponse.json(rows)
}
