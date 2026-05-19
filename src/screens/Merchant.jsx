import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import IOSGlassPill from '../components/IOSGlassPill.jsx'
import StickyCTA from '../components/StickyCTA.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

export default function Merchant({ navigate, goBack }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#fff', position: 'relative', overflow: 'hidden',
      color: C.ink,
    }}>
      <StatusBar dark />

      <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
        {/* Hero photo */}
        <div style={{ position: 'relative', height: 340 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #FFB39A 0%, #FF8A8E 50%, #C73843 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', bottom: 30, left: 30, fontSize: 100, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.2))' }}>🍽️</div>

          {/* Top nav */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '60px 16px 0', display: 'flex', justifyContent: 'space-between' }}>
            <IOSGlassPill>
              <button onClick={goBack} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon d={ICONS.chevL} size={20} stroke={C.ink} sw={2} />
              </button>
            </IOSGlassPill>
            <div style={{ display: 'flex', gap: 8 }}>
              <IOSGlassPill>
                <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={ICONS.share} size={18} stroke={C.ink} />
                </div>
              </IOSGlassPill>
              <IOSGlassPill>
                <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={ICONS.heart} size={18} stroke={C.ink} sw={1.75} />
                </div>
              </IOSGlassPill>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 20px 130px', background: '#fff', borderRadius: '24px 24px 0 0', marginTop: -24, position: 'relative' }}>
          <div style={{ fontSize: 11, color: C.coral, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Restaurant · Cuisine créole
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6, letterSpacing: -0.6 }}>Le Lagon Bleu</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13, color: C.gray500 }}>
            <Icon d={ICONS.star} size={14} stroke={C.sun} fill={C.sun} sw={1} />
            <span style={{ color: C.ink, fontWeight: 600 }}>4,8</span>
            <span>·</span>
            <span>234 avis</span>
            <span>·</span>
            <span>Saint-François</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 14, color: C.gray500, lineHeight: 1.45 }}>
            Sur le port de Saint-François, table familiale créole : langouste, colombo, accras, planteur maison.
          </div>

          <div style={{ marginTop: 22, fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>Coops disponibles</div>

          <div style={{
            marginTop: 12, padding: 14, borderRadius: 16,
            border: `1.5px solid ${C.coral}`,
            background: 'linear-gradient(135deg, rgba(255,90,95,0.04), rgba(255,179,154,0.08))',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: C.coral, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>Coops exclusive</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>−30% sur l'addition</div>
                <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>Du lundi au jeudi · midi & soir</div>
              </div>
              <div style={{
                background: C.coral, color: '#fff',
                fontSize: 22, fontWeight: 700, padding: '10px 14px',
                borderRadius: 12, lineHeight: 1,
              }}>
                −30%
              </div>
            </div>
          </div>
        </div>
      </div>

      <StickyCTA onClick={() => navigate('offer')}>Réserver un Coops</StickyCTA>
      <HomeIndicator />
    </div>
  )
}
