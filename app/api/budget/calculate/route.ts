import { NextRequest } from 'next/server'

const API = process.env.BUDGET_API_URL ?? 'http://localhost:8001'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${API}/api/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text()
      let data: unknown
      try { data = JSON.parse(text) } catch { data = { error: text || 'upstream error' } }
      return Response.json(data, { status: res.status })
    }
    const data = await res.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'failed to reach budget API' }, { status: 502 })
  }
}
