'use client'
import { useEffect, useRef } from 'react'
import { RiskLevel, RISK_GAUGE_COLOR } from './types'

type Props = {
  score: number
  level: RiskLevel
  size?: number
}

export function RiskGauge({ score, level, size = 160 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const color = RISK_GAUGE_COLOR[level]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = size * 0.38
    const lineWidth = size * 0.1
    const startAngle = Math.PI * 0.75
    const sweepAngle = Math.PI * 1.5

    // Track
    ctx.beginPath()
    ctx.arc(cx, cy, r, startAngle, startAngle + sweepAngle)
    ctx.strokeStyle = 'rgba(128,128,128,0.15)'
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke()

    // Fill
    const filled = (score / 100) * sweepAngle
    ctx.beginPath()
    ctx.arc(cx, cy, r, startAngle, startAngle + filled)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke()
  }, [score, color, size])

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="absolute inset-0"
      />
      <div className="flex flex-col items-center">
        <span className="text-3xl font-semibold tabular-nums leading-none" style={{ color }}>
          {Math.round(score)}
        </span>
        <span className="mt-1 text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {level} risk
        </span>
      </div>
    </div>
  )
}
