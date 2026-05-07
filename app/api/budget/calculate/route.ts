import { NextRequest } from 'next/server'

const API = process.env.BUDGET_API_URL ?? 'http://localhost:8001'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch(`${API}/api/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) return Response.json(data, { status: res.status })
  return Response.json(data)
}
