import { useEffect, useState } from 'react'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { C } from '../tokens.js'

const LEVEL = {
  emoji: '🌊', name: 'Turquoise', gradient: 'linear-gradient(135deg,#5BB8E2,#0E8C7E)',
  benefits: [
    { emoji: '⚡', text: 'Double points le week-end' },
    { emoji: '🌟', text: 'Coops partenaires premium débloqués' },
    { emoji: '🎟️', text: 'Invitations aux événements Coopers' },
    { emoji: '🏄', text: 'Accès aux Coops nautiques exclusifs' },
  ],
}

const CONFETTI = [
  { x: 10, delay: 0,    color: '#FF5A5F', size: 8,  shape: 'circle' },
  { x: 25, delay: 0.2,  color: '#F4C24A', size: 6,  shape: 'square' },
  { x: 40, delay: 0.05, color: '#0E8C7E', size: 10, shape: 'circle' },
  { x: 55, delay: 0.3,  color: '#FF5A5F', size: 7,  shape: 'square' },
  { x: 70, delay: 0.1,  color: '#5BB8E2', size: 9,  shape: 'circle' },
  { x: 85, delay: 0.25, color: '#F4C24A', size: 8,  shape: 'circle' },
  { x: 15, delay: 0.4,  color: '#9B59B6', size: 6,  shape: 'square' },
  { x: 60, delay: 0.15, color: '#0E8C7E', size: 7,  shape: 'circle' },
  { x: 78, delay: 0.35, color: '#FF5A5F', size: 5,  shape: 'square' },
  { x: 48, delay: 0.45, color: '#F4C24A', size: 9,  shape: 'circle' },
  { x: 32, delay: 0.08, color: '#5BB8E2', size: 6,  shape: 'square' },
  { x: 92, delay: 0.28, color: '#9B59B6', size: 8,  shape: 'circle' },
]

export default function LevelUp({ navigate }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg,#0E8C7E 0%,#2C4A52 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {/* Confetti */}
      {visible && CONFETTI.map((c, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            position: 'absolute',
            left: `${c.x}%`,
            top: -20,
            width: c.size,
            height: c.size,
            borderRadius: c.shape === 'circle' ? '50%' : 2,
            background: c.color,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      {/* Bg glow */}
      <div style={{
        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 400, borderRadius: 200,
        background: 'radial-gradient(circle,rgba(91,184,226,0.3) 0%,transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '60px 28px 20px', textAlign: 'center',
        position: 'relative', zIndex: 1,
      }}>
        {/* Badge */}
        <div style={{
          width: 130, height: 130, borderRadius: 65,
          background: LEVEL.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 58,
          boxShadow: '0 0 0 12px rgba(91,184,226,0.15), 0 0 0 24px rgba(91,184,226,0.08), 0 16px 40px rgba(0,0,0,0.3)',
          animation: 'levelBadgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
          animationDelay: '0.2s',
        }}>
          {LEVEL.emoji}
        </div>

        {/* Level name */}
        <div style={{
          marginTop: 24,
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 42, fontStyle: 'italic', letterSpacing: -0.8, lineHeight: 1,
          color: '#fff',
        }}>
          Niveau {LEVEL.name}
        </div>

        {/* Title */}
        <div style={{ marginTop: 10, fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
          Félicitations ! 🎉
        </div>
        <div style={{ marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
          Vous avez atteint le niveau Turquoise.<br />De nouveaux avantages vous attendent !
        </div>

        {/* New benefits */}
        <div style={{
          marginTop: 28, width: '100%',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          borderRadius: 20, padding: '18px',
          border: '1px solid rgba(255,255,255,0.15)',
          textAlign: 'left',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>
            Avantages débloqués 🔓
          </div>
          {LEVEL.benefits.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: i < LEVEL.benefits.length - 1 ? 10 : 0,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>
                {b.emoji}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.35 }}>
                {b.text}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('fullloyalty')}
          style={{
            marginTop: 24, width: '100%', padding: '16px', borderRadius: 16,
            background: '#fff', border: 'none', cursor: 'pointer',
            color: '#0E8C7E', fontSize: 16, fontWeight: 800, fontFamily: 'inherit',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          Voir mes avantages 🌊
        </button>

        <button
          onClick={() => navigate('home')}
          style={{
            marginTop: 12, background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
          }}
        >
          Retour à l'accueil
        </button>
      </div>

      <HomeIndicator dark />
    </div>
  )
}
