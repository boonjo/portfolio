export function fmt(n: number): string {
  return (n < 0 ? '-$' : '$') + Math.round(Math.abs(n)).toLocaleString()
}

export function fmtPct(n: number): string {
  return (n * 100).toFixed(1) + '%'
}

export function fmtRate(n: number): string {
  return (n * 100).toFixed(2) + '%'
}
