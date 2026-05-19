import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

export default function Onboarding({ navigate }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #5BB8E2 0%, #0E8C7E 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <StatusBar dark />

      <div style={{
        position: 'relative', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: '70px 28px 0', color: '#fff',
      }}>
        <button onClick={() => navigate('login')} style={{
          alignSelf: 'flex-end', fontSize: 14, fontWeight: 500,
          opacity: 0.85, marginTop: 20, background: 'none', border: 'none',
          color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Passer
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 200, height: 200, borderRadius: 100,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 96,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            🏝️
          </div>
        </div>

        <div style={{ paddingBottom: 40 }}>
          <div style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 40, fontStyle: 'italic',
            lineHeight: 1.05, letterSpacing: -0.8,
          }}>
            Découvrez la Guadeloupe
          </div>
          <div style={{ marginTop: 14, fontSize: 16, lineHeight: 1.45, opacity: 0.9, fontWeight: 400 }}>
            Des bons plans hyper-locaux chez les commerçants des îles, mis à jour chaque jour.
          </div>

          <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 24, height: 6, borderRadius: 3, background: '#fff' }} />
              <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.4)' }} />
              <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.4)' }} />
            </div>
            <button onClick={() => navigate('login')} style={{
              width: 56, height: 56, borderRadius: 28,
              background: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}>
              <Icon d={ICONS.chevR} size={20} stroke={C.ocean} sw={2.2} />
            </button>
          </div>
        </div>
      </div>

      <HomeIndicator dark />
    </div>
  )
}
