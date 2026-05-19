import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

const ZONES = ['Ma zone', 'Toute la Guadeloupe']

const top3 = [
  { rank: 1, name: 'Sophie M.',    level: 'Lagon ⛵',   pts: 3240, gradient: 'linear-gradient(135deg,#FFE9B0,#F4C24A)', podiumH: 90  },
  { rank: 2, name: 'Jean-Paul R.', level: 'Lagon ⛵',   pts: 2890, gradient: 'linear-gradient(135deg,#E8E4DC,#A8A39A)', podiumH: 72  },
  { rank: 3, name: 'Manon T.',     level: 'Turquoise 🌊', pts: 2150, gradient: 'linear-gradient(135deg,#FFB39A,#FF5A5F)', podiumH: 56  },
]

const ranked = [
  { rank: 4,  name: 'Luc B.',      level: 'Turquoise 🌊', pts: 1980, me: false },
  { rank: 5,  name: 'Nadia P.',    level: 'Turquoise 🌊', pts: 1740, me: false },
  { rank: 6,  name: 'Marc D.',     level: 'Coral 🪸',     pts: 1560, me: false },
  { rank: 7,  name: 'Céline R.',   level: 'Coral 🪸',     pts: 1380, me: false },
  { rank: 8,  name: 'Marie D.',    level: 'Coral 🪸',     pts: 1240, me: true  },
  { rank: 9,  name: 'Pierre L.',   level: 'Coral 🪸',     pts: 1120, me: false },
  { rank: 10, name: 'Amina K.',    level: 'Coral 🪸',     pts: 980,  me: false },
]

const rankColors = ['#F4C24A', '#A8A39A', '#CD7F32']

function Avatar({ name, gradient, size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 800, color: '#fff',
      flexShrink: 0,
    }}>
      {name[0]}
    </div>
  )
}

export default function Leaderboard({ goBack }) {
  const [zone, setZone] = useState('Ma zone')

  const myRank = ranked.find(r => r.me)
  const motivMsg = myRank?.rank <= 5
    ? `🔥 Incroyable ! Vous êtes dans le Top 5 de votre zone !`
    : `💪 Plus que ${ranked[ranked.findIndex(r => r.me) - 1]?.pts - myRank.pts || 0} pts pour passer devant ${ranked[ranked.findIndex(r => r.me) - 1]?.name.split(' ')[0]} !`

  const podiumOrder = [top3[1], top3[0], top3[2]]

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Classement 🏆</div>
        </div>

        {/* Zone filter */}
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: 8 }}>
          {ZONES.map(z => (
            <button
              key={z}
              onClick={() => setZone(z)}
              style={{
                padding: '8px 18px', borderRadius: 999,
                background: zone === z ? C.ink : '#fff',
                border: `1px solid ${zone === z ? C.ink : C.gray200}`,
                color: zone === z ? '#fff' : C.ink,
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              {z}
            </button>
          ))}
        </div>

        {/* Podium */}
        <div style={{
          margin: '0 20px 24px',
          background: 'linear-gradient(160deg,#FFB39A 0%,#FF5A5F 50%,#C73843 100%)',
          borderRadius: 24, padding: '20px 16px 0', overflow: 'hidden', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 16 }}>
            Ce mois · {zone}
          </div>

          {/* 3 columns — order: 2nd, 1st, 3rd */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
            {podiumOrder.map((p, colIdx) => {
              const isFirst = p.rank === 1
              return (
                <div key={p.rank} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Crown for 1st */}
                  {isFirst && <div style={{ fontSize: 20, marginBottom: 2 }}>👑</div>}

                  {/* Avatar */}
                  <div style={{
                    width: isFirst ? 60 : 50, height: isFirst ? 60 : 50,
                    borderRadius: isFirst ? 30 : 25,
                    background: p.gradient,
                    border: `3px solid ${rankColors[p.rank - 1]}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isFirst ? 22 : 18, fontWeight: 800, color: '#fff',
                    boxShadow: isFirst ? '0 6px 20px rgba(0,0,0,0.2)' : 'none',
                  }}>
                    {p.name[0]}
                  </div>

                  <div style={{ marginTop: 6, color: '#fff', textAlign: 'center' }}>
                    <div style={{ fontSize: isFirst ? 13 : 11, fontWeight: 700 }}>{p.name.split(' ')[0]}</div>
                    <div style={{ fontSize: 11, opacity: 0.85, marginTop: 1 }}>{p.pts.toLocaleString('fr-FR')} pts</div>
                  </div>

                  {/* Podium block */}
                  <div style={{
                    marginTop: 8, width: '100%',
                    height: p.podiumH, borderRadius: '10px 10px 0 0',
                    background: `${rankColors[p.rank - 1]}CC`,
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    paddingTop: 8,
                  }}>
                    <div style={{ fontSize: isFirst ? 22 : 18, fontWeight: 900, color: '#fff' }}>
                      {p.rank}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Ranked list */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12 }}>
            Classement complet
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ranked.map(r => (
              <div key={r.rank} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderRadius: 14, background: r.me ? 'rgba(255,90,95,0.07)' : '#fff',
                border: `1.5px solid ${r.me ? C.coral : C.gray200}`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: r.me ? C.coral : C.gray100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 900, color: r.me ? '#fff' : C.gray500,
                }}>
                  {r.rank}
                </div>
                <div style={{
                  width: 34, height: 34, borderRadius: 17, flexShrink: 0,
                  background: r.me
                    ? 'linear-gradient(135deg,#FFB39A,#FF5A5F)'
                    : 'linear-gradient(135deg,#E8E4DC,#C8C3B8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, color: '#fff',
                }}>
                  {r.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: r.me ? C.coral : C.ink }}>
                    {r.name}{r.me && ' (vous)'}
                  </div>
                  <div style={{ fontSize: 11, color: C.gray500, marginTop: 1 }}>{r.level}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: r.me ? C.coral : C.ink }}>
                  {r.pts.toLocaleString('fr-FR')} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational message */}
        <div style={{ margin: '20px 20px 0', padding: '14px 16px', borderRadius: 16, background: '#fff', border: `1px solid ${C.gray200}` }}>
          <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{motivMsg}</div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
