import { useState, useCallback, useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import Splash from './screens/Splash.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Login from './screens/Login.jsx'
import Register1 from './screens/Register1.jsx'
import Register2 from './screens/Register2.jsx'
import Zone from './screens/Zone.jsx'
import Interests from './screens/Interests.jsx'
import Confirm from './screens/Confirm.jsx'
import Forgot from './screens/Forgot.jsx'
import EmailSent from './screens/EmailSent.jsx'
import Explore from './screens/Explore.jsx'
import Filters from './screens/Filters.jsx'
import Category from './screens/Category.jsx'
import Commerce from './screens/Commerce.jsx'
import EmptyState from './screens/EmptyState.jsx'
import Home from './screens/Home.jsx'
import Merchant from './screens/Merchant.jsx'
import Offer from './screens/Offer.jsx'
import QRTicket from './screens/QRTicket.jsx'
import CoopUsed from './screens/CoopUsed.jsx'
import MyCoops from './screens/MyCoops.jsx'
import QRFullscreen from './screens/QRFullscreen.jsx'
import History from './screens/History.jsx'
import Savings from './screens/Savings.jsx'
import Review from './screens/Review.jsx'
import Notifications from './screens/Notifications.jsx'
import FullLoyalty from './screens/FullLoyalty.jsx'
import Challenges from './screens/Challenges.jsx'
import Leaderboard from './screens/Leaderboard.jsx'
import Referral from './screens/Referral.jsx'
import LevelUp from './screens/LevelUp.jsx'
import Loyalty from './screens/Loyalty.jsx'
import Profile from './screens/Profile.jsx'
import FullProfile from './screens/FullProfile.jsx'
import EditProfile from './screens/EditProfile.jsx'
import EditCategories from './screens/EditCategories.jsx'
import NotifSettings from './screens/NotifSettings.jsx'
import Settings from './screens/Settings.jsx'
import Security from './screens/Security.jsx'
import FAQ from './screens/FAQ.jsx'
import Suggest from './screens/Suggest.jsx'
import AdminDashboard from './screens/AdminDashboard.jsx'
import AdminCoops from './screens/AdminCoops.jsx'
import CreateOffer from './screens/CreateOffer.jsx'
import AdminScanner from './screens/AdminScanner.jsx'
import AdminHistory from './screens/AdminHistory.jsx'
import AdminStats from './screens/AdminStats.jsx'
import AdminCommerce from './screens/AdminCommerce.jsx'
import PartnerRequest from './screens/PartnerRequest.jsx'
import OfferList from './screens/OfferList.jsx'
import CommercePage from './screens/CommercePage.jsx'
import CGU from './screens/CGU.jsx'
import PrivacyPolicy from './screens/PrivacyPolicy.jsx'
import AdminReviews from './screens/AdminReviews.jsx'
import AdminNotifications from './screens/AdminNotifications.jsx'
import EditOffer from './screens/EditOffer.jsx'

const W = 390
const H = 844

// Watches Firebase auth state and redirects when a session is already active
function AuthGate({ resetTo }) {
  const { authLoading, isLoggedIn, isAdmin } = useApp()
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      resetTo(isAdmin ? 'admindashboard' : 'home')
    }
  }, [authLoading, isLoggedIn, isAdmin, resetTo])
  return null
}

export default function App() {
  const [stack, setStack] = useState([{ id: 'splash', key: 0 }])
  const [navDir, setNavDir] = useState('instant')

  const navigate = useCallback((screenId) => {
    setNavDir('forward')
    setStack(prev => [...prev, { id: screenId, key: prev.length }])
  }, [])

  const goBack = useCallback(() => {
    setNavDir('back')
    setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev)
  }, [])

  const resetTo = useCallback((screenId) => {
    setNavDir('instant')
    setStack([{ id: screenId, key: Date.now() }])
  }, [])

  const handleTab = useCallback((tabId) => {
    const tabMap = {
      home:    'home',
      explore: 'explore',
      coops:   'mycoops',
      loyalty: 'fullloyalty',
      profile: 'fullprofile',
    }
    resetTo(tabMap[tabId] || 'home')
  }, [resetTo])

  const handleAdminTab = useCallback((tabId) => {
    resetTo(tabId)
  }, [resetTo])

  const current = stack[stack.length - 1]
  const screenProps = { navigate, goBack, resetTo, handleTab, handleAdminTab }

  const screens = {
    splash:       <Splash       {...screenProps} />,
    onboarding:   <Onboarding   {...screenProps} />,
    login:        <Login        {...screenProps} />,
    register1:    <Register1    {...screenProps} />,
    register2:    <Register2    {...screenProps} />,
    zone:         <Zone         {...screenProps} />,
    interests:    <Interests    {...screenProps} />,
    confirm:      <Confirm      {...screenProps} />,
    forgot:       <Forgot       {...screenProps} />,
    emailsent:    <EmailSent    {...screenProps} />,
    explore:      <Explore      {...screenProps} />,
    filters:      <Filters      {...screenProps} />,
    category:     <Category     {...screenProps} />,
    commerce:     <Commerce     {...screenProps} />,
    emptystate:   <EmptyState   {...screenProps} />,
    home:         <Home         {...screenProps} />,
    merchant:     <Merchant     {...screenProps} />,
    offer:        <Offer        {...screenProps} />,
    qrticket:     <QRTicket     {...screenProps} />,
    coopused:     <CoopUsed     {...screenProps} />,
    mycoops:      <MyCoops      {...screenProps} />,
    qrfullscreen: <QRFullscreen {...screenProps} />,
    history:      <History      {...screenProps} />,
    savings:      <Savings      {...screenProps} />,
    review:       <Review       {...screenProps} />,
    notifications:<Notifications {...screenProps} />,
    fullloyalty:  <FullLoyalty  {...screenProps} />,
    challenges:   <Challenges   {...screenProps} />,
    leaderboard:  <Leaderboard  {...screenProps} />,
    referral:     <Referral     {...screenProps} />,
    levelup:      <LevelUp      {...screenProps} />,
    loyalty:      <Loyalty      {...screenProps} />,
    profile:      <Profile      {...screenProps} />,
    fullprofile:  <FullProfile  {...screenProps} />,
    editprofile:  <EditProfile  {...screenProps} />,
    editcats:     <EditCategories {...screenProps} />,
    notifsettings:<NotifSettings {...screenProps} />,
    settings:     <Settings     {...screenProps} />,
    security:     <Security     {...screenProps} />,
    faq:           <FAQ            {...screenProps} />,
    suggest:       <Suggest        {...screenProps} />,
    admindashboard:<AdminDashboard {...screenProps} />,
    admincoops:    <AdminCoops     {...screenProps} />,
    createoffer:   <CreateOffer    {...screenProps} />,
    adminscanner:  <AdminScanner   {...screenProps} />,
    adminhistory:  <AdminHistory   {...screenProps} />,
    adminstats:    <AdminStats     {...screenProps} />,
    admincommerce: <AdminCommerce  {...screenProps} />,
    partnerrequest:<PartnerRequest {...screenProps} />,
    offerlist:     <OfferList      {...screenProps} />,
    commercepage:  <CommercePage   {...screenProps} />,
    cgu:           <CGU            {...screenProps} />,
    privacypolicy: <PrivacyPolicy  {...screenProps} />,
    adminreviews:  <AdminReviews        {...screenProps} />,
    adminnotifications: <AdminNotifications {...screenProps} />,
    editoffer:     <EditOffer           {...screenProps} />,
  }

  const animClass = navDir === 'forward' ? 'screen-forward' : navDir === 'back' ? 'screen-back' : 'screen-instant'

  return (
    <AppProvider>
    <AuthGate resetTo={resetTo} />
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0eee9',
      padding: '20px 0',
    }}>
      <div style={{
        width: W, height: H,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 40px 80px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.08)',
        background: '#F7F4EE',
        flexShrink: 0,
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 37, borderRadius: 24, background: '#000',
          zIndex: 100, pointerEvents: 'none',
        }} />

        {/* Active screen */}
        <div key={current.key} className={animClass} style={{ position: 'absolute', inset: 0 }}>
          {screens[current.id] ?? screens.home}
        </div>
      </div>
    </div>
    </AppProvider>
  )
}
