import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const playerId = parseInt(id, 10)
  if (isNaN(playerId) || playerId <= 0) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 })
  }

  const sql = neon(process.env.HEALTHBALL_DATABASE_URL!)

  const [player] = await sql`
    SELECT
      p.player_id,
      p.name,
      p.position,
      p.age,
      p.nationality,
      p.currently_injured,
      COALESCE(r.risk_score, 0)     AS risk_score,
      COALESCE(r.risk_level, 'low') AS risk_level,
      r.features
    FROM players p
    LEFT JOIN LATERAL (
      SELECT risk_score, risk_level, features
      FROM risk_scores
      WHERE player_id = p.player_id
      ORDER BY computed_at DESC
      LIMIT 1
    ) r ON true
    WHERE p.player_id = ${playerId}
  `

  if (!player) {
    return NextResponse.json({ error: 'player not found' }, { status: 404 })
  }

  const injuries = await sql`
    SELECT
      injury_id,
      season,
      injury_type,
      injury_from,
      injury_to,
      days_out,
      games_missed
    FROM injuries
    WHERE player_id = ${playerId}
    ORDER BY injury_from DESC NULLS LAST
  `

  return NextResponse.json({ ...player, injuries })
}
