import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C, G } from '../tokens.js'

const confetti = [
  { l: 40,  t: 100, c: C.coral,      s: 8 },
  { l: 320, t: 130, c: C.sun,        s: 6 },
  { l: 60,  t: 200, c: C.ocean,      s: 5 },
  { l: 300, t: 80,  c: C.coralLight, s: 7 },
  { l: 80,  t: 280, c: C.sun,        s: 6 },
  { l: 310, t: 240, c: C.coral,      s: 5 },
]

export default function CoopUsed({ navigate, handleTab }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.cream, position: 'relative', overflow: 'hidden',
      color: C.ink,
    }}>
      <StatusBar />

      <div style={{
        height: '100%', position: 'relative',
        padding: '120px 24px 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Confetti dots */}
        {confetti.map((d, i) => (
          <div key={i} style={{
            position: 'absolute', left: d.l, top: d.t,
            width: d.s, height: d.s, borderRadius: d.s / 2,
            background: d.c, opacity: 0.7, pointerEvents: 'none',
          }} />
        ))}

        {/* Check circle */}
        <div style={{
          width: 110, height: 110, borderRadius: 55,
          background: C.ocean,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 36px rgba(14,140,126,0.35)',
        }}>
          <Icon d={ICONS.check} size={56} stroke="#fff" sw={2.5} />
        </div>

        <div style={{
          marginTop: 32,
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 44, fontStyle: 'italic',
          letterSpacing: -0.8, textAlign: 'center', lineHeight: 1,
        }}>
          Coops utilisé !
        </div>

        <div style={{ marginTop: 12, fontSize: 15, color: C.gray500, textAlign: 'center', maxWidth: 280, lineHeight: 1.4 }}>
          Tu as économisé sur ton repas au Lagon Bleu. Bon appétit !
        </div>

        {/* Stats card */}
        <div style={{
          marginTop: 32, background: '#fff', borderRadius: 20,
          padding: '20px 24px', width: '100%',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, color: C.gray500 }}>Économies</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6 }}>24,00 €</div>
          </div>
          <div style={{ height: 1, background: C.gray200, margin: '16px -8px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, color: C.gray500 }}>Points gagnés</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 11,
                background: G.sandGold,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
              }}>⭐</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.ocean }}>+50 pts</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{
          position: 'absolute', bottom: 48, left: 24, right: 24,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <button onClick={() => handleTab('loyalty')} style={{
            height: 54, borderRadius: 999,
            background: C.ink, color: '#fff',
            border: 'none', cursor: 'pointer',
            fontSize: 16, fontWeight: 600,
            fontFamily: 'inherit',
          }}>
            Voir mes économies
          </button>
          <button onClick={() => handleTab('home')} style={{
            height: 44, background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 500, color: C.gray500, fontFamily: 'inherit',
          }}>
            Laisser un avis
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
