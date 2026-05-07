const API = process.env.BUDGET_API_URL ?? 'http://localhost:8001'

export async function GET() {
  const res = await fetch(`${API}/api/states`, { next: { revalidate: 3600 } })
  const data = await res.json()
  return Response.json(data)
}
