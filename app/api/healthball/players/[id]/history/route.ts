import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const playerId = parseInt(id, 10)
  if (isNaN(playerId)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 })
  }

  const sql = neon(process.env.HEALTHBALL_DATABASE_URL!)

  const rows = await sql`
    SELECT
      risk_score,
      risk_level,
      computed_at
    FROM risk_scores
    WHERE player_id = ${playerId}
    ORDER BY computed_at ASC
  `

  return NextResponse.json(rows)
}
