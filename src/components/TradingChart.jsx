import React, { useEffect, useRef, useState } from 'react'
import { useTradeStore } from '../store/tradeStore'
import { TIMEFRAMES } from '../utils/markets'

const UP_COLOR   = '#10B981'
const DOWN_COLOR = '#EF4444'
const GRID_COLOR = '#1E2D4530'
const TEXT_COLOR = '#475569'
const CROSS_COLOR= '#2563EB80'

export default function TradingChart() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const chartData = useTradeStore(s => s.chartData)
  const tickData  = useTradeStore(s => s.tickData)
  const activeMarket = useTradeStore(s => s.activeMarket)
  const chartTimeframe = useTradeStore(s => s.chartTimeframe)
  const setChartTimeframe = useTradeStore(s => s.setChartTimeframe)

  const [mouse, setMouse] = useState(null)
  const [offset, setOffset] = useState(0)
  const dragging = useRef(false)
  const dragStart = useRef(0)
  const dragOffset = useRef(0)
  const animRef = useRef(null)

  const tick = tickData[activeMarket?.id]
  const price = tick?.price || 0
  const changeP = tick?.changeP || 0
  const isUp = changeP >= 0

  const CANDLE_W = 10
  const CANDLE_GAP = 3
  const STEP = CANDLE_W + CANDLE_GAP

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const padLeft = 12
    const padRight = 70
    const padTop = 20
    const padBot = 36

    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = '#070B14'
    ctx.fillRect(0, 0, W, H)

    const data = chartData
    if (!data || data.length < 2) return

    const visible = Math.floor((W - padLeft - padRight) / STEP)
    const totalCandles = data.length
    const startIdx = Math.max(0, totalCandles - visible - Math.round(offset / STEP))
    const endIdx = Math.min(totalCandles, startIdx + visible + 2)
    const slice = data.slice(startIdx, endIdx)

    if (!slice.length) return

    const highs = slice.map(c => c.high)
    const lows  = slice.map(c => c.low)
    const maxP = Math.max(...highs)
    const minP = Math.min(...lows)
    const range = maxP - minP || 1

    const toY = (p) => padTop + (H - padTop - padBot) * (1 - (p - minP) / range)

    // Grid lines
    ctx.strokeStyle = GRID_COLOR
    ctx.lineWidth = 1
    const gridLines = 6
    for (let i = 0; i <= gridLines; i++) {
      const y = padTop + i * (H - padTop - padBot) / gridLines
      ctx.beginPath(); ctx.moveTo(padLeft, y); ctx.lineTo(W - padRight, y); ctx.stroke()
      const p = maxP - (i / gridLines) * range
      ctx.fillStyle = TEXT_COLOR
      ctx.font = '10px JetBrains Mono'
      ctx.textAlign = 'left'
      ctx.fillText(formatPrice(p, activeMarket), W - padRight + 4, y + 3)
    }

    // Time labels
    ctx.fillStyle = TEXT_COLOR
    ctx.font = '10px JetBrains Mono'
    ctx.textAlign = 'center'
    slice.forEach((c, i) => {
      if (i % Math.max(1, Math.floor(visible / 8)) === 0) {
        const x = padLeft + i * STEP + CANDLE_W / 2
        const d = new Date((c.time || 0) * 1000)
        const label = d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0')
        ctx.fillText(label, x, H - padBot + 16)
      }
    })

    // Candles
    slice.forEach((c, i) => {
      const x = padLeft + i * STEP
      const openY  = toY(c.open)
      const closeY = toY(c.close)
      const highY  = toY(c.high)
      const lowY   = toY(c.low)
      const isGreen = c.close >= c.open
      const color = isGreen ? UP_COLOR : DOWN_COLOR

      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x + CANDLE_W / 2, highY)
      ctx.lineTo(x + CANDLE_W / 2, lowY)
      ctx.stroke()

      ctx.fillStyle = color
      const bodyTop = Math.min(openY, closeY)
      const bodyH = Math.max(1, Math.abs(closeY - openY))
      ctx.fillRect(x, bodyTop, CANDLE_W, bodyH)
    })

    // Current price line
    if (price > 0) {
      const py = toY(price)
      ctx.strokeStyle = isUp ? '#10B98180' : '#EF444480'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath(); ctx.moveTo(padLeft, py); ctx.lineTo(W - padRight, py); ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = isUp ? UP_COLOR : DOWN_COLOR
      ctx.fillRect(W - padRight, py - 9, padRight, 18)
      ctx.fillStyle = '#fff'
      ctx.font = '10px JetBrains Mono'
      ctx.textAlign = 'center'
      ctx.fillText(formatPrice(price, activeMarket), W - padRight / 2, py + 3)
    }

    // Crosshair
    if (mouse) {
      ctx.strokeStyle = CROSS_COLOR
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath(); ctx.moveTo(mouse.x, padTop); ctx.lineTo(mouse.x, H - padBot); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(padLeft, mouse.y); ctx.lineTo(W - padRight, mouse.y); ctx.stroke()
      ctx.setLineDash([])
    }
  }

  function formatPrice(p, market) {
    if (!market) return p.toFixed(5)
    if (market.symbol.includes('JPY') || p > 1000) return p.toFixed(2)
    if (p > 100) return p.toFixed(2)
    if (p < 0.01) return p.toFixed(6)
    return p.toFixed(5)
  }

  // Resize observer
  useEffect(() => {
    const obs = new ResizeObserver(() => {
      const el = containerRef.current
      if (!el || !canvasRef.current) return
      canvasRef.current.width  = el.clientWidth
      canvasRef.current.height = el.clientHeight
      draw()
    })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  })

  // Drag scroll
  function onMouseDown(e) {
    dragging.current = true
    dragStart.current = e.clientX
    dragOffset.current = offset
  }
  function onMouseMove(e) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    if (dragging.current) {
      const dx = e.clientX - dragStart.current
      setOffset(Math.max(0, dragOffset.current - dx))
    }
  }
  function onMouseUp() { dragging.current = false }
  function onMouseLeave() { dragging.current = false; setMouse(null) }

  return (
    <div className="chart-wrap" style={{ height: '100%', minHeight: 400 }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:18 }}>{activeMarket?.icon}</span>
          <div>
            <div style={{ fontWeight:700, fontSize:15, letterSpacing:-0.3 }}>{activeMarket?.symbol}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)' }}>{activeMarket?.name}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
            <span className="mono" style={{ fontSize:16, fontWeight:600, color: isUp ? 'var(--neon-green)':'var(--neon-red)' }}>
              {formatPrice(price, activeMarket)}
            </span>
            <span className={`badge ${isUp?'badge-up':'badge-down'}`} style={{ fontSize:10 }}>
              {isUp?'▲':'▼'} {Math.abs(changeP).toFixed(3)}%
            </span>
          </div>
        </div>

        {/* Timeframe selector */}
        <div style={{ display:'flex', gap:3 }}>
          {TIMEFRAMES.map(tf => (
            <button
              key={tf.seconds}
              className={`tab-item ${chartTimeframe === tf.seconds ? 'active' : ''}`}
              onClick={() => setChartTimeframe(tf.seconds)}
              style={{ fontSize:11, padding:'4px 8px' }}
            >{tf.label}</button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} style={{ flex:1, height:'calc(100% - 57px)' }}>
        <canvas
          ref={canvasRef}
          style={{ width:'100%', height:'100%', cursor:'crosshair' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        />
      </div>
    </div>
  )

  function formatPrice(p, m) {
    if (!m || !p) return '0.00'
    if (m.symbol.includes('JPY') || p > 1000) return p.toFixed(2)
    if (p > 100) return p.toFixed(2)
    if (p < 0.01) return p.toFixed(6)
    return p.toFixed(5)
  }
}
