import { useState, useEffect } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const UPCOMING = [
  { id: 8,  emoji: '☀️',  name: 'Été créole',   desc: '5 Coops en juillet',            pts: 75  },
  { id: 9,  emoji: '🤝',  name: 'Ambassadeur',  desc: '3 parrainages en 1 mois',        pts: 150 },
  { id: 10, emoji: '🍽️', name: 'Gastronome',   desc: '5 Coops restaurants différents', pts: 60  },
]

const DEFS = [
  {
    id: 1, emoji: '🗺️', name: 'Explorateur', color: '#009B8D',
    desc: 'Utilise des Coops dans 3 catégories différentes',
    pts: 30, total: 3,
    deadline: 'Dimanche prochain',
    progress: (coops) => new Set(coops.map(c => c.category).filter(Boolean)).size,
  },
  {
    id: 2, emoji: '🔄', name: 'Fidèle', color: '#1565C0',
    desc: 'Active 4 Coops au total pour montrer ta fidélité',
    pts: 100, total: 4,
    deadline: '31 mai 2026',
    progress: (coops) => coops.filter(c => c.status === 'utilisé' || c.used).length,
  },
  {
    id: 3, emoji: '✨', name: 'Découvreur', color: '#F39C12',
    desc: 'Essaie des Coops chez 2 commerces différents',
    pts: 50, total: 2,
    deadline: '31 mai 2026',
    progress: (coops) => new Set(coops.map(c => c.commerce).filter(Boolean)).size,
  },
  {
    id: 4, emoji: '👥', name: 'Social', color: '#9B59B6',
    desc: 'Parraine 1 ami avec ton code Coopers',
    pts: 50, total: 1,
    deadline: '31 mai 2026',
    progress: (_, u) => (u?.referrals || []).length,
  },
]

function ProgressBar({ val, max, color }) {
  const pct = Math.min(100, Math.round((val / max) * 100))
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 5 }}>
        <span style={{ color }}>{val}/{max} complété</span>
        <span style={{ color: C.gray500 }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: C.gray200, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

function Toast({ challenge, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div style={{
      position: 'absolute', top: 70, left: 16, right: 16, zIndex: 100,
      background: 'linear-gradient(135deg,#9B59B6,#7B1FA2)',
      borderRadius: 18, padding: '14px 18px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(155,89,182,0.4)',
      animation: 'slideDown 0.35s ease',
    }}>
      <div style={{ fontSize: 32 }}>🏆</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Défi « {challenge.name} » complété !</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>+{challenge.pts} points Coopers crédités !</div>
      </div>
    </div>
  )
}

export default function Challenges({ navigate, goBack }) {
  const { user, userCoops, completedChallenges, checkChallenges, lastChallengeCompleted, clearLastChallenge } = useApp()

  // Inject confetti + slide animation styles
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'challenges-anim'
    style.textContent = `
      @keyframes confettiFall {
        from { transform: translateY(-10px) rotate(0deg); opacity:1; }
        to   { transform: translateY(120px) rotate(720deg); opacity:0; }
      }
      @keyframes slideDown {
        from { transform: translateY(-20px); opacity:0; }
        to   { transform: translateY(0); opacity:1; }
      }
    `
    if (!document.getElementById('challenges-anim')) document.head.appendChild(style)
    return () => { const el = document.getElementById('challenges-anim'); if (el) el.remove() }
  }, [])

  // Check challenges on mount and whenever coops/user changes
  useEffect(() => {
    checkChallenges(userCoops, user)
  }, [userCoops.length, user.referrals?.length]) // eslint-disable-line

  const activeDefs = DEFS.filter(d => !completedChallenges.has(d.id))
  const completedDefs = DEFS.filter(d => completedChallenges.has(d.id))
  const totalPtsAvail = activeDefs.reduce((s, d) => s + d.pts, 0)

  const CONFETTI_COLORS = ['#FF5A5F', '#0E8C7E', '#F4C24A', '#9B59B6', '#FFB39A', '#5BB8E2']

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* Completion toast */}
      {lastChallengeCompleted && (
        <Toast challenge={lastChallengeCompleted} onDismiss={clearLastChallenge} />
      )}

      {/* Confetti when challenge completes */}
      {lastChallengeCompleted && Array.from({ length: 14 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', top: 60, left: `${5 + i * 6.5}%`, zIndex: 99,
          width: 8, height: 8, borderRadius: '50%',
          background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          animation: `confettiFall ${0.7 + i * 0.12}s ease-out ${i * 0.08}s forwards`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '0 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Défis du moment 🏆</div>
        </div>

        <div style={{ padding: '0 20px 40px' }}>
          {/* Points summary */}
          <div style={{
            padding: '16px', borderRadius: 18, marginTop: 18, marginBottom: 22,
            background: 'linear-gradient(135deg,rgba(155,89,182,0.1),rgba(155,89,182,0.15))',
            border: '1px solid rgba(155,89,182,0.2)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ fontSize: 32 }}>🏆</div>
            <div>
              <div style={{ fontSize: 13, color: '#7B1FA2', fontWeight: 600 }}>Points bonus disponibles</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#7B1FA2', letterSpacing: -0.5 }}>
                +{totalPtsAvail} pts à gagner
              </div>
            </div>
          </div>

          {/* Active challenges */}
          {activeDefs.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12 }}>
                Défis en cours ({activeDefs.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {activeDefs.map(def => {
                  const prog = Math.min(def.total, def.progress(userCoops, user))
                  return (
                    <div key={def.id} style={{
                      background: '#fff', borderRadius: 18, padding: '16px',
                      border: `1px solid ${C.gray200}`,
                      borderLeft: `3px solid ${def.color}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                            background: `${def.color}18`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                          }}>
                            {def.emoji}
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{def.name}</div>
                        </div>
                        <div style={{
                          padding: '4px 10px', borderRadius: 999, flexShrink: 0,
                          background: `${def.color}18`, color: def.color, fontSize: 12, fontWeight: 800,
                        }}>
                          +{def.pts} pts
                        </div>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 13, color: C.gray500, lineHeight: 1.45 }}>{def.desc}</div>
                      <ProgressBar val={prog} max={def.total} color={def.color} />
                      <div style={{ marginTop: 8, fontSize: 11, color: C.gray400, fontWeight: 500 }}>
                        ⏰ Expire le {def.deadline}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Completed */}
          {completedDefs.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12 }}>
                Défis complétés ({completedDefs.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {completedDefs.map(def => (
                  <div key={def.id} style={{
                    background: '#fff', borderRadius: 16, padding: '14px',
                    border: `1px solid ${C.gray200}`, opacity: 0.85,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: 'rgba(14,140,126,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>
                      {def.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{def.name}</div>
                      <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>{def.desc}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        padding: '3px 8px', borderRadius: 999,
                        background: 'rgba(14,140,126,0.1)', color: C.ocean, fontSize: 11, fontWeight: 800,
                      }}>
                        ✓ +{def.pts} pts
                      </div>
                      <div style={{ fontSize: 10, color: C.gray400, marginTop: 3 }}>Complété !</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Upcoming */}
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12 }}>
            Défis à venir 👀
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {UPCOMING.map(c => (
              <div key={c.id} style={{
                background: C.gray100, borderRadius: 16, padding: '14px',
                display: 'flex', alignItems: 'center', gap: 12, opacity: 0.7,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: C.gray200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  {c.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gray500 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.gray400, marginTop: 2 }}>{c.desc}</div>
                </div>
                <div style={{ padding: '3px 8px', borderRadius: 999, background: C.gray200, color: C.gray500, fontSize: 11, fontWeight: 700 }}>
                  +{c.pts} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
