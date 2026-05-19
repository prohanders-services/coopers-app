import StatusBar from '../components/StatusBar.jsx'
import TabBar from '../components/TabBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

const stats = [
  { v: '184€', l: 'Économisé' },
  { v: '12',   l: 'Coops' },
  { v: '8',    l: 'Lieux' },
]

const rows = [
  { i: '⭐', t: 'Mes favoris',   d: '14 lieux' },
  { i: '🎁', t: 'Parrainage',    d: '5€ + 5€'  },
  { i: '🔔', t: 'Notifications', d: null        },
  { i: '⚙️', t: 'Préférences',  d: null        },
]

export default function Profile({ handleTab }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.cream, position: 'relative', overflow: 'hidden',
      color: C.ink, display: 'flex', flexDirection: 'column',
    }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
        <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Profil</div>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={ICONS.bell} size={16} stroke={C.ink} />
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Hero card */}
          <div style={{
            borderRadius: 24, padding: 22,
            background: 'linear-gradient(160deg, #FFB39A 0%, #FF5A5F 100%)',
            color: '#fff', position: 'relative', overflow: 'hidden',
            boxShadow: '0 12px 24px rgba(255,90,95,0.20)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 32,
                background: 'rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 700,
                fontFamily: '"Instrument Serif", serif', fontStyle: 'italic',
                border: '1.5px solid rgba(255,255,255,0.4)',
              }}>
                M
              </div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 700 }}>Marie Boucard</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>Niveau Coral 🪸 · Le Gosier</div>
              </div>
            </div>

            <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between' }}>
              {stats.map((s, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: 'center',
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.25)' : 'none',
                }}>
                  <div style={{
                    fontSize: 22, fontWeight: 700, letterSpacing: -0.4,
                    fontFamily: '"Instrument Serif", serif', fontStyle: 'italic',
                  }}>
                    {s.v}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2, letterSpacing: 0.2, textTransform: 'uppercase', fontWeight: 600 }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* iOS list */}
          <div style={{ marginTop: 18, background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
            {rows.map((row, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                padding: '14px 16px',
                borderBottom: i < rows.length - 1 ? `0.5px solid ${C.gray200}` : 'none',
                minHeight: 52, cursor: 'pointer',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: C.gray100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, marginRight: 12,
                }}>
                  {row.i}
                </div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{row.t}</div>
                {row.d && <div style={{ fontSize: 13, color: C.gray500, marginRight: 6 }}>{row.d}</div>}
                <Icon d={ICONS.chevR} size={14} stroke={C.gray400} sw={2} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, padding: 14, textAlign: 'center', fontSize: 13, color: C.gray500 }}>
            Membre depuis mars 2025
          </div>
        </div>
      </div>

      <TabBar active="profile" onTab={handleTab} />
      <HomeIndicator />
    </div>
  )
}
