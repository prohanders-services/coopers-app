import { useState, useEffect } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'
import { db, FIREBASE_ENABLED } from '../firebase.js'
import { doc, getDoc } from 'firebase/firestore'

const STEPS = [
  { emoji: '📤', label: 'Partage ton code',          sub: 'Envoie ton code à tes amis' },
  { emoji: '✍️', label: "Ton ami s'inscrit",         sub: 'Via ton code unique' },
  { emoji: '🎁', label: 'Vous gagnez tous les deux', sub: '+50 pts chacun !' },
]

const SHARES = [
  { label: 'WhatsApp',  emoji: '💬', color: '#25D366', bg: 'rgba(37,211,102,0.1)'  },
  { label: 'SMS',       emoji: '📱', color: C.ocean,   bg: 'rgba(14,140,126,0.1)'  },
  { label: 'Instagram', emoji: '📸', color: '#E4405F', bg: 'rgba(228,64,95,0.1)'   },
  { label: 'E-mail',    emoji: '✉️', color: C.gray500, bg: C.gray100               },
]

function formatDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return `Membre depuis ${d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`
  } catch { return '' }
}

export default function Referral({ goBack }) {
  const { user } = useApp()
  const [copied,   setCopied]   = useState(false)
  const [filleuls, setFilleuls] = useState([])
  const [loading,  setLoading]  = useState(false)

  const code = user.referralCode || '——'
  const referralUIDs = Array.isArray(user.referrals) ? user.referrals : []

  useEffect(() => {
    if (!FIREBASE_ENABLED || referralUIDs.length === 0) return
    setLoading(true)
    Promise.all(
      referralUIDs.map(uid =>
        getDoc(doc(db, 'users', uid))
          .then(snap => snap.exists() ? { uid, ...snap.data() } : null)
          .catch(() => null)
      )
    ).then(results => {
      setFilleuls(results.filter(Boolean))
      setLoading(false)
    })
  }, [referralUIDs.length])

  const copy = () => {
    const text = `Rejoins Coopers avec mon code ${code} et gagne 50 points de bienvenue bonus ! 🌴`
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const share = (platform) => {
    const text = encodeURIComponent(`Rejoins Coopers avec mon code ${code} et gagne 50 points de bienvenue bonus ! 🌴`)
    if (platform === 'WhatsApp') window.open(`https://wa.me/?text=${text}`, '_blank')
    else if (platform === 'SMS') window.open(`sms:?body=${text}`, '_blank')
    else if (platform === 'E-mail') window.open(`mailto:?subject=Rejoins%20Coopers&body=${text}`, '_blank')
    else copy()
  }

  const displayedFilleuls = FIREBASE_ENABLED
    ? filleuls
    : referralUIDs.map(uid => ({ uid, firstName: uid, createdAt: null }))

  const totalPts = displayedFilleuls.length * 50

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 48px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Parrainez vos proches 🤝</div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
          <div style={{ fontSize: 56 }}>🤝</div>
          <div style={{
            marginTop: 10,
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 26, fontStyle: 'italic', letterSpacing: -0.4, lineHeight: 1.2,
          }}>
            Invitez vos amis,<br />gagnez des points !
          </div>
          <div style={{ marginTop: 8, fontSize: 14, color: C.gray500, lineHeight: 1.5 }}>
            Pour chaque ami inscrit via votre code, vous recevez tous les deux <strong>+50 points Coopers</strong>.
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginTop: 24, display: 'flex', gap: 0, position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 24, left: '16.6%', right: '16.6%', height: 2,
            background: C.gray200, zIndex: 0,
          }} />
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 24,
                background: C.coral, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, boxShadow: '0 4px 14px rgba(255,90,95,0.3)',
              }}>
                {s.emoji}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>{s.label}</div>
              <div style={{ marginTop: 3, fontSize: 11, color: C.gray500, textAlign: 'center', lineHeight: 1.3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Referral code */}
        <div style={{
          marginTop: 28, padding: '20px', borderRadius: 20,
          background: '#fff', border: `1.5px dashed ${C.gray400}`,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Mon code de parrainage
          </div>
          <div style={{
            fontSize: 30, fontWeight: 900, letterSpacing: 4,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace', color: C.ink,
          }}>
            {code}
          </div>
          <button
            onClick={copy}
            style={{
              marginTop: 14, padding: '11px 28px', borderRadius: 12,
              background: copied ? C.ocean : C.coral,
              border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              transition: 'background 0.2s',
              boxShadow: '0 4px 14px rgba(255,90,95,0.3)',
            }}
          >
            {copied ? '✓ Copié !' : 'Copier le code'}
          </button>
        </div>

        {/* Invite link display */}
        <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 16, background: C.gray100, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, fontSize: 12, color: C.gray500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            coopers.gp/invite/{code.toLowerCase()}
          </div>
          <Icon d={ICONS.share} size={16} stroke={C.gray500} />
        </div>

        {/* Share buttons */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {SHARES.map(s => (
            <button key={s.label} onClick={() => share(s.label)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
              borderRadius: 14, background: s.bg, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              <span style={{ fontSize: 20 }}>{s.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Filleuls list */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              Mes filleuls ({referralUIDs.length})
            </div>
            {totalPts > 0 && (
              <div style={{
                padding: '4px 12px', borderRadius: 999,
                background: 'rgba(244,162,74,0.12)', color: '#D4A800', fontSize: 12, fontWeight: 800,
              }}>
                +{totalPts} pts gagnés
              </div>
            )}
          </div>

          {loading && (
            <div style={{ padding: '20px', textAlign: 'center', color: C.gray400, fontSize: 13 }}>
              Chargement…
            </div>
          )}

          {!loading && referralUIDs.length === 0 && (
            <div style={{
              padding: '28px 20px', borderRadius: 18,
              background: '#fff', border: `1px solid ${C.gray200}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32 }}>🤞</div>
              <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: C.ink }}>Pas encore de filleul</div>
              <div style={{ marginTop: 6, fontSize: 12, color: C.gray500, lineHeight: 1.5 }}>
                Partagez votre code pour commencer à parrainer vos amis.
              </div>
            </div>
          )}

          {!loading && displayedFilleuls.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayedFilleuls.map((f, i) => {
                const name = f.firstName || f.uid?.slice(0, 6) || '?'
                const initials = name.slice(0, 2).toUpperCase()
                return (
                  <div key={f.uid || i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
                    background: '#fff', borderRadius: 14, border: `1px solid ${C.gray200}`,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 20,
                      background: 'linear-gradient(135deg,#FFB39A,#FF5A5F)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
                      <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>
                        {formatDate(f.createdAt)}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 10px', borderRadius: 999,
                      background: 'rgba(14,140,126,0.1)',
                      color: C.ocean, fontSize: 11, fontWeight: 700, flexShrink: 0,
                    }}>
                      Actif
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Conditions */}
        <div style={{ marginTop: 24, padding: '14px 16px', borderRadius: 14, background: C.gray100 }}>
          <div style={{ fontSize: 11, color: C.gray500, lineHeight: 1.6 }}>
            <strong>Conditions du programme :</strong> Les 50 points de parrainage sont crédités dès l'inscription de votre filleul avec votre code. Offre valable pour les nouveaux inscrits uniquement. Points non convertibles en espèces.
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
