import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

export default function EmptyState({ navigate, goBack }) {
  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink }}>
      <StatusBar />

      {/* Back */}
      <div style={{ padding: '16px 20px 0' }}>
        <button onClick={goBack} style={{
          width: 38, height: 38, borderRadius: 19, background: '#fff',
          border: `1px solid ${C.gray200}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
        </button>
      </div>

      <div style={{
        height: 'calc(100% - 100px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 28px', textAlign: 'center',
      }}>
        {/* Illustration */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          {/* Background rings */}
          <div style={{
            width: 160, height: 160, borderRadius: 80,
            background: 'linear-gradient(135deg, rgba(14,140,126,0.08) 0%, rgba(91,184,226,0.12) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 110, height: 110, borderRadius: 55,
              background: 'linear-gradient(135deg, rgba(14,140,126,0.12) 0%, rgba(91,184,226,0.18) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 36,
                background: 'linear-gradient(135deg, #5BB8E2 0%, #0E8C7E 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32,
                boxShadow: '0 8px 24px rgba(14,140,126,0.3)',
              }}>
                🏝️
              </div>
            </div>
          </div>
          {/* Floating emojis */}
          <div style={{ position: 'absolute', top: 10, right: 0, fontSize: 20, opacity: 0.6 }}>🌺</div>
          <div style={{ position: 'absolute', bottom: 10, left: 0, fontSize: 16, opacity: 0.5 }}>🌴</div>
          <div style={{ position: 'absolute', top: 30, left: -10, fontSize: 14, opacity: 0.4 }}>🌿</div>
        </div>

        {/* Title */}
        <div style={{
          marginTop: 24,
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 30, fontStyle: 'italic', letterSpacing: -0.5, lineHeight: 1.15,
        }}>
          Pas encore d'offres ici
        </div>

        {/* Explanation */}
        <div style={{ marginTop: 12, fontSize: 15, color: C.gray500, lineHeight: 1.6, maxWidth: 300 }}>
          Aucun commerce partenaire n'est disponible dans cette zone pour l'instant. De nouveaux Coops arrivent chaque semaine !
        </div>

        {/* Suggest banner */}
        <div style={{
          marginTop: 28, width: '100%', padding: '16px',
          borderRadius: 18, background: '#fff', border: `1px solid ${C.gray200}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, flexShrink: 0,
            background: 'rgba(244,194,74,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            💡
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Vous connaissez un commerce ?</div>
            <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>Suggérez-le, on prend contact !</div>
          </div>
        </div>

        {/* Buttons */}
        <button style={{
          marginTop: 12, width: '100%', padding: '15px', borderRadius: 16,
          background: '#fff', border: `1px solid ${C.gray200}`,
          color: C.ink, fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
          cursor: 'pointer',
        }}>
          Suggérer un commerce
        </button>

        <button
          onClick={() => navigate('category')}
          style={{
            marginTop: 10, width: '100%', padding: '15px', borderRadius: 16,
            background: C.coral, border: 'none',
            color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(255,90,95,0.28)',
          }}
        >
          Voir les offres en Grande-Terre
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
