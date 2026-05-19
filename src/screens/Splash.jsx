import { useEffect } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { C } from '../tokens.js'

export default function Splash({ navigate }) {
  useEffect(() => {
    const t = setTimeout(() => navigate('onboarding'), 2200)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div onClick={() => navigate('onboarding')} style={{
      width: '100%', height: '100%',
      background: C.coral,
      position: 'relative', overflow: 'hidden',
      cursor: 'pointer',
      userSelect: 'none',
    }}>
      {/* Radial highlight */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.25) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <StatusBar dark />

      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', color: '#fff', padding: '0 32px',
      }}>
        <div style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 76, fontStyle: 'italic', fontWeight: 400,
          letterSpacing: -2, lineHeight: 1,
        }}>
          coopers<span style={{ color: C.sand }}>.</span>
        </div>
        <div style={{
          marginTop: 16, fontSize: 15, fontWeight: 500,
          opacity: 0.95, textAlign: 'center', letterSpacing: 0.1,
        }}>
          Les meilleurs bons plans<br />de la Guadeloupe.
        </div>

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 80, display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: 3,
              background: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
            }} />
          ))}
        </div>
      </div>

      <HomeIndicator dark />
    </div>
  )
}
