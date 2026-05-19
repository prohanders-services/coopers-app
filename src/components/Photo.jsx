export default function Photo({ src, gradient, emoji, h = 200, r = 16, style = {} }) {
  if (src) {
    return (
      <div style={{ width: '100%', height: h, borderRadius: r, overflow: 'hidden', position: 'relative', ...style }}>
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    )
  }
  return (
    <div style={{
      width: '100%', height: h, borderRadius: r,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.min(h * 0.5, 80),
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      <span style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>{emoji}</span>
    </div>
  )
}
