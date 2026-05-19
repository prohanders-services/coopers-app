import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import FakeQR from '../components/FakeQR.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

export default function QRTicket({ navigate, resetTo }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.cream, position: 'relative', overflow: 'hidden',
      color: C.ink, display: 'flex', flexDirection: 'column',
    }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative', padding: '0 24px 48px', paddingTop: 16, paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={() => resetTo('home')} style={{
            width: 36, height: 36, borderRadius: 18, background: C.gray100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
          }}>
            <Icon d={ICONS.close} size={16} stroke={C.ink} sw={2} />
          </button>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Coops activé</div>
          <div style={{ width: 36 }} />
        </div>

        {/* Ticket */}
        <div style={{ position: 'relative', marginTop: 30 }}>
          {/* Notches */}
          <div style={{ position: 'absolute', left: -8, top: 220, width: 16, height: 16, borderRadius: 8, background: C.cream, zIndex: 2 }} />
          <div style={{ position: 'absolute', right: -8, top: 220, width: 16, height: 16, borderRadius: 8, background: C.cream, zIndex: 2 }} />

          <div style={{
            background: '#fff', borderRadius: 24, overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(22,22,26,0.10), 0 2px 8px rgba(22,22,26,0.04)',
          }}>
            {/* Top half */}
            <div style={{ padding: '20px 22px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'linear-gradient(160deg, #FFB39A, #FF5A5F)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>🍽️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>Le Lagon Bleu</div>
                  <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>Saint-François · Restaurant</div>
                </div>
                <div style={{ background: C.coral, color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 16, fontWeight: 700 }}>
                  −30%
                </div>
              </div>

              <div style={{ marginTop: 18, display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: C.gray500, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>Valable</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>Aujourd'hui</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: C.gray500, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>Expire dans</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3, color: C.coral }}>02h 14m</div>
                </div>
              </div>
            </div>

            {/* Perforation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} style={{ width: 6, height: 1.5, background: C.gray200 }} />
              ))}
            </div>

            {/* QR half */}
            <div style={{ padding: '24px 22px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: C.gray500, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                À présenter au commerçant
              </div>
              <div style={{
                marginTop: 16, padding: 12, background: '#fff',
                borderRadius: 12, border: `1px solid ${C.gray200}`,
              }}>
                <FakeQR size={170} />
              </div>
              <div style={{
                marginTop: 14,
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: 13, fontWeight: 600, letterSpacing: 1.2, color: C.ink,
              }}>
                LB-7H4K-2026
              </div>
            </div>
          </div>
        </div>

        {/* Footer note + validate button */}
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: C.gray500 }}>
          Demande au serveur de scanner ce code avant l'addition.
        </div>
        <button onClick={() => navigate('coopused')} style={{
          marginTop: 16, width: '100%',
          height: 50, borderRadius: 999,
          background: C.ocean, color: '#fff',
          border: 'none', cursor: 'pointer',
          fontSize: 15, fontWeight: 600,
          fontFamily: 'inherit',
          boxShadow: '0 6px 20px rgba(14,140,126,0.25)',
        }}>
          Simuler la validation ✓
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
