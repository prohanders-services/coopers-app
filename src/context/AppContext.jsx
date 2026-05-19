import { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react'
import { OFFERS } from '../data/offers.js'
import { auth, db, FIREBASE_ENABLED } from '../firebase.js'
import {
  onAuthStateChanged, signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup,
} from 'firebase/auth'
import {
  doc, getDoc, setDoc, updateDoc,
  collection, addDoc, deleteDoc,
  onSnapshot, query, orderBy, collectionGroup,
  serverTimestamp, getDocs, where, arrayUnion, increment,
} from 'firebase/firestore'

const CAT_META = {
  'Restaurants':     { catId: 'restaurants', catEmoji: '🍽️', emoji: '🍽️', gradient: 'linear-gradient(140deg,#FFB39A,#FF5A5F)' },
  'Nautique':        { catId: 'nautique',    catEmoji: '🤿',  emoji: '🤿',  gradient: 'linear-gradient(140deg,#5BB8E2,#0E8C7E)' },
  'Nature & Parcs':  { catId: 'nature',      catEmoji: '🌿',  emoji: '🌿',  gradient: 'linear-gradient(140deg,#A7F3D0,#059669)' },
  'Bars & Sorties':  { catId: 'bars',        catEmoji: '🍹',  emoji: '🍹',  gradient: 'linear-gradient(140deg,#FDE68A,#F59E0B)' },
  'Beauté':          { catId: 'beaute',      catEmoji: '✂️',  emoji: '✂️',  gradient: 'linear-gradient(140deg,#FBCFE8,#EC4899)' },
  'Shopping local':  { catId: 'shopping',    catEmoji: '🛍️',  emoji: '🛍️',  gradient: 'linear-gradient(140deg,#FDE68A,#F59E0B)' },
  'Sport & Bien-être':{ catId: 'sport',      catEmoji: '🏋️',  emoji: '🏋️',  gradient: 'linear-gradient(140deg,#BBF7D0,#16A34A)' },
}

function normalizeFirestoreOffer(id, data) {
  const meta = CAT_META[data.category] || { catId: 'autre', catEmoji: '🎫', emoji: '🎫', gradient: 'linear-gradient(140deg,#E2E8F0,#94A3B8)' }
  return {
    id,
    commerce:              data.commerceName || '',
    title:                 data.title || '',
    desc:                  data.description || data.title || '',
    category:              data.category || '',
    catId:                 meta.catId,
    catEmoji:              meta.catEmoji,
    emoji:                 data.emoji || meta.emoji,
    gradient:              data.gradient || meta.gradient,
    zone:                  data.zone || '',
    location:              data.ville || data.zone || '',
    dist:                  data.dist || 5.0,
    discount:              data.discount || 0,
    discountType:          data.discountType || 'pourcentage',
    imageUrl:              data.imageUrl || null,
    code:                  data.promoCode || '',
    expiry:                data.dateFin || '',
    isFeatured:            data.isFeatured || false,
    isNew:                 data.isNew || false,
    utilisationsMax:       data.utilisationsMax || null,
    compteurUtilisations:  data.compteurUtilisations || 0,
    utilisationsParUser:   data.utilisationsParUser || 1,
    points:                data.points || 10,
    rating:                data.rating || 4.5,
    reviews:               data.reviews || 0,
    conditions:            data.conditions || [],
    joursValides:          data.joursValides || '',
    commandeMinimum:       data.commandeMinimum || 0,
    type:                  data.type || null,
    pointsRequired:        data.pointsRequired || null,
    commerceId:            data.commerceId || id,
  }
}

// Navigation rule: ALWAYS call setCurrentOffer(offer) before navigate('offer')
// Never identify an offer by index — always pass the complete offer object.
const AppContext = createContext()
export const useApp = () => useContext(AppContext)

// Challenge definitions — checked against real user data
const CHALLENGE_DEFS = [
  { id: 1, name: 'Explorateur', pts: 30,  check: (coops)     => new Set(coops.map(c => c.category).filter(Boolean)).size >= 3 },
  { id: 2, name: 'Fidèle',      pts: 100, check: (coops)     => coops.filter(c => c.status === 'utilisé' || c.used).length >= 4 },
  { id: 3, name: 'Découvreur',  pts: 50,  check: (coops)     => new Set(coops.map(c => c.commerce).filter(Boolean)).size >= 2 },
  { id: 4, name: 'Social',      pts: 50,  check: (_, u)      => (u?.referrals || []).length >= 1 },
]

const DEFAULT_USER = {
  firstName: 'Marie',
  lastName: 'Boucard',
  email: 'user@coopers.gp',
  phone: '06 90 12 34 56',
  dob: '15/04/1992',
  zone: 'Grande-Terre',
  categories: new Set(['restaurants', 'nautique', 'nature']),
  points: 260,
  totalSaved: 0,
  coopsUsed: 0,
  photo: false,
  referralCode: 'MARXXX',
  referrals: [],
  referredBy: null,
}

function generateReferralCode(firstName, uid) {
  const prefix = (firstName || '').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase().padEnd(3, 'X')
  const suffix = (uid || '').slice(-3).toUpperCase()
  return prefix + suffix
}

const DEFAULT_ADMIN_COMMERCE = {
  name: 'Le Rocher de Malendure',
  category: '🍽️ Restaurants',
  description: 'Restaurant avec vue sur mer à Bouillante. Spécialités créoles et fruits de mer frais.',
  address: 'Route de Malendure, 97125 Bouillante',
  phone: '0590 98 76 54',
  website: 'www.rocher-malendure.gp',
  insta: '@rochermalendure',
  facebook: 'RocherDeMalendure',
  zone: 'Basse-Terre',
  subscriptionPlan: 'premium',
}

const DEFAULT_ADMIN_OFFERS = [
  { id: 1, emoji: '🍽️', title: '-20% sur le plat du jour',          status: 'Actif',    statusColor: '#16A34A', statusBg: '#DCFCE7', reduction: '-20%',   used: 47, remaining: 53,  expiry: '31 mai 2026'  },
  { id: 2, emoji: '🍹', title: 'Cocktail de bienvenue offert',       status: 'Actif',    statusColor: '#16A34A', statusBg: '#DCFCE7', reduction: 'Offert', used: 28, remaining: 72,  expiry: '15 juin 2026' },
  { id: 3, emoji: '🥘', title: '-15% Menu dégustation 4 plats',      status: 'Actif',    statusColor: '#16A34A', statusBg: '#DCFCE7', reduction: '-15%',   used: 19, remaining: 31,  expiry: '30 mai 2026'  },
  { id: 4, emoji: '🎂', title: 'Dessert offert pour anniversaire',   status: 'Brouillon',statusColor: '#2563EB', statusBg: '#DBEAFE', reduction: 'Offert', used: 0,  remaining: 100, expiry: 'Non définie'  },
  { id: 5, emoji: '🥂', title: 'Happy Hour -30%',                    status: 'Expiré',   statusColor: '#6B7280', statusBg: '#F3F4F6', reduction: '-30%',   used: 94, remaining: 0,   expiry: '30 avr. 2026' },
  { id: 6, emoji: '🦞', title: 'Menu Homard -25%',                   status: 'Suspendu', statusColor: '#D97706', statusBg: '#FEF3C7', reduction: '-25%',   used: 12, remaining: 38,  expiry: '20 juin 2026' },
]

const MONTHS_FR = { jan: 0, 'fév': 1, 'fev': 1, mar: 2, avr: 3, mai: 4, juin: 5, juil: 6, 'aoû': 7, aou: 7, sep: 8, oct: 9, nov: 10, 'déc': 11, dec: 11 }
const parseFrDate = (str) => {
  if (!str || str === 'Non définie') return null
  const parts = str.toLowerCase().replace(/\./g, '').split(' ')
  if (parts.length < 3) return null
  const day = parseInt(parts[0])
  const month = MONTHS_FR[parts[1].slice(0, 4)] ?? MONTHS_FR[parts[1].slice(0, 3)]
  const year = parseInt(parts[2])
  if (isNaN(day) || month === undefined || isNaN(year)) return null
  return new Date(year, month, day)
}

const DEFAULT_FILTERS = { categories: new Set(), zone: '', minDiscount: 0, sort: 'Popularité' }

const serializeUser = (u) => ({
  ...u,
  categories: u.categories instanceof Set ? [...u.categories] : (u.categories || []),
})

const deserializeUser = (data) => ({
  ...data,
  categories: new Set(data.categories || []),
  photo: data.photoURL || false,
})

export function AppProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(FIREBASE_ENABLED)

  const [user, setUser] = useState(DEFAULT_USER)
  const [adminCommerce, setAdminCommerce] = useState(DEFAULT_ADMIN_COMMERCE)
  const [adminOffers, setAdminOffers] = useState(DEFAULT_ADMIN_OFFERS)
  const [userCoops, setUserCoops] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentOffer, setCurrentOffer] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS)
  const [offerListConfig, setOfferListConfig] = useState({ title: '', type: 'all' })
  const [favorites, setFavorites] = useState(new Set())
  const [pendingReg, setPendingReg] = useState({ email: '', password: '', firstName: '', lastName: '', referralCodeInput: '' })
  const [offerCounters, setOfferCounters] = useState(() =>
    Object.fromEntries(OFFERS.filter(o => o.utilisationsMax != null).map(o => [o.id, o.compteurUtilisations || 0]))
  )
  const [userReviews, setUserReviews] = useState({})
  const [completedChallenges, setCompletedChallenges] = useState(new Set())
  const [lastChallengeCompleted, setLastChallengeCompleted] = useState(null)
  const [pendingValidation, setPendingValidation] = useState(null)
  const [adminStats, setAdminStats] = useState({ validations: 0, clientsUniques: [], economies: 0, validationHistory: [] })
  const [adminNotifications, setAdminNotifications] = useState([])
  const [currentEditOffer, setCurrentEditOffer] = useState(null)
  const [liveOffers, setLiveOffers] = useState([])

  const coopsUnsubRef = useRef(null)

  // ── Auto-expire admin offers on mount ───────────────────────────────────
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    setAdminOffers(prev => prev.map(offer => {
      if (offer.status === 'Expiré' || offer.status === 'Brouillon') return offer
      const expDate = parseFrDate(offer.expiry)
      if (expDate && expDate < today) {
        return { ...offer, status: 'Expiré', statusColor: '#6B7280', statusBg: '#F3F4F6' }
      }
      return offer
    }))
  }, [])

  // ── Live offers from Firestore ──────────────────────────────────────────
  useEffect(() => {
    if (!FIREBASE_ENABLED) return
    // Single-field query only (no composite index required)
    const q = query(
      collection(db, 'offers'),
      where('status', '==', 'actif')
    )
    const unsub = onSnapshot(q, (snap) => {
      const today = new Date().toISOString().slice(0, 10)
      const normalized = snap.docs
        .map(d => normalizeFirestoreOffer(d.id, d.data()))
        .filter(o => !o.expiry || o.expiry >= today)
      console.log('[Coopers] Firestore offers loaded:', normalized.length, normalized.map(o => o.commerce))
      setLiveOffers(normalized)
      const counters = {}
      normalized.forEach(o => {
        if (o.utilisationsMax != null) counters[o.id] = o.compteurUtilisations || 0
      })
      setOfferCounters(prev => ({ ...prev, ...counters }))
    }, (err) => {
      console.error('[Coopers] offers snapshot error:', err)
    })
    return unsub
  }, [])

  // ── Firebase Auth listener ──────────────────────────────────────────────
  useEffect(() => {
    if (!FIREBASE_ENABLED) return

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser)
        try {
          const snap = await getDoc(doc(db, 'users', fbUser.uid))
          if (snap.exists()) {
            const data = snap.data()
            setUser(deserializeUser(data))
            setIsAdmin(data.isAdmin || false)
            setFavorites(new Set(data.favorites || []))
          } else {
            setUser(prev => ({ ...prev, email: fbUser.email }))
          }
        } catch (e) {
          console.error('Error fetching user doc:', e)
        }
        setIsLoggedIn(true)
      } else {
        setFirebaseUser(null)
        setUser(DEFAULT_USER)
        setUserCoops([])
        setFavorites(new Set())
        setIsLoggedIn(false)
        setIsAdmin(false)
        if (coopsUnsubRef.current) {
          coopsUnsubRef.current()
          coopsUnsubRef.current = null
        }
      }
      setAuthLoading(false)
    })

    return unsub
  }, [])

  // ── Real-time coops listener ────────────────────────────────────────────
  useEffect(() => {
    if (!FIREBASE_ENABLED || !firebaseUser) return

    if (coopsUnsubRef.current) coopsUnsubRef.current()

    const q = query(
      collection(db, 'users', firebaseUser.uid, 'coops'),
      orderBy('createdAt', 'desc')
    )
    coopsUnsubRef.current = onSnapshot(q, (snap) => {
      setUserCoops(snap.docs.map(d => ({ ...d.data(), id: d.id })))
    })

    return () => {
      if (coopsUnsubRef.current) coopsUnsubRef.current()
    }
  }, [firebaseUser])

  // ── User mutations ──────────────────────────────────────────────────────
  const updateUser = async (updates) => {
    const next = { ...user, ...updates }
    setUser(next)
    if (FIREBASE_ENABLED && firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), serializeUser(updates))
      } catch (e) {
        console.error('updateUser error:', e)
      }
    }
  }

  const addPoints = (pts) => {
    setUser(prev => {
      const next = { ...prev, points: prev.points + pts }
      if (FIREBASE_ENABLED && firebaseUser) {
        updateDoc(doc(db, 'users', firebaseUser.uid), { points: next.points }).catch(console.error)
      }
      return next
    })
  }

  const deductPoints = (pts) => {
    setUser(prev => {
      const next = { ...prev, points: Math.max(0, prev.points - pts) }
      if (FIREBASE_ENABLED && firebaseUser) {
        updateDoc(doc(db, 'users', firebaseUser.uid), { points: next.points }).catch(console.error)
      }
      return next
    })
  }

  // ── Challenge logic ─────────────────────────────────────────────────────
  const checkChallenges = useCallback((coops, currentUser) => {
    setCompletedChallenges(prev => {
      const next = new Set(prev)
      let totalPts = 0
      let newlyCompleted = null

      CHALLENGE_DEFS.forEach(ch => {
        if (!prev.has(ch.id) && ch.check(coops, currentUser)) {
          next.add(ch.id)
          totalPts += ch.pts
          newlyCompleted = ch
        }
      })

      if (totalPts > 0 && newlyCompleted) {
        setUser(u => {
          const updated = { ...u, points: u.points + totalPts }
          if (FIREBASE_ENABLED && firebaseUser) {
            updateDoc(doc(db, 'users', firebaseUser.uid), { points: updated.points }).catch(console.error)
          }
          return updated
        })
        setLastChallengeCompleted(newlyCompleted)
      }

      return next
    })
  }, [firebaseUser])

  const clearLastChallenge = () => setLastChallengeCompleted(null)

  // ── Coops mutations ─────────────────────────────────────────────────────
  const activateCoops = async (offer) => {
    // Check global utilisationsMax
    const currentCount = offerCounters[offer.id] ?? (offer.compteurUtilisations || 0)
    if (offer.utilisationsMax && currentCount >= offer.utilisationsMax) {
      return { success: false, maxReached: true }
    }

    // Check per-user limits
    const existingForOffer = userCoops.filter(c =>
      c.offerId === offer.id || (c.commerce === offer.commerce && c.offer === offer.title)
    )

    if (existingForOffer.length > 0) {
      const usedCoop = existingForOffer.find(c => c.status === 'utilisé' || c.used)

      if (offer.utilisationsParUser === '1/week') {
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        const usedThisWeek = existingForOffer.some(c => {
          if (!(c.status === 'utilisé' || c.used)) return false
          if (!c.dateUtilisation) return false
          const p = c.dateUtilisation.split('/')
          if (p.length !== 3) return false
          return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0])).getTime() > oneWeekAgo
        })
        if (usedThisWeek) {
          const next = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          return { success: false, weeklyLimitReached: true, nextDate: next.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }
        }
      } else if (usedCoop) {
        return { success: false, alreadyUsed: true }
      } else {
        return { success: false, isDuplicate: true }
      }
    }

    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 30)
    const dd   = String(expiry.getDate()).padStart(2, '0')
    const mm   = String(expiry.getMonth() + 1).padStart(2, '0')
    const yyyy = expiry.getFullYear()
    const expiryStr = `${dd}/${mm}/${yyyy}`

    // unique coopCode per user-activation — format: offer.promoCode + last4uid + timestamp
    const basePromoCode = offer.promoCode || `COOPS-${(offer.commerce || '').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}${offer.discount}`
    const uid = (FIREBASE_ENABLED && firebaseUser?.uid) ? firebaseUser.uid : (user?.uid || 'DEMO0000')
    const coopCode = `${basePromoCode}-${uid.slice(-4).toUpperCase()}-${Date.now()}`
    console.log('[DEBUG] coopCode generated:', coopCode, 'from offer.promoCode:', offer.promoCode)

    const newCoop = {
      offerId:      offer.id,
      commerce:     offer.commerce,
      offer:        offer.title,
      // store actual admin UID as commerceId so scanner can verify ownership
      commerceId:   offer.commerceId || (offer.commerce || '').toLowerCase().replace(/[\s']/g, '-').slice(0, 12),
      discount:     offer.discount,
      category:     offer.category || '',
      zone:         offer.zone || '',
      expiry:       expiryStr,
      promoCode:    basePromoCode,  // offer-level code (display only)
      coopCode,                     // BUG 1: unique per user-activation
      status:       'actif',
      pointsGained: 10,
      dateObtained: new Date().toLocaleDateString('fr-FR'),
      used:         false,
      gradient:     offer.gradient || 'linear-gradient(140deg,#FFB39A,#FF5A5F)',
      emoji:        offer.emoji || '🎫',
      urgent:       false,
    }

    if (FIREBASE_ENABLED && firebaseUser) {
      try {
        const ref = await addDoc(
          collection(db, 'users', firebaseUser.uid, 'coops'),
          { ...newCoop, createdAt: serverTimestamp() }
        )
        const coop = { ...newCoop, id: ref.id }
        const updatedCoops = [coop, ...userCoops]
        checkChallenges(updatedCoops, user)
        return { success: true, isDuplicate: false, coop, expiryStr }
      } catch (e) {
        console.error('activateCoops error:', e)
      }
    }

    // Demo mode
    const localCoop = { ...newCoop, id: Date.now() }
    const updatedCoops = [localCoop, ...userCoops]
    setUserCoops(updatedCoops)
    checkChallenges(updatedCoops, user)
    return { success: true, isDuplicate: false, coop: localCoop, expiryStr }
  }

  const tryAddCoops = (coop) => {
    const already = userCoops.some(c => c.offer === coop.offer && c.commerce === coop.commerce)
    if (already) return false
    setUserCoops(prev => [...prev, { ...coop, id: Date.now(), used: false }])
    return true
  }

  const removeUserCoop = async (id) => {
    setUserCoops(prev => prev.filter(c => c.id !== id))
    if (FIREBASE_ENABLED && firebaseUser) {
      try {
        await deleteDoc(doc(db, 'users', firebaseUser.uid, 'coops', String(id)))
      } catch (e) {
        console.error('removeUserCoop error:', e)
      }
    }
  }

  // ── Admin scan / validation chain ───────────────────────────────────────
  // BUG 2: async — Firebase mode uses collectionGroup query across ALL users' coops
  const adminScanCoop = async (coopCode) => {
    const normalized = coopCode.trim().toUpperCase()

    if (FIREBASE_ENABLED && firebaseUser) {
      try {
        // Search across ALL users/{uid}/coops subcollections for matching coopCode
        const q = query(
          collectionGroup(db, 'coops'),
          where('coopCode', '==', normalized)
        )
        const snap = await getDocs(q)

        if (snap.empty) {
          return { type: 'invalid', coopId: coopCode }
        }

        const coopDoc = snap.docs[0]
        const coopData = coopDoc.data()
        const coop = { ...coopData, id: coopDoc.id }

        // Parent path: users/{userId}/coops/{coopId} → parent.parent = users/{userId}
        const userRef = coopDoc.ref.parent.parent
        const userId = userRef.id
        const userSnap = await getDoc(userRef)
        const userData = userSnap.exists() ? userSnap.data() : {}

        // Verify coop belongs to this admin's commerce (commerceId == admin UID)
        if (coop.commerceId !== firebaseUser.uid) {
          return { type: 'wrong', offer: coop.offer, correctCommerce: coop.commerce, coopId: coopCode }
        }

        if (coop.status === 'utilisé' || coop.used) {
          return {
            type: 'used',
            client: userData.firstName || 'Client',
            offer: coop.offer,
            usedAt: coop.dateUtilisation ? `le ${coop.dateUtilisation}${coop.heureUtilisation ? ' à ' + coop.heureUtilisation : ''}` : 'récemment',
            coopId: coopCode,
          }
        }

        if (coop.expiry) {
          const p = coop.expiry.split('/')
          if (p.length === 3) {
            const expDate = new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]))
            if (expDate < new Date()) {
              return { type: 'expired', offer: coop.offer, expiredAt: coop.expiry, coopId: coopCode }
            }
          }
        }

        return {
          type: 'valid',
          client: userData.firstName || 'Client',
          offer: coop.offer,
          reduction: `-${coop.discount}%`,
          conditions: '1 utilisation par personne',
          expiry: coop.expiry,
          coopId: coopCode,
          _coop: coop,
          _userId: userId,
          _userData: userData,
        }
      } catch (e) {
        console.error('[Coopers] adminScanCoop error:', e)
        return { type: 'invalid', coopId: coopCode }
      }
    }

    // Demo mode: search current user's coops by coopCode or promoCode fallback
    const coop = userCoops.find(c =>
      (c.coopCode || '').toUpperCase() === normalized ||
      (c.promoCode || '').toUpperCase() === normalized
    )

    if (!coop) return { type: 'invalid', coopId: coopCode }

    if ((coop.commerce || '').toLowerCase() !== (adminCommerce.name || '').toLowerCase()) {
      return { type: 'wrong', offer: coop.offer, correctCommerce: coop.commerce, coopId: coopCode }
    }

    if (coop.status === 'utilisé' || coop.used) {
      return {
        type: 'used',
        client: user.firstName,
        offer: coop.offer,
        usedAt: coop.dateUtilisation ? `le ${coop.dateUtilisation}${coop.heureUtilisation ? ' à ' + coop.heureUtilisation : ''}` : 'récemment',
        coopId: coopCode,
      }
    }

    if (coop.expiry) {
      const p = coop.expiry.split('/')
      if (p.length === 3) {
        const expDate = new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]))
        if (expDate < new Date()) {
          return { type: 'expired', offer: coop.offer, expiredAt: coop.expiry, coopId: coopCode }
        }
      }
    }

    return {
      type: 'valid',
      client: user.firstName,
      offer: coop.offer,
      reduction: `-${coop.discount}%`,
      conditions: '1 utilisation par personne',
      expiry: coop.expiry,
      coopId: coopCode,
      _coop: coop,
      _userId: null,
      _userData: user,
    }
  }

  // BUG 3: full async validation chain — Steps A-F
  const adminValidateCoop = async (scanResult) => {
    const coop = scanResult._coop
    if (!coop) return null

    const now = new Date()
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    const dateStr = now.toLocaleDateString('fr-FR')
    const savings = Math.max(1, Math.round((coop.discount / 100) * 25))

    // ── Local state updates (instant UI feedback) ──────────────────────────
    setUserCoops(prev => prev.map(c => c.id === coop.id ? {
      ...c, status: 'utilisé', used: true, dateUtilisation: dateStr, heureUtilisation: timeStr,
    } : c))

    setUser(prev => ({
      ...prev,
      totalSaved: (prev.totalSaved || 0) + savings,
      coopsUsed:  (prev.coopsUsed  || 0) + 1,
      points:     prev.points + 10,
    }))

    if (coop.offerId) {
      setOfferCounters(prev => ({ ...prev, [coop.offerId]: (prev[coop.offerId] || 0) + 1 }))
    }

    setPendingValidation({ commerce: coop.commerce, offer: coop.offer, discount: coop.discount, savings, timeStr, ts: Date.now() })

    const updatedCoops = userCoops.map(c => c.id === coop.id ? { ...c, status: 'utilisé', used: true } : c)
    checkChallenges(updatedCoops, user)

    const entry = { id: `CP-${Date.now()}`, time: timeStr, date: dateStr, client: scanResult.client, offer: coop.offer, amount: `${savings},00 €`, savings }
    setAdminStats(prev => ({
      validations:      prev.validations + 1,
      clientsUniques:   prev.clientsUniques.includes(scanResult.client) ? prev.clientsUniques : [...prev.clientsUniques, scanResult.client],
      economies:        prev.economies + savings,
      validationHistory: [entry, ...prev.validationHistory],
    }))
    setAdminNotifications(prev => [{
      id: Date.now(), type: 'validation', read: false, time: timeStr, date: dateStr,
      msg: `${scanResult.client} a utilisé « ${coop.offer} »`,
    }, ...prev])

    // ── Firestore persistence chain ────────────────────────────────────────
    if (FIREBASE_ENABLED && firebaseUser) {
      const userId  = scanResult._userId || firebaseUser.uid
      const coopRef = doc(db, 'users', userId, 'coops', String(coop.id))

      // Step A: mark coop as used
      updateDoc(coopRef, {
        status: 'utilisé', used: true,
        dateUtilisation: dateStr, heureUtilisation: timeStr,
        updatedAt: serverTimestamp(),
      }).catch(e => console.error('[Coopers] Step A:', e))

      // Step B + C: user stats + history entry
      const historyEntry = {
        offerId:         coop.offerId || '',
        commerceName:    coop.commerce,
        offerTitle:      coop.offer,
        montantEconomise: savings,
        pointsGagnes:    10,
        dateUtilisation: dateStr,
        heureUtilisation: timeStr,
        ts:              Date.now(),
      }
      updateDoc(doc(db, 'users', userId), {
        totalSaved: increment(savings),
        coopsUsed:  increment(1),
        points:     increment(10),
        history:    arrayUnion(historyEntry),
      }).catch(e => console.error('[Coopers] Step B+C:', e))

      // Step D: offer redemption counter
      if (coop.offerId && !String(coop.offerId).startsWith('admin-')) {
        updateDoc(doc(db, 'offers', String(coop.offerId)), {
          compteurUtilisations: increment(1),
        }).catch(e => console.error('[Coopers] Step D:', e))
      }

      // Step E: push notification to user's notifications subcollection
      addDoc(collection(db, 'users', userId, 'notifications'), {
        type:    'validation',
        title:   'Coops validé ! 🎉',
        message: `Votre Coops "${coop.offer}" chez ${coop.commerce} a été validé. Vous avez économisé ~${savings}€ et gagné +10 points !`,
        read:    false,
        ts:      Date.now(),
        createdAt: serverTimestamp(),
      }).catch(e => console.error('[Coopers] Step E:', e))

      // Step F: append to admin's validationHistory
      updateDoc(doc(db, 'users', firebaseUser.uid), {
        validationHistory: arrayUnion({
          userFirstName:    scanResult.client,
          offerTitle:       coop.offer,
          montantRemise:    savings,
          coopCode:         coop.coopCode || coop.promoCode || '',
          dateValidation:   dateStr,
          heureValidation:  timeStr,
          ts:               Date.now(),
        }),
      }).catch(e => console.error('[Coopers] Step F:', e))
    }

    return { timeStr, dateStr, savings, client: scanResult.client }
  }

  // ── Auth actions ────────────────────────────────────────────────────────
  const loginWithEmail = async (email, password) => {
    if (!FIREBASE_ENABLED) {
      const DEMO = {
        'user@coopers.gp':  { password: 'demo1234',  admin: false },
        'admin@coopers.gp': { password: 'admin1234', admin: true  },
      }
      const match = DEMO[email.trim().toLowerCase()]
      if (match && match.password === password) {
        setIsLoggedIn(true)
        setIsAdmin(match.admin)
        return { success: true, admin: match.admin }
      }
      return { success: false, error: 'Email ou mot de passe incorrect.' }
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const snap = await getDoc(doc(db, 'users', cred.user.uid))
      const admin = snap.exists() ? (snap.data().isAdmin || false) : false
      return { success: true, admin }
    } catch (e) {
      const msg = {
        'auth/user-not-found':     'Aucun compte avec cet email.',
        'auth/wrong-password':     'Mot de passe incorrect.',
        'auth/invalid-email':      'Adresse email invalide.',
        'auth/too-many-requests':  'Trop de tentatives. Réessayez plus tard.',
        'auth/invalid-credential': 'Email ou mot de passe incorrect.',
      }
      return { success: false, error: msg[e.code] || 'Une erreur est survenue.' }
    }
  }

  const loginWithGoogle = async () => {
    if (!FIREBASE_ENABLED) return { success: false, error: 'Firebase non configuré.' }
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      const uid = cred.user.uid
      const snap = await getDoc(doc(db, 'users', uid))
      if (!snap.exists()) {
        const names = (cred.user.displayName || '').split(' ')
        await setDoc(doc(db, 'users', uid), {
          firstName:      names[0] || '',
          lastName:       names.slice(1).join(' ') || '',
          email:          cred.user.email,
          phone: '', dob: '', zone: 'Grande-Terre',
          categories:     [],
          points:         50,
          totalSaved:     0,
          coopsUsed:      0,
          referrals:      [],
          history:        [],
          activeSessions: [],
          loginHistory:   [],
          isAdmin:        false,
          photoURL:       cred.user.photoURL || null,
          createdAt:      new Date().toISOString(),
        })
      }
      return { success: true, admin: false }
    } catch (e) {
      return { success: false, error: 'Connexion Google annulée.' }
    }
  }

  const registerUser = async (extraData = {}) => {
    const { email, password, firstName, lastName, referralCodeInput } = pendingReg
    const enteredCode = (referralCodeInput || '').trim().toUpperCase()

    if (!FIREBASE_ENABLED) {
      const demoPoints = enteredCode ? 100 : 50
      setIsLoggedIn(true)
      setIsAdmin(false)
      setUser({
        firstName, lastName, email,
        phone:          extraData.phone || '',
        dob:            extraData.dob || '',
        zone:           'Grande-Terre',
        categories:     new Set(),
        points:         demoPoints,
        totalSaved:     0,
        coopsUsed:      0,
        referralCode:   generateReferralCode(firstName, 'DEMO01'),
        referrals:      [],
        referredBy:     enteredCode || null,
        history:        [],
        activeSessions: [],
        loginHistory:   [],
        photo:          false,
      })
      setPendingReg({ email: '', password: '', firstName: '', lastName: '', referralCodeInput: '' })
      return { success: true, referrerFound: !!enteredCode }
    }

    try {
      let referrerDoc = null
      if (enteredCode) {
        const q = query(collection(db, 'users'), where('referralCode', '==', enteredCode))
        const snap = await getDocs(q)
        if (!snap.empty) referrerDoc = snap.docs[0]
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const uid = cred.user.uid
      const referralCode = generateReferralCode(firstName, uid)
      const points = referrerDoc ? 100 : 50

      await setDoc(doc(db, 'users', uid), {
        firstName, lastName, email,
        phone:          extraData.phone || '',
        dob:            extraData.dob || '',
        zone:           'Grande-Terre',
        categories:     [],
        points,
        totalSaved:     0,
        coopsUsed:      0,
        referralCode,
        referrals:      [],
        referredBy:     referrerDoc ? referrerDoc.id : null,
        history:        [],
        activeSessions: [],
        loginHistory:   [],
        isAdmin:        false,
        photoURL:       null,
        createdAt:      new Date().toISOString(),
      })

      if (referrerDoc) {
        await updateDoc(doc(db, 'users', referrerDoc.id), {
          referrals: arrayUnion(uid),
          points:    increment(50),
        })
      }

      setPendingReg({ email: '', password: '', firstName: '', lastName: '', referralCodeInput: '' })
      return { success: true, referrerFound: !!referrerDoc }
    } catch (e) {
      const msg = {
        'auth/email-already-in-use': 'Cet email est déjà utilisé.',
        'auth/weak-password':        'Mot de passe trop faible (6 caractères minimum).',
        'auth/invalid-email':        'Adresse email invalide.',
      }
      return { success: false, error: msg[e.code] || 'Erreur lors de la création du compte.' }
    }
  }

  const logout = async () => {
    if (FIREBASE_ENABLED) {
      try { await signOut(auth) } catch (e) { console.error(e) }
    }
    setIsLoggedIn(false)
    setIsAdmin(false)
    setUser(DEFAULT_USER)
    setUserCoops([])
  }

  // ── Admin mutations ─────────────────────────────────────────────────────
  const addAdminOffer = (offer) => {
    setAdminOffers(prev => [{
      id: Date.now(),
      emoji: '✨',
      title: offer.title,
      status: 'Actif',
      statusColor: '#16A34A',
      statusBg: '#DCFCE7',
      reduction: offer.reductionType === 'Pourcentage' ? `-${offer.value}%`
        : offer.reductionType === 'Montant fixe' ? `-${offer.value}€`
        : offer.value || 'Spéciale',
      used: 0,
      remaining: parseInt(offer.maxTotal) || 100,
      expiry: offer.endDate || 'Non définie',
    }, ...prev])

    // FIX 1: Also write to Firestore so offer appears on user-facing screens
    if (FIREBASE_ENABLED && firebaseUser) {
      const discountNum = parseInt(offer.value) || 0
      const catName = (offer.category || '').replace(/^[^\s]+\s+/, '').trim()
      addDoc(collection(db, 'offers'), {
        commerceName:    adminCommerce.name,
        title:           offer.title,
        description:     offer.title,
        category:        catName,
        status:          'actif',
        discount:        discountNum,
        discountType:    offer.reductionType === 'Pourcentage' ? 'pourcentage' : 'montant',
        dateFin:         offer.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        zone:            adminCommerce.zone,
        ville:           adminCommerce.zone,
        commerceId:      firebaseUser.uid,
        promoCode:       `COOPS-${adminCommerce.name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}${discountNum}`,
        utilisationsMax: parseInt(offer.maxTotal) || null,
        isNew:           true,
        isFeatured:      false,
        points:          30,
        rating:          5.0,
        reviews:         0,
        conditions:      [],
        createdAt:       serverTimestamp(),
        updatedAt:       serverTimestamp(),
      }).catch(e => console.error('[Coopers] addAdminOffer Firestore error:', e))
    }
  }

  const suspendAdminOffer = (id) => {
    setAdminOffers(prev => prev.map(o => o.id === id
      ? o.status === 'Suspendu'
        ? { ...o, status: 'Actif',    statusColor: '#16A34A', statusBg: '#DCFCE7' }
        : { ...o, status: 'Suspendu', statusColor: '#D97706', statusBg: '#FEF3C7' }
      : o
    ))
  }

  const deleteAdminOffer = (id) => {
    setAdminOffers(prev => prev.filter(o => o.id !== id))
  }

  const editAdminOffer = (id, updates) => {
    setAdminOffers(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o))
  }

  const markAdminNotifRead = (id) => {
    setAdminNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAdminNotifsRead = () => {
    setAdminNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const submitReview = (rating, comment) => {
    const commerce = currentOffer?.commerce
    if (!commerce || !rating) return
    const review = {
      id: Date.now(),
      name: user.firstName || 'Vous',
      rating,
      comment: comment || '',
      date: "à l'instant",
    }
    setUserReviews(prev => ({
      ...prev,
      [commerce]: [review, ...(prev[commerce] || [])],
    }))
  }

  const toggleFavorite = (offerId) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(offerId) ? next.delete(offerId) : next.add(offerId)
      if (FIREBASE_ENABLED && firebaseUser) {
        updateDoc(doc(db, 'users', firebaseUser.uid), { favorites: [...next] }).catch(console.error)
      }
      return next
    })
  }

  const resetFilters = () => setActiveFilters(DEFAULT_FILTERS)

  // Single source of truth: Firebase = Firestore liveOffers; demo = static + admin local offers
  const offers = FIREBASE_ENABLED ? liveOffers : [...OFFERS, ...adminPublishedOffers]

  const adminPublishedOffers = adminOffers
    .filter(o => o.status === 'Actif')
    .map(o => {
      const discountNum = parseInt((o.reduction || '').replace(/[^0-9]/g, '')) || 0
      const commerceShort = adminCommerce.name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()
      const catClean = adminCommerce.category.replace(/^[^\s]+\s+/, '').trim()
      return {
        id: `admin-${o.id}`,
        commerce: adminCommerce.name,
        category: catClean,
        catId: 'restaurants',
        catEmoji: adminCommerce.category.split(' ')[0] || '🏪',
        title: o.title,
        desc: o.title,
        discount: discountNum,
        location: adminCommerce.zone,
        zone: adminCommerce.zone,
        dist: 5.0,
        imageUrl: null,
        gradient: 'linear-gradient(140deg,#93C5FD,#3B82F6)',
        emoji: o.emoji || '🎫',
        conditions: [],
        code: `COOPS-${commerceShort}${discountNum}`,
        expiry: o.expiry,
        isNew: true,
        rating: 4.5,
        reviews: 0,
        points: 30,
        fromAdmin: true,
      }
    })

  return (
    <AppContext.Provider value={{
      authLoading,
      firebaseUser,
      loginWithEmail,
      loginWithGoogle,
      registerUser,
      pendingReg, setPendingReg,
      logout,
      user, updateUser, addPoints, deductPoints,
      adminCommerce, setAdminCommerce,
      adminOffers, addAdminOffer, suspendAdminOffer, deleteAdminOffer, editAdminOffer,
      offers,
      adminPublishedOffers,
      currentEditOffer, setCurrentEditOffer,
      adminStats, adminNotifications, markAdminNotifRead, markAllAdminNotifsRead,
      userCoops, activateCoops, tryAddCoops, removeUserCoop,
      isLoggedIn, setIsLoggedIn,
      isAdmin,    setIsAdmin,
      currentOffer, setCurrentOffer,
      currentCategory, setCurrentCategory,
      activeFilters, setActiveFilters, resetFilters,
      offerListConfig, setOfferListConfig,
      favorites, toggleFavorite,
      offerCounters,
      userReviews, submitReview,
      completedChallenges, checkChallenges, lastChallengeCompleted, clearLastChallenge,
      pendingValidation, setPendingValidation,
      adminScanCoop, adminValidateCoop,
      CHALLENGE_DEFS,
    }}>
      {children}
    </AppContext.Provider>
  )
}
