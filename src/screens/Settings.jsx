import { useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import { Icon, ICONS } from '../icons.jsx'
import { C } from '../tokens.js'
import { useApp } from '../context/AppContext.jsx'
import { auth, db, FIREBASE_ENABLED } from '../firebase.js'
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { deleteDoc, doc } from 'firebase/firestore'

const SECTIONS = [
  {
    title: 'Compte',
    rows: [
      { emoji: '👤', label: 'Informations personnelles', to: 'editprofile'   },
      { emoji: '🔑', label: 'Sécurité',                  to: 'security'      },
      { emoji: '🔒', label: 'Confidentialité',            to: null            },
    ],
  },
  {
    title: 'Préférences',
    rows: [
      { emoji: '📍', label: 'Zone',         detail: 'Grande-Terre',  to: 'zone'         },
      { emoji: '❤️', label: 'Catégories',   detail: '3 sélectionnées', to: 'editcats'   },
      { emoji: '🌍', label: 'Langue',       detail: 'Français',       to: null           },
    ],
  },
  {
    title: 'Application',
    rows: [
      { emoji: '📱', label: 'Version',       detail: '1.0.0',  to: null },
      { emoji: '🔄', label: 'Mettre à jour', detail: 'À jour', to: null },
      { emoji: '🗂️', label: 'Vider le cache',                  to: null },
    ],
  },
  {
    title: 'Légal',
    rows: [
      { emoji: '📄', label: "Conditions Générales d'Utilisation", to: null },
      { emoji: '🔐', label: 'Politique de confidentialité',        to: null },
      { emoji: '⚖️', label: 'Mentions légales',                    to: null },
    ],
  },
]

export default function Settings({ navigate, goBack }) {
  const { logout, user } = useApp()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirm,    setDeleteConfirm]    = useState('')
  const [deletePass,       setDeletePass]       = useState('')
  const [needsReauth,      setNeedsReauth]      = useState(false)
  const [deleteLoading,    setDeleteLoading]    = useState(false)
  const [deleteError,      setDeleteError]      = useState('')

  const canConfirm = deleteConfirm === 'SUPPRIMER' && (!needsReauth || deletePass.length >= 6)

  const closeDialog = () => {
    setShowDeleteDialog(false)
    setDeleteConfirm('')
    setDeletePass('')
    setNeedsReauth(false)
    setDeleteError('')
    setDeleteLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (!canConfirm || deleteLoading) return
    setDeleteLoading(true)
    setDeleteError('')

    try {
      if (FIREBASE_ENABLED && auth?.currentUser) {
        const uid = auth.currentUser.uid

        // Reauthenticate first if required (or if password already provided)
        if (needsReauth && deletePass) {
          const credential = EmailAuthProvider.credential(auth.currentUser.email, deletePass)
          await reauthenticateWithCredential(auth.currentUser, credential)
        }

        // Delete Firestore document before deleting the auth user
        // (auth user deletion revokes Firestore access)
        try {
          await deleteDoc(doc(db, 'users', uid))
        } catch (_) {
          // Non-blocking — continue with auth deletion even if Firestore fails
        }

        try {
          await deleteUser(auth.currentUser)
        } catch (e) {
          if (e.code === 'auth/requires-recent-login') {
            // Session too old — ask for password and retry
            setNeedsReauth(true)
            setDeleteError('Votre session a expiré. Entrez votre mot de passe pour confirmer la suppression.')
            setDeleteLoading(false)
            return
          }
          throw e
        }
        // onAuthStateChanged in AppContext will reset state automatically
      } else {
        // Demo mode: just clear context
        await logout()
      }
      navigate('login')
    } catch (e) {
      const msgs = {
        'auth/wrong-password':     'Mot de passe incorrect ❌',
        'auth/invalid-credential': 'Mot de passe incorrect ❌',
        'auth/too-many-requests':  'Trop de tentatives. Réessayez plus tard.',
      }
      setDeleteError(msgs[e.code] || 'Erreur lors de la suppression du compte.')
      setDeleteLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.cream, position: 'relative', overflow: 'hidden', color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', background: C.cream, borderRadius: '24px 24px 0 0',
            padding: '24px 20px 40px',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.coral, marginBottom: 8 }}>⚠️ Supprimer mon compte</div>
            <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.55, marginBottom: 20 }}>
              Cette action est <strong>irréversible</strong>. Toutes vos données (historique, points, parrainages) seront définitivement supprimées.
            </div>
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, color: C.gray500 }}>
              Tapez <strong style={{ color: C.ink }}>SUPPRIMER</strong> pour confirmer
            </div>
            <input
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="SUPPRIMER"
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 12,
                border: `1.5px solid ${deleteConfirm === 'SUPPRIMER' ? C.coral : C.gray200}`,
                fontSize: 15, fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box', color: C.ink, background: '#fff',
                marginBottom: needsReauth ? 12 : 16,
              }}
            />

            {needsReauth && (
              <>
                <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, color: C.gray500 }}>
                  Mot de passe actuel
                </div>
                <input
                  type="password"
                  value={deletePass}
                  onChange={e => setDeletePass(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '13px 16px', borderRadius: 12,
                    border: `1.5px solid ${C.gray200}`,
                    fontSize: 15, fontFamily: 'inherit', outline: 'none',
                    boxSizing: 'border-box', color: C.ink, background: '#fff',
                    marginBottom: 16,
                  }}
                />
              </>
            )}

            {deleteError && (
              <div style={{
                padding: '10px 12px', borderRadius: 10, marginBottom: 14,
                background: 'rgba(255,90,95,0.08)', border: '1px solid rgba(255,90,95,0.2)',
                fontSize: 13, fontWeight: 600, color: C.coral,
              }}>
                {deleteError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={closeDialog}
                style={{
                  flex: 1, padding: '14px', borderRadius: 14,
                  background: '#fff', border: `1px solid ${C.gray200}`,
                  color: C.ink, fontSize: 15, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!canConfirm || deleteLoading}
                style={{
                  flex: 1, padding: '14px', borderRadius: 14, border: 'none',
                  background: canConfirm && !deleteLoading ? C.coral : C.gray200,
                  color: canConfirm && !deleteLoading ? '#fff' : C.gray400,
                  fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                  cursor: canConfirm && !deleteLoading ? 'pointer' : 'not-allowed',
                }}
              >
                {deleteLoading ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 48px', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ paddingBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={goBack} style={{
            width: 38, height: 38, borderRadius: 19, background: '#fff',
            border: `1px solid ${C.gray200}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={ICONS.chevL} size={18} stroke={C.ink} sw={2} />
          </button>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Paramètres</div>
        </div>

        {/* Sections */}
        {SECTIONS.map((section, si) => (
          <div key={si} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
              {section.title}
            </div>
            <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
              {section.rows.map((row, ri) => (
                <button
                  key={ri}
                  onClick={() => row.to && navigate(row.to)}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '13px 16px',
                    width: '100%', background: 'none', border: 'none', fontFamily: 'inherit',
                    borderBottom: ri < section.rows.length - 1 ? `1px solid ${C.gray100}` : 'none',
                    cursor: row.to ? 'pointer' : 'default', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: C.gray100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, marginRight: 12,
                  }}>
                    {row.emoji}
                  </div>
                  <div style={{ flex: 1, fontSize: 15, fontWeight: 500, color: C.ink }}>{row.label}</div>
                  {row.detail && <div style={{ fontSize: 13, color: C.gray500, marginRight: 8 }}>{row.detail}</div>}
                  {row.to && <Icon d={ICONS.chevR} size={14} stroke={C.gray400} sw={2} />}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Danger zone */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.coral, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
            Zone de danger ⚠️
          </div>
          <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1.5px solid rgba(255,90,95,0.2)` }}>
            <button
              onClick={() => setShowDeleteDialog(true)}
              style={{
                display: 'flex', alignItems: 'center', padding: '14px 16px',
                width: '100%', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: 'rgba(255,90,95,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, marginRight: 12,
              }}>
                🗑️
              </div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: C.coral, textAlign: 'left' }}>
                Supprimer mon compte
              </div>
              <Icon d={ICONS.chevR} size={14} stroke={C.coral} sw={2} />
            </button>
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
