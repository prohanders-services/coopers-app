import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { C } from '../tokens.js'

export default function EmailSent({ navigate }) {
  const email = 'marie@example.com'

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink }}>
      <StatusBar />

      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 28px 80px', textAlign: 'center',
      }}>
        {/* Envelope illustration */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          {/* Outer glow ring */}
          <div style={{
            width: 140, height: 140, borderRadius: 70,
            background: 'linear-gradient(135deg, rgba(14,140,126,0.1) 0%, rgba(91,184,226,0.15) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 100, height: 100, borderRadius: 50,
              background: 'linear-gradient(135deg, #5BB8E2 0%, #0E8C7E 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44,
              boxShadow: '0 10px 30px rgba(14,140,126,0.35)',
            }}>
              ✉️
            </div>
          </div>
          {/* Checkmark badge */}
          <div style={{
            position: 'absolute', bottom: 4, right: 4,
            width: 32, height: 32, borderRadius: 16,
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            fontSize: 16,
          }}>
            ✅
          </div>
        </div>

        {/* Title */}
        <div style={{
          marginTop: 28,
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 36, fontStyle: 'italic', letterSpacing: -0.6, lineHeight: 1.1,
        }}>
          E-mail envoyé !
        </div>

        {/* Body */}
        <div style={{ marginTop: 14, fontSize: 15, color: C.gray500, lineHeight: 1.6, maxWidth: 300 }}>
          Nous avons envoyé un lien de réinitialisation à
        </div>
        <div style={{
          marginTop: 8, fontSize: 15, fontWeight: 700, color: C.ink,
          padding: '6px 16px', borderRadius: 999,
          background: '#fff', border: `1px solid ${C.gray200}`,
        }}>
          {email}
        </div>
        <div style={{ marginTop: 16, fontSize: 13, color: C.gray500, lineHeight: 1.6, maxWidth: 280 }}>
          Vérifiez également votre dossier spam si vous ne recevez pas l'e-mail dans quelques minutes.
        </div>

        {/* Resend */}
        <div style={{ marginTop: 32, padding: '16px 20px', borderRadius: 16, background: '#fff', border: `1px solid ${C.gray200}`, width: '100%' }}>
          <div style={{ fontSize: 13, color: C.gray500 }}>Vous n'avez pas reçu l'e-mail ?</div>
          <button style={{
            marginTop: 8, background: 'none', border: 'none', cursor: 'pointer',
            color: C.coral, fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
          }}>
            Renvoyer le lien
          </button>
        </div>

        {/* Back to login */}
        <button onClick={() => navigate('login')} style={{
          marginTop: 24, width: '100%', padding: '16px', borderRadius: 16,
          background: C.ink, color: '#fff', border: 'none', cursor: 'pointer',
          fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
        }}>
          Retour à la connexion
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
