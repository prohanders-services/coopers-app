import { C } from '../tokens.js'

export default function StickyCTA({ children, color = C.ink, sub, dark = false, onClick }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      padding: '14px 16px 36px',
      background: dark
        ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 40%)'
        : 'linear-gradient(180deg, rgba(247,244,238,0) 0%, rgba(247,244,238,0.95) 40%)',
      backdropFilter: 'blur(8px)',
    }}>
      {sub && (
        <div style={{ textAlign: 'center', fontSize: 12, color: dark ? 'rgba(255,255,255,0.6)' : C.gray500, marginBottom: 8 }}>
          {sub}
        </div>
      )}
      <button onClick={onClick} style={{
        width: '100%', background: color, color: dark ? '#000' : '#fff',
        height: 56, borderRadius: 999, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 600, letterSpacing: -0.2,
        boxShadow: '0 6px 20px rgba(22,22,26,0.25)',
        fontFamily: 'inherit',
      }}>
        {children}
      </button>
    </div>
  )
}
