import StatusBar from '../components/StatusBar.jsx'
import TabBar from '../components/TabBar.jsx'
import { C } from '../tokens.js'

const benefits = [
  { i: '🎁', t: '5€ offerts à chaque parrainage',        locked: false },
  { i: '⚡', t: 'Accès anticipé aux Coops 24h avant',    locked: false },
  { i: '🏝️', t: "Coops « Tour de l'archipel » exclusif", locked: false },
  { i: '🔒', t: 'Coops double points le week-end',         locked: true  },
]

const levels = [
  { n: 'Sable',     i: '🏖',  done: true,  current: false },
  { n: 'Coral',     i: '🪸',  done: true,  current: true  },
  { n: 'Turquoise', i: '🌊',  done: false, current: false },
  { n: 'Lagon',     i: '⛵',  done: false, current: false },
]

export default function Loyalty({ handleTab }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.cream, position: 'relative', overflow: 'hidden',
      color: C.ink,
    }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
        <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Fidélité</div>
          <div style={{ fontSize: 13, color: C.gray500, fontWeight: 500 }}>Historique</div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Hero gradient card */}
          <div style={{
            borderRadius: 24, padding: '22px 22px 24px',
            background: 'linear-gradient(160deg, #FFB39A 0%, #FF5A5F 100%)',
            color: '#fff', position: 'relative', overflow: 'hidden',
            boxShadow: '0 12px 24px rgba(255,90,95,0.25)',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 160, height: 160, borderRadius: 80,
              background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.9 }}>Niveau actuel</div>
              <div style={{ fontSize: 22 }}>🪸</div>
            </div>
            <div style={{
              marginTop: 8,
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 42, fontStyle: 'italic', lineHeight: 1, letterSpacing: -0.8,
            }}>
              Niveau Coral
            </div>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.6 }}>1 240</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>/ 2 000 pts pour Turquoise</div>
            </div>
            <div style={{ marginTop: 12, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', background: '#fff', borderRadius: 4 }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>Encore 760 points pour le prochain palier</div>
          </div>

          {/* Level rail */}
          <div style={{ marginTop: 22, display: 'flex', gap: 8 }}>
            {levels.map((lv, i) => (
              <div key={i} style={{
                flex: 1, padding: '12px 6px', borderRadius: 14, textAlign: 'center',
                background: lv.current ? C.ink : (lv.done ? C.gray100 : C.cream),
                color: lv.current ? '#fff' : C.ink,
                border: lv.done && !lv.current ? `1px solid ${C.gray200}` : 'none',
                opacity: lv.done ? 1 : 0.5,
              }}>
                <div style={{ fontSize: 18 }}>{lv.i}</div>
                <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4 }}>{lv.n}</div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div style={{ marginTop: 22, fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>Avantages</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 14, background: '#fff', borderRadius: 14,
                opacity: b.locked ? 0.5 : 1,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: b.locked ? C.gray100 : C.sand,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>
                  {b.i}
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{b.t}</div>
                {b.locked && <div style={{ fontSize: 11, color: C.gray500, fontWeight: 600 }}>Verrouillé</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <TabBar active="loyalty" onTab={handleTab} />
    </div>
  )
}
