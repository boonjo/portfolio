const API = process.env.BUDGET_API_URL ?? 'http://localhost:8001'

export async function GET() {
  try {
    const res = await fetch(`${API}/api/states`, { next: { revalidate: 3600 } })
    if (!res.ok) return Response.json({ error: 'upstream error' }, { status: res.status })
    const data = await res.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'failed to fetch states' }, { status: 502 })
  }
}
