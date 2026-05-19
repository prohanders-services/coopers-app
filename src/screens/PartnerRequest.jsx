import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

const AB = '#2563EB'

const CATEGORIES = [
  'Restaurants', 'Nautique & Sports aquatiques', 'Nature & Parcs',
  'Bars & Sorties', 'Beauté & Bien-être', 'Shopping local',
  'Sport & Fitness', 'Culture & Loisirs', 'Gastronomie & Traiteur',
  'Hébergement', 'Transport', 'Santé',
]

const ZONES = ['Grande-Terre', 'Basse-Terre', 'Marie-Galante', 'Les Saintes', 'La Désirade', 'Toute la Guadeloupe']

const HOW = [
  'Bouche à oreille', 'Réseaux sociaux', 'Google',
  'Un partenaire Coopers', 'Presse / Médias', 'Autre',
]

const inp = {
  width: '100%', padding: '13px 16px', borderRadius: 12,
  border: `1px solid ${C.gray200}`, background: '#fff',
  fontSize: 14, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', color: C.ink,
}

const VALUE_PROPS = [
  {
    emoji: '🎯',
    title: 'Attirez de nouveaux clients',
    desc: 'Rejoignez 12 000+ utilisateurs Coopers en Guadeloupe à la recherche de bons plans locaux.',
  },
  {
    emoji: '📊',
    title: 'Pilotez votre activité',
    desc: 'Statistiques, historique des validations et insights pour optimiser vos offres.',
  },
  {
    emoji: '🤝',
    title: 'Valorisez le local',
    desc: 'Coopers met en avant les commerces guadeloupéens auprès de la communauté locale.',
  },
]

export default function PartnerRequest({ goBack, navigate }) {
  const [commerceName, setCommerceName] = useState('')
  const [contactName,  setContactName]  = useState('')
  const [email,        setEmail]        = useState('')
  const [phone,        setPhone]        = useState('')
  const [cat,          setCat]          = useState('')
  const [zone,         setZone]         = useState('')
  const [message,      setMessage]      = useState('')
  const [how,          setHow]          = useState('')
  const [sent,         setSent]         = useState(false)

  const canSend = commerceName.trim() && contactName.trim() && email.includes('@') && cat && zone

  if (sent) {
    return (
      <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <StatusBar />
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>
          <div style={{
            width: 100, height: 100, borderRadius: 50,
            background: `${AB}12`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48,
            marginBottom: 24,
          }}>🤝</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: AB, textAlign: 'center', letterSpacing: -0.5, marginBottom: 10 }}>
            Demande envoyée !
          </div>
          <div style={{ fontSize: 14, color: C.gray500, textAlign: 'center', lineHeight: 1.65, marginBottom: 28 }}>
            Notre équipe commerciale étudie votre dossier et vous recontacte <strong style={{ color: C.ink }}>sous 48h</strong> pour discuter de votre adhésion.
          </div>
          <div style={{
            width: '100%', padding: '16px', borderRadius: 18,
            background: `${AB}08`, border: `1px solid ${AB}25`,
            marginBottom: 28,
          }}>
            {[
              { emoji: '📧', label: 'Confirmation envoyée à', val: email },
              { emoji: '📞', label: 'Rappel sous', val: '48 heures ouvrées' },
              { emoji: '🎁', label: '1 mois offert', val: 'à l\'inscription' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                paddingTop: i > 0 ? 10 : 0, borderTop: i > 0 ? `1px solid ${AB}15` : 'none',
                marginTop: i > 0 ? 10 : 0,
              }}>
                <span style={{ fontSize: 18 }}>{r.emoji}</span>
                <div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>{r.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{r.val}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate ? navigate('login') : goBack()}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: AB, color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
              boxShadow: `0 6px 20px rgba(37,99,235,0.3)`,
            }}
          >
            Retour à l'accueil
          </button>
        </div>
        <HomeIndicator />
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 48px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>Rejoindre Coopers</div>
            <div style={{ fontSize: 12, color: AB, fontWeight: 600 }}>Espace Partenaire</div>
          </div>
        </div>

        {/* Hero */}
        <div style={{
          background: `linear-gradient(135deg, ${AB}, #1D4ED8)`,
          borderRadius: 20, padding: '20px', marginBottom: 24, marginTop: 8,
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 6, letterSpacing: -0.4 }}>
            Devenez partenaire 🏝️
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
            Rejoignez le réseau de commerces locaux Coopers et touchez des milliers de clients en Guadeloupe.
          </div>
        </div>

        {/* Value props */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {VALUE_PROPS.map((v, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '14px',
              background: '#fff', borderRadius: 16, border: `1px solid ${C.gray200}`,
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${AB}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                {v.emoji}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{v.title}</div>
                <div style={{ fontSize: 12, color: C.gray500, lineHeight: 1.5 }}>{v.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>
          Votre dossier
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>
              Nom du commerce <span style={{ color: C.coral }}>*</span>
            </div>
            <input value={commerceName} onChange={e => setCommerceName(e.target.value)}
              placeholder="Ex : Le Rocher de Malendure" style={inp} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>
              Nom et prénom (contact) <span style={{ color: C.coral }}>*</span>
            </div>
            <input value={contactName} onChange={e => setContactName(e.target.value)}
              placeholder="Ex : Jean-Pierre Durand" style={inp} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>
              Email professionnel <span style={{ color: C.coral }}>*</span>
            </div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="contact@moncommerce.gp" style={inp} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Téléphone</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                padding: '13px 12px', borderRadius: 12, border: `1px solid ${C.gray200}`,
                background: '#fff', fontSize: 14, color: C.gray500, whiteSpace: 'nowrap',
              }}>🇬🇵 +590</div>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="XX XX XX XX" style={{ ...inp, flex: 1 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>
                Catégorie <span style={{ color: C.coral }}>*</span>
              </div>
              <div style={{ position: 'relative' }}>
                <select value={cat} onChange={e => setCat(e.target.value)}
                  style={{ ...inp, appearance: 'none', cursor: 'pointer', color: cat ? C.ink : C.gray400, paddingRight: 32 }}>
                  <option value="" disabled>Choisir</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 11, color: C.gray400 }}>▼</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>
                Zone <span style={{ color: C.coral }}>*</span>
              </div>
              <div style={{ position: 'relative' }}>
                <select value={zone} onChange={e => setZone(e.target.value)}
                  style={{ ...inp, appearance: 'none', cursor: 'pointer', color: zone ? C.ink : C.gray400, paddingRight: 32, fontSize: 13 }}>
                  <option value="" disabled>Zone</option>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
                <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 11, color: C.gray400 }}>▼</div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>Message libre</div>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Parlez-nous de votre commerce, vos offres envisagées, vos questions…"
              rows={3} style={{ ...inp, resize: 'none', lineHeight: 1.5 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, marginBottom: 5 }}>
              Comment avez-vous connu Coopers ?
            </div>
            <div style={{ position: 'relative' }}>
              <select value={how} onChange={e => setHow(e.target.value)}
                style={{ ...inp, appearance: 'none', cursor: 'pointer', color: how ? C.ink : C.gray400, paddingRight: 32 }}>
                <option value="" disabled>Sélectionner</option>
                {HOW.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 11, color: C.gray400 }}>▼</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 8, fontSize: 12, color: C.gray400 }}>
          <span style={{ color: C.coral }}>*</span> Champs obligatoires
        </div>

        <button
          onClick={() => canSend && setSent(true)}
          style={{
            marginTop: 24, width: '100%', padding: '16px', borderRadius: 16,
            background: canSend ? AB : C.gray200,
            color: canSend ? '#fff' : C.gray400,
            border: 'none', cursor: canSend ? 'pointer' : 'not-allowed',
            fontSize: 15, fontWeight: 800, fontFamily: 'inherit',
            boxShadow: canSend ? `0 6px 20px rgba(37,99,235,0.3)` : 'none',
          }}
        >
          Envoyer ma demande
        </button>

        <div style={{ textAlign: 'center', fontSize: 12, color: C.gray400, marginTop: 16 }}>
          Nous vous recontactons sous 48h ouvrées 🏝️
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
