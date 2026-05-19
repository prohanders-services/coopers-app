export default function FakeQR({ size = 180, fg = '#000', bg = '#fff' }) {
  const cells = 21
  const cs = size / cells
  const rects = []
  let seed = 7
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }

  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const inFinder = (x < 7 && y < 7) || (x >= cells - 7 && y < 7) || (x < 7 && y >= cells - 7)
      let on
      if (inFinder) {
        const fx = x < 7 ? x : (x >= cells - 7 ? x - (cells - 7) : x)
        const fy = y < 7 ? y : (y >= cells - 7 ? y - (cells - 7) : y)
        on = (fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4))
      } else {
        on = rand() > 0.55
      }
      if (on) rects.push({ x: x * cs, y: y * cs })
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: bg, display: 'block' }}>
      {rects.map((r, i) => <rect key={i} x={r.x} y={r.y} width={cs} height={cs} fill={fg} />)}
    </svg>
  )
}
