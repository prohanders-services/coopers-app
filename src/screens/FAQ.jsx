import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

const SECTIONS = [
  {
    title: 'Comment ça marche',
    emoji: '💡',
    items: [
      {
        q: "Qu'est-ce qu'un Coops ?",
        a: "Un Coops est un bon plan exclusif proposé par nos partenaires locaux. Il vous permet d'obtenir une réduction ou un avantage chez un commerce de Guadeloupe. Activez-le, présentez votre QR code et profitez !",
      },
      {
        q: 'Comment activer un Coops ?',
        a: "Trouvez une offre qui vous plaît, appuyez sur « Activer ce Coops », puis présentez le QR code au commerçant. L'offre est valide pour la durée indiquée.",
      },
      {
        q: 'Combien de Coops puis-je activer ?',
        a: "Vous pouvez activer autant de Coops que vous souhaitez. Certaines offres sont limitées à une utilisation par personne — cela est précisé sur la fiche de l'offre.",
      },
      {
        q: 'Les Coops sont-ils gratuits ?',
        a: "Oui, l'application et l'accès aux Coops sont entièrement gratuits. Vous payez uniquement ce que vous consommez chez le commerçant, avec la réduction appliquée.",
      },
    ],
  },
  {
    title: 'Problèmes avec un Coops',
    emoji: '🔧',
    items: [
      {
        q: 'Le commerçant a refusé mon Coops',
        a: "Vérifiez d'abord que le Coops n'est pas expiré et qu'il s'applique bien à ce commerce. Si le problème persiste, contactez notre support en mentionnant le nom du commerce et la date — nous réglerons ça rapidement.",
      },
      {
        q: 'Mon QR code ne fonctionne pas',
        a: "Assurez-vous que la luminosité de votre écran est au maximum et qu'il n'y a pas de reflet. Si le problème persiste, appuyez sur « Voir le code » pour afficher le code alphanumérique à saisir manuellement.",
      },
      {
        q: "Je n'ai pas reçu mes points après un achat",
        a: "Les points sont crédités automatiquement après validation par le commerçant, sous 24h maximum. Si ce délai est dépassé, contactez le support avec votre reçu.",
      },
    ],
  },
  {
    title: 'Compte & Sécurité',
    emoji: '🔒',
    items: [
      {
        q: 'Comment changer mon mot de passe ?',
        a: "Rendez-vous dans Paramètres → Sécurité → Changer le mot de passe. Vous devrez saisir votre mot de passe actuel, puis le nouveau deux fois pour confirmer.",
      },
      {
        q: 'Comment activer la double authentification ?',
        a: "Dans Paramètres → Sécurité, activez le toggle « Authentification à 2 facteurs ». Choisissez entre SMS et une application d'authentification (recommandé).",
      },
      {
        q: 'Comment supprimer mon compte ?',
        a: "Dans Paramètres → Zone de danger → Supprimer mon compte. Cette action est irréversible : toutes vos données (historique, points, parrainages) seront définitivement supprimées.",
      },
    ],
  },
  {
    title: 'Programme fidélité',
    emoji: '⭐',
    items: [
      {
        q: 'Comment gagner des points ?',
        a: "Vous gagnez des points à chaque Coops utilisé, en parrainant des amis, en complétant des défis, et lors d'événements spéciaux. Le nombre de points est indiqué sur chaque action.",
      },
      {
        q: 'Comment monter de niveau ?',
        a: "Les niveaux sont Sable, Coral, Turquoise et Lagon. Chaque niveau se débloque en accumulant un certain nombre de points. Des avantages exclusifs sont débloqués à chaque palier.",
      },
      {
        q: 'Mes points expirent-ils ?',
        a: "Les points sont valables 12 mois à partir de leur date d'obtention. Une notification vous avertit 30 jours avant expiration pour que vous puissiez les utiliser à temps.",
      },
    ],
  },
]

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${C.gray100}` }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', background: 'none', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', gap: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: C.ink, flex: 1, lineHeight: 1.4 }}>{item.q}</span>
        <div style={{
          width: 22, height: 22, borderRadius: 11, flexShrink: 0,
          background: open ? C.ocean : C.gray100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}>
          <Icon d={open ? ICONS.chevL : ICONS.chevR} size={11}
            stroke={open ? '#fff' : C.gray500} sw={2.5}
            style={{ transform: open ? 'rotate(90deg)' : 'rotate(90deg)' }}
          />
        </div>
      </button>
      {open && (
        <div style={{
          padding: '0 16px 14px', fontSize: 13, color: C.gray500,
          lineHeight: 1.65, borderTop: `1px solid ${C.gray100}`,
          paddingTop: 10,
        }}>
          {item.a}
        </div>
      )}
    </div>
  )
}

export default function FAQ({ goBack }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? SECTIONS.map(s => ({
        ...s,
        items: s.items.filter(
          i => i.q.toLowerCase().includes(query.toLowerCase()) ||
               i.a.toLowerCase().includes(query.toLowerCase())
        ),
      })).filter(s => s.items.length > 0)
    : SECTIONS

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
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Aide & FAQ</div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 22 }}>
          <div style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher une question…"
            style={{
              width: '100%', padding: '13px 16px 13px 42px', borderRadius: 14,
              border: `1px solid ${C.gray200}`, background: '#fff',
              fontSize: 14, fontFamily: 'inherit', outline: 'none',
              boxSizing: 'border-box', color: C.ink,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: C.gray200, border: 'none', borderRadius: 999, cursor: 'pointer',
                width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: C.gray500, fontWeight: 700,
              }}
            >✕</button>
          )}
        </div>

        {/* FAQ sections */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: C.gray400 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Aucun résultat pour « {query} »</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Essayez un autre mot-clé ou contactez le support.</div>
          </div>
        ) : (
          filtered.map((section, si) => (
            <div key={si} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{section.emoji}</span>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {section.title}
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
                {section.items.map((item, ii) => (
                  <FAQItem key={ii} item={item} />
                ))}
              </div>
            </div>
          ))
        )}

        {/* Contact support */}
        <div style={{ marginTop: 8, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Contacter le support
          </div>
          <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
            {[
              { emoji: '💬', label: 'Chat en direct',  detail: 'Réponse en moins de 5 min', color: C.ocean   },
              { emoji: '📧', label: 'Email',            detail: 'support@coopers.gp',        color: '#6C63FF' },
              { emoji: '📞', label: 'Téléphone',        detail: '0590 XX XX XX',              color: C.coral   },
            ].map((c, i, arr) => (
              <button
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left',
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.gray100}` : 'none',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: `${c.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  {c.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>{c.detail}</div>
                </div>
                <Icon d={ICONS.chevR} size={14} stroke={C.gray400} sw={2} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: C.gray400 }}>
          Coopers v1.0.0 · Guadeloupe 🏝️
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
