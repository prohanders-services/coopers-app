import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import FakeQR from '../components/FakeQR.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'

export default function QRFullscreen({ goBack }) {
  const [copied, setCopied] = useState(false)
  const [enlarged, setEnlarged] = useState(false)

  const code = 'AQUA15'
  const urgent = true

  const copy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (enlarged) {
    return (
      <div
        onClick={() => setEnlarged(false)}
        style={{
          width: '100%', height: '100%',
          background: '#fff', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <FakeQR size={320} fg="#000" bg="#fff" />
        <div style={{ marginTop: 16, fontSize: 12, color: C.gray500 }}>Appuyez pour réduire</div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', overflow: 'hidden', color: C.ink }}>
      <StatusBar />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 24px 48px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: C.gray100,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ flex: 1, fontSize: 17, fontWeight: 700 }}>Mon QR Code</div>
          <button
            onClick={() => setEnlarged(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 10,
              background: C.gray100, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: C.ink, fontFamily: 'inherit',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
            Agrandir
          </button>
        </div>

        {/* Commerce info */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(14,140,126,0.08)',
          }}>
            <span style={{ fontSize: 16 }}>🛥️</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ocean }}>Aqua Tour</span>
          </div>
          <div style={{
            marginTop: 10,
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 22, fontStyle: 'italic', letterSpacing: -0.4, lineHeight: 1.2,
            color: C.ink,
          }}>
            Sortie snorkeling Aqua Tour
          </div>
          <div style={{ marginTop: 6, display: 'inline-block', padding: '4px 12px', borderRadius: 999, background: C.coral, color: '#fff', fontSize: 14, fontWeight: 800 }}>
            -15%
          </div>
        </div>

        {/* QR Code */}
        <div
          onClick={() => setEnlarged(true)}
          style={{
            marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '24px', borderRadius: 24,
            background: '#fff',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)',
            cursor: 'pointer',
          }}
        >
          <FakeQR size={250} fg="#16161A" bg="#fff" />
          <div style={{ marginTop: 12, fontSize: 11, color: C.gray400, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>👆</span> Tap pour agrandir
          </div>
        </div>

        {/* Brightness tip */}
        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 14,
          background: 'rgba(244,194,74,0.1)', border: '1px solid rgba(244,194,74,0.3)',
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <span style={{ fontSize: 18 }}>☀️</span>
          <div style={{ fontSize: 12, color: '#B8860B', fontWeight: 500, lineHeight: 1.4 }}>
            Augmentez la luminosité de votre écran pour faciliter le scan.
          </div>
        </div>

        {/* Expiry warning */}
        {urgent && (
          <div style={{
            marginTop: 12, padding: '12px 16px', borderRadius: 14,
            background: 'rgba(255,90,95,0.08)', border: '1px solid rgba(255,90,95,0.2)',
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div style={{ fontSize: 12, color: C.coral, fontWeight: 600, lineHeight: 1.4 }}>
              Ce Coops expire dans moins de 48h. Utilisez-le vite !
            </div>
          </div>
        )}

        {/* Promo code */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: C.gray500, marginBottom: 8, fontWeight: 500 }}>Code promo alternatif</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{
              padding: '10px 20px', borderRadius: 12,
              background: C.gray100, border: `1.5px dashed ${C.gray400}`,
              fontSize: 18, fontWeight: 900, letterSpacing: 3, fontFamily: 'monospace',
            }}>
              {code}
            </div>
            <button
              onClick={copy}
              style={{
                padding: '10px 16px', borderRadius: 12,
                background: copied ? C.ocean : C.ink,
                border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                transition: 'background 0.2s',
              }}
            >
              {copied ? '✓ Copié' : 'Copier'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ marginTop: 24, padding: '14px 16px', borderRadius: 14, background: C.gray100 }}>
          <div style={{ fontSize: 12, color: C.gray500, lineHeight: 1.5, textAlign: 'center' }}>
            Présentez ce QR code au commerçant pour bénéficier de votre réduction. Valable une seule fois.
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
