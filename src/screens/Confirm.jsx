import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const CAT_LABELS = {
  restaurants: 'Restaurants',
  nautique:    'Nautique',
  nature:      'Nature & Parcs',
  bars:        'Bars & Sorties',
  beaute:      'Beauté',
  shopping:    'Shopping local',
  sport:       'Sport & Bien-être',
  culture:     'Culture & Loisirs',
  gastro:      'Gastronomie',
}

export default function Confirm({ navigate }) {
  const { user } = useApp()

  const catNames = [...(user.categories instanceof Set ? user.categories : new Set(user.categories || []))]
    .map(id => CAT_LABELS[id] || id)
    .join(', ') || 'Restaurants, Nautique, Nature & Parcs'

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 24px 48px', paddingBottom: 120 }}>
        {/* Hero */}
        <div style={{
          marginTop: 60, display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
        }}>
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 70, background: 'linear-gradient(135deg, rgba(255,90,95,0.1) 0%, rgba(255,179,154,0.15) 100%)' }} />
            <div style={{ position: 'absolute', inset: 16, borderRadius: 54, background: 'linear-gradient(135deg, rgba(255,90,95,0.15) 0%, rgba(255,179,154,0.2) 100%)' }} />
            <div style={{
              position: 'absolute', inset: 32, borderRadius: 38,
              background: 'linear-gradient(135deg, #FFB39A 0%, #FF5A5F 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38,
            }}>
              🎉
            </div>
          </div>

          <div style={{
            marginTop: 28, fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 38, fontStyle: 'italic', letterSpacing: -0.8, lineHeight: 1.1,
          }}>
            Bienvenue{user.firstName ? `, ${user.firstName}` : ''} !
          </div>
          <div style={{ marginTop: 10, fontSize: 15, color: C.gray500, lineHeight: 1.5, maxWidth: 280 }}>
            Votre compte Coopers est prêt. Découvrez les meilleurs bons plans de la Guadeloupe.
          </div>
        </div>

        {/* Welcome bonus */}
        <div style={{
          marginTop: 32, padding: '20px', borderRadius: 20,
          background: 'linear-gradient(135deg, #FFB39A 0%, #FF5A5F 100%)',
          color: '#fff', textAlign: 'center',
          boxShadow: '0 8px 24px rgba(255,90,95,0.3)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -24, right: -24, width: 100, height: 100, borderRadius: 50, background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ fontSize: 28 }}>⭐</div>
          <div style={{ marginTop: 8, fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
            +50 points de bienvenue 🎉
          </div>
          <div style={{ marginTop: 4, fontSize: 13, opacity: 0.9, fontWeight: 500 }}>
            Déjà crédités sur votre compte
          </div>
        </div>

        {/* Profile recap */}
        <div style={{ marginTop: 20, padding: '18px', borderRadius: 18, background: '#fff', border: `1px solid ${C.gray200}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12 }}>
            Votre profil
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 18 }}>📍</div>
              <div>
                <div style={{ fontSize: 12, color: C.gray500 }}>Zone</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 1 }}>{user.zone || 'Grande-Terre'}</div>
              </div>
            </div>
            <div style={{ height: 1, background: C.gray100 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 18 }}>❤️</div>
              <div>
                <div style={{ fontSize: 12, color: C.gray500 }}>Centres d'intérêt</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 1 }}>{catNames}</div>
              </div>
            </div>
            <div style={{ height: 1, background: C.gray100 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 18 }}>🏖</div>
              <div>
                <div style={{ fontSize: 12, color: C.gray500 }}>Niveau de fidélité</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 1 }}>Sable · Débutant</div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => navigate('home')} style={{
          marginTop: 28, width: '100%', padding: '16px', borderRadius: 16,
          background: C.coral, color: '#fff', border: 'none', cursor: 'pointer',
          fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
          boxShadow: '0 6px 20px rgba(255,90,95,0.3)',
        }}>
          Découvrir les Coops 🏝️
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
