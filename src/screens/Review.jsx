import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'

const TAGS = ['Accueil chaleureux', 'Offre respectée', 'Rapport qualité-prix', 'Je recommande', 'À améliorer']
const LABELS = ['', 'Décevant', 'Peut mieux faire', 'Bien', 'Très bien', 'Excellent !']

export default function Review({ navigate, goBack }) {
  const { addPoints, submitReview, currentOffer } = useApp()
  const commerce = currentOffer?.commerce || 'cet établissement'
  const [rating,  setRating]  = useState(0)
  const [hover,   setHover]   = useState(0)
  const [comment, setComment] = useState('')
  const [tags,    setTags]    = useState(new Set())
  const [photo,   setPhoto]   = useState(false)
  const [success, setSuccess] = useState(false)

  const toggleTag = t => setTags(prev => {
    const next = new Set(prev)
    next.has(t) ? next.delete(t) : next.add(t)
    return next
  })

  const canSubmit = rating > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    submitReview(rating, comment)
    addPoints(20)
    setSuccess(true)
  }

  if (success) {
    return (
      <div style={{ width: '100%', height: '100%', background: C.ocean, position: 'relative', overflow: 'hidden', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 72 }}>⭐</div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, textAlign: 'center' }}>Merci pour votre avis !</div>
        <div style={{
          marginTop: 8, padding: '14px 28px', borderRadius: 20,
          background: 'rgba(255,255,255,0.18)', fontSize: 18, fontWeight: 800,
        }}>
          +20 points Coopers crédités !
        </div>
        <div style={{ fontSize: 14, opacity: 0.8, textAlign: 'center', maxWidth: 240 }}>
          Votre avis aide la communauté Coopers à découvrir les meilleurs bons plans.
        </div>
        <button
          onClick={goBack}
          style={{
            marginTop: 16, padding: '14px 40px', borderRadius: 16,
            background: '#fff', color: C.ocean, border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 800, fontFamily: 'inherit',
          }}
        >
          Voir les avis
        </button>
        <button
          onClick={() => navigate('home')}
          style={{
            marginTop: 10, padding: '12px 32px', borderRadius: 16,
            background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          Retour à l'accueil
        </button>
        <HomeIndicator />
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 24px 48px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Laisser un avis</div>
        </div>

        {/* Commerce */}
        <div style={{
          marginTop: 20, display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px', background: '#fff', borderRadius: 16, border: `1px solid ${C.gray200}`,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg,#FFB39A,#FF5A5F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🥐</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{commerce}</div>
            <div style={{ fontSize: 12, color: C.gray500 }}>{currentOffer?.title || 'Votre expérience'}</div>
          </div>
        </div>

        {/* Points bonus */}
        <div style={{
          marginTop: 14, padding: '11px 16px', borderRadius: 14,
          background: 'rgba(14,140,126,0.08)', border: '1px solid rgba(14,140,126,0.15)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>⭐</span>
          <div style={{ fontSize: 13, color: C.ocean, fontWeight: 700 }}>
            +20 points Coopers pour votre avis !
          </div>
        </div>

        {/* Stars */}
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.gray500, marginBottom: 14 }}>
            Quelle note donnez-vous ?
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(n => {
              const active = (hover || rating) >= n
              return (
                <button
                  key={n}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 46, lineHeight: 1, padding: '2px',
                    color: active ? '#F4C24A' : C.gray200,
                    transform: active ? 'scale(1.12)' : 'scale(1)',
                    transition: 'all 0.12s',
                  }}
                >
                  ★
                </button>
              )
            })}
          </div>
          {rating > 0 && (
            <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: C.ink }}>
              {LABELS[rating]}
            </div>
          )}
        </div>

        {/* Tags */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gray500, marginBottom: 10 }}>
            Vos impressions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TAGS.map(t => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                style={{
                  padding: '8px 14px', borderRadius: 999,
                  background: tags.has(t) ? C.ocean : '#fff',
                  border: `1px solid ${tags.has(t) ? C.ocean : C.gray200}`,
                  color: tags.has(t) ? '#fff' : C.ink,
                  fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gray500, marginBottom: 8 }}>
            Votre commentaire
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value.slice(0, 500))}
            placeholder={`Racontez votre expérience chez ${commerce}...`}
            rows={4}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              border: `1px solid ${C.gray200}`, background: '#fff',
              fontSize: 14, fontFamily: 'inherit', outline: 'none',
              resize: 'none', color: C.ink, lineHeight: 1.5, boxSizing: 'border-box',
            }}
          />
          <div style={{ marginTop: 4, textAlign: 'right', fontSize: 11, color: C.gray400 }}>
            {comment.length}/500
          </div>
        </div>

        {/* Photo */}
        <button
          onClick={() => setPhoto(p => !p)}
          style={{
            marginTop: 4, display: 'flex', alignItems: 'center', gap: 12,
            width: '100%', padding: '14px', borderRadius: 14,
            background: photo ? 'rgba(14,140,126,0.06)' : '#fff',
            border: `1px solid ${photo ? C.ocean : C.gray200}`,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: photo ? 'rgba(14,140,126,0.12)' : C.gray100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>
            {photo ? '🖼️' : '📷'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: photo ? C.ocean : C.ink }}>
              {photo ? 'Photo ajoutée ✓' : 'Ajouter une photo'}
            </div>
            <div style={{ fontSize: 11, color: C.gray500, marginTop: 1 }}>
              Optionnel · Partagez votre visite
            </div>
          </div>
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          style={{
            marginTop: 24, width: '100%', padding: '16px', borderRadius: 16,
            background: canSubmit ? C.coral : C.gray200,
            color: canSubmit ? '#fff' : C.gray400,
            border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: canSubmit ? '0 6px 20px rgba(255,90,95,0.3)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Publier mon avis
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}
