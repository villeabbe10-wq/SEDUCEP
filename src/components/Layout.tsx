import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, Megaphone, Home, BookOpen, Calendar, Users, HandHeart, Info, LogIn, LogOut, MessageSquare, LayoutDashboard, Facebook, Instagram, Twitter, Mail, Phone, MapPin, ExternalLink, Activity, Handshake, HelpCircle, Heart, BriefcaseMedical, ShieldCheck, Lock, Compass, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PWAInstallButton } from './PWAInstallButton';
import { auth, logout, db } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import PharmacyModal from './PharmacyModal';
import PharmacyGuideModal from './PharmacyGuideModal';
import AwarenessModal from './AwarenessModal';
import AuthModal from './AuthModal';
import SpotlightBackground from './ui/SpotlightBackground';
import ShimmerBadge from './ui/ShimmerBadge';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isPharmacyModalOpen, setIsPharmacyModalOpen] = useState(false);
  const [isPharmacyGuideModalOpen, setIsPharmacyGuideModalOpen] = useState(false);
  const [pharmacyInitialSearch, setPharmacyInitialSearch] = useState('');
  const [isAwarenessModalOpen, setIsAwarenessModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'general'));
        if (docSnap.exists()) setSettings(docSnap.data());
      } catch (e) { 
        console.error("Error fetching settings:", e);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (user?.email) {
      const emailLower = user.email.trim().toLowerCase();
      const allowedEmails = ['seduceconseil@gmail.com'];
      if (allowedEmails.includes(emailLower)) {
        setIsAuthorized(true);
      } else {
        const checkAuth = async () => {
          try {
            const docRef = doc(db, 'system_admins', emailLower);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setIsAuthorized(true);
            } else {
              setIsAuthorized(false);
            }
          } catch (e) {
            console.error(e);
            setIsAuthorized(false);
          }
        };
        checkAuth();
      }
    } else {
      setIsAuthorized(false);
    }
  }, [user]);

  // Smart redirect on login for authorized personnel only
  useEffect(() => {
    if (user && isAuthorized && (activeTab === 'home' || activeTab === 'faq')) {
      setActiveTab('admin');
    }
  }, [user, isAuthorized]);

  const publicNavItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'actions', label: 'Actions', icon: Activity },
    { id: 'events', label: 'Agenda', icon: Calendar },
    { id: 'volunteer', label: 'Bénévolat', icon: Users },
    { id: 'resources', label: 'Aides', icon: HandHeart },
    { id: 'about', label: 'À Savoir', icon: Info },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'sponsorship', label: 'Parrainage', icon: Heart },
    { id: 'partners', label: 'Partenaires', icon: Handshake },
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Console Admin', icon: LayoutDashboard },
    { id: 'messages', label: 'Dashboard Membre', icon: MessageSquare },
    { id: 'blog', label: 'Gérer Blog', icon: BookOpen },
    { id: 'actions', label: 'Gérer Actions', icon: Calendar },
  ];

  const navItems = isAuthorized ? adminNavItems : [
    ...publicNavItems,
    ...(user ? [{ id: 'messages', label: 'Espace Membre', icon: MessageSquare }] : [])
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8fafc] text-slate-900 relative selection:bg-emerald-500/20 selection:text-emerald-800">
      {/* Ambient Spotlight & Grid Backdrop */}
      <SpotlightBackground />

      {/* Sleek Light Glass Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 sm:h-24 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 sm:gap-4 cursor-pointer group" 
            onClick={() => setActiveTab('home')}
          >
            <div className="h-11 sm:h-13 w-11 sm:w-13 rounded-2xl bg-slate-900 flex items-center justify-center p-1 border border-slate-800 shadow-[0_4px_16px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/50 group-hover:shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all overflow-hidden relative">
              <img 
                src={settings?.logoUrl || "/logo.svg"} 
                alt="SEDUCEP Logo" 
                className="w-full h-full object-contain rounded-xl relative z-10" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-none text-slate-900 font-display">
                  {settings?.associationName || 'SEDUCEP'}
                </h1>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
              </div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-black text-emerald-600 mt-0.5">
                Conseil • Togo
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation Menu - Light Bento Pill */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-[2rem] border border-slate-200/80 backdrop-blur-xl shadow-sm">
            {navItems.slice(0, 8).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer relative ${
                  activeTab === item.id 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-[0_4px_16px_rgba(5,150,105,0.3)]' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setIsPharmacyModalOpen(true)}
              className="px-4 py-2.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-cyan-700 hover:text-cyan-800 hover:bg-cyan-100/80 transition-all flex items-center gap-1.5 cursor-pointer border border-cyan-200/80 bg-cyan-50 shadow-sm"
              title="Pharmacies de garde"
            >
              <BriefcaseMedical size={13} className="text-cyan-600" />
              <span>Pharmacies</span>
            </button>
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
              <PWAInstallButton />
            </div>

            <button 
              onClick={() => setActiveTab('donation')}
              className="hidden xl:inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(249,115,22,0.25)] active:scale-95 cursor-pointer"
            >
              <Heart size={14} className="fill-current" />
              <span>Faire un Don</span>
            </button>

            {user && (
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.button 
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(isAuthorized ? 'admin' : 'messages')}
                  className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:bg-emerald-100"
                >
                  <img src={user.photoURL || ''} alt="" className="w-5 h-5 sm:w-6 h-6 rounded-full border-2 border-emerald-400" />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest hidden sm:block">
                    {isAuthorized ? 'Console' : 'Espace'}
                  </span>
                </motion.button>
                <motion.button 
                  whileHover={{ rotate: 15 }}
                  onClick={() => {
                    logout();
                    setActiveTab('home');
                  }}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4 sm:w-5 h-5" />
                </motion.button>
              </div>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 sm:p-3 bg-slate-100 text-slate-700 rounded-xl sm:rounded-2xl hover:bg-slate-200 transition-colors hidden sm:flex lg:hidden items-center justify-center border border-slate-200 cursor-pointer"
              aria-label="Menu de navigation"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Overlay - Light Bento Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.nav 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-2xl border-l border-slate-200 z-50 shadow-2xl p-6 flex flex-col gap-2 overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="text-xs uppercase tracking-[0.2em] font-black text-emerald-700">Navigation</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-3">
                <PWAInstallButton />
              </div>
              
              <div className="space-y-1.5 flex-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                      activeTab === item.id 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm font-black' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon size={19} className={activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-400" />
                  </button>
                ))}

                <button
                  onClick={() => {
                    setIsPharmacyGuideModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-cyan-50 text-cyan-800 font-bold border border-cyan-200 hover:bg-cyan-100 transition-all cursor-pointer mt-2"
                >
                  <div className="flex items-center gap-3.5">
                    <Compass size={19} className="text-cyan-600" />
                    <span className="text-sm">Guide Pharmacies</span>
                  </div>
                  <ChevronRight size={15} className="text-cyan-600/70" />
                </button>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
                {!user ? (
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2.5 text-xs border border-slate-200 transition-colors cursor-pointer"
                  >
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>Portail Membres & Staff</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setActiveTab(isAuthorized ? 'admin' : 'messages');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-emerald-600 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-md"
                    >
                      <img src={user.photoURL || ''} alt="" className="w-5 h-5 rounded-full border border-white" />
                      {isAuthorized ? 'Console Admin' : 'Mon Espace'}
                    </button>
                    <button 
                      onClick={() => {
                        logout();
                        setActiveTab('home');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-slate-50 text-rose-500 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs border border-rose-200 hover:bg-rose-50"
                    >
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    setActiveTab('donation');
                    setIsMenuOpen(false);
                  }}
                  className="w-full btn-accent py-4 flex items-center justify-center gap-2 text-xs"
                >
                  <HandHeart size={16} /> Faire un Don
                </button>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">© 2026 SEDUCEP-CONSEILS</p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 pb-24 sm:pb-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Grouped Floating Action Button (Speed Dial) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
        {/* Backdrop for click-outside dismissal */}
        <AnimatePresence>
          {isFabOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFabOpen(false)}
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] z-30"
            />
          )}
        </AnimatePresence>

        {/* Speed Dial Menu Items */}
        <AnimatePresence>
          {isFabOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mb-3 flex flex-col items-end gap-3 z-40"
            >
              {/* Flash Santé (Sensibilisation) Action */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsFabOpen(false);
                  setIsAwarenessModalOpen(true);
                }}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <span className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Flash Santé
                </span>
                <div className="relative w-12 h-12 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg border border-emerald-500/50 group-hover:bg-slate-800 group-hover:border-emerald-400 transition-all">
                  <Megaphone size={22} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
              </motion.button>

              {/* Member Access Action */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsFabOpen(false);
                  if (user) {
                    setActiveTab(isAuthorized ? 'admin' : 'messages');
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <span className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-md">
                  {user ? (isAuthorized ? 'Console Admin' : 'Espace Membre') : 'Espace Membre'}
                </span>
                <div className="w-12 h-12 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg border border-slate-700 group-hover:bg-slate-800 transition-colors">
                  <ShieldCheck size={22} />
                </div>
              </motion.button>

              {/* Pharmacy Action */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsFabOpen(false);
                  setIsPharmacyModalOpen(true);
                }}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <span className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-md">
                  Pharmacies de garde
                </span>
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black rounded-2xl flex items-center justify-center shadow-lg border border-cyan-300/40 group-hover:brightness-105 transition-all">
                  <BriefcaseMedical size={22} />
                </div>
              </motion.button>

              {/* WhatsApp Action */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={settings?.whatsapp || `https://api.whatsapp.com/send?phone=22897682466&text=${encodeURIComponent("Bonjour SEDUCEP-CONSEILS, j'ai une question.")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsFabOpen(false)}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <span className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-md">
                  Aide WhatsApp
                </span>
                <div className="w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#25D366]/30 group-hover:bg-[#20ba5a] transition-colors">
                  <MessageSquare size={22} fill="currentColor" />
                </div>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button (+) */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_8px_25px_rgba(5,150,105,0.35)] transition-all z-40 cursor-pointer border ${
            isFabOpen
              ? 'bg-slate-900 text-white border-slate-700 shadow-slate-900/40'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/40'
          }`}
          title={isFabOpen ? 'Fermer les raccourcis' : 'Raccourcis rapides'}
          aria-label="Actions rapides"
        >
          <motion.div
            animate={{ rotate: isFabOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus size={26} />
          </motion.div>
        </motion.button>
      </div>

      <PharmacyGuideModal 
        isOpen={isPharmacyGuideModalOpen} 
        onClose={() => setIsPharmacyGuideModalOpen(false)} 
        onOpenPharmacyModal={(searchQuery) => {
          setPharmacyInitialSearch(searchQuery || '');
          setIsPharmacyModalOpen(true);
        }}
      />

      <PharmacyModal 
        isOpen={isPharmacyModalOpen} 
        onClose={() => setIsPharmacyModalOpen(false)} 
        initialSearch={pharmacyInitialSearch}
        onOpenGuide={() => setIsPharmacyGuideModalOpen(true)}
      />

      <AwarenessModal 
        isOpen={isAwarenessModalOpen}
        onClose={() => setIsAwarenessModalOpen(false)}
        showFloatingLauncher={false}
      />

      {/* Bento Grid Footer - Dark & Luminous */}
      <footer className="bg-slate-950/80 backdrop-blur-2xl border-t border-white/[0.08] pt-16 pb-28 sm:pb-16 px-4 sm:px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-16">
          {/* About Column - Bento Panel */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center shadow-lg border border-white/15 p-1">
                <img 
                  src={settings?.logoUrl || "/logo.svg"} 
                  alt="SEDUCEP Logo" 
                  className="w-full h-full object-contain rounded-xl" 
                />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white uppercase font-display">
                  {settings?.associationName || 'SEDUCEP'}
                </h1>
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-emerald-400">
                  Conseil • Togo
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 font-normal leading-relaxed max-w-md">
              SEDUCEP Conseil est une organisation dédiée à l'accompagnement des populations vulnérables, l'éducation médicale et la lutte contre les maladies chroniques au Togo.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href={settings?.facebook || "https://www.facebook.com/share/p/14rENM7EWSB/"} 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Page Facebook SEDUCEP"
                className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-sky-500 hover:text-slate-950 border border-white/10 flex items-center justify-center text-slate-300 transition-all shadow-sm cursor-pointer"
              >
                <Facebook size={18} />
              </a>
              <a 
                href={settings?.whatsapp || "https://chat.whatsapp.com/J97IaBdATTXDlsACkgMpNS"} 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Groupe WhatsApp SEDUCEP"
                className="w-10 h-10 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 transition-all shadow-sm cursor-pointer"
              >
                <Phone size={18} />
              </a>
              <a 
                href={settings?.tiktok || "https://www.tiktok.com/@seducep"} 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Compte TikTok SEDUCEP"
                className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white hover:text-slate-950 border border-white/10 flex items-center justify-center text-slate-300 transition-all shadow-sm cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.87 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.88c.28 0 .54.04.79.12V9.3a6.34 6.34 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.6a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.28 8.28 0 0 0 4.88 1.58V7.02a4.84 4.84 0 0 1-1.12-.33z"/>
                </svg>
              </a>
              <a 
                href={settings?.instagram || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Instagram"
                className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-pink-500 hover:text-white border border-white/10 flex items-center justify-center text-slate-300 transition-all shadow-sm cursor-pointer"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-white mb-6 font-display">Navigation</h4>
            <ul className="space-y-3">
              {navItems.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => setActiveTab(item.id)}
                    className="text-sm text-slate-400 hover:text-emerald-400 font-medium transition-colors flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-2">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-white mb-6 font-display">Soutien</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setIsPharmacyModalOpen(true)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <BriefcaseMedical size={14} />
                  <span>Pharmacies de Garde</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsPharmacyGuideModalOpen(true)}
                  className="text-sm text-slate-400 hover:text-cyan-400 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass size={14} className="text-cyan-400" />
                  <span>Guide Interactif</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('donation')}
                  className="text-sm text-slate-400 hover:text-orange-400 font-medium transition-colors cursor-pointer"
                >
                  Faire un Don
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('volunteer')}
                  className="text-sm text-slate-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
                >
                  Devenir Bénévole
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('resources')}
                  className="text-sm text-slate-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
                >
                  Nos Rapports
                </button>
              </li>
              <li className="pt-2 border-t border-white/10">
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-xs text-slate-500 hover:text-emerald-400 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 group"
                >
                  <Lock size={12} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  <span>Portail Staff & Membres</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-white mb-6 font-display">Contact Direct</h4>
            <div className="space-y-3.5 text-sm text-slate-400">
              <div className="flex gap-3">
                <div className="mt-0.5 text-emerald-400 shrink-0"><MapPin size={16} /></div>
                <p className="font-medium leading-snug">Lomé, Quartier Adidogomé-Avenou, Togo</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 text-emerald-400 shrink-0"><Phone size={16} /></div>
                <p className="font-medium">+228 97682466 / +32 465796529</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 text-emerald-400 shrink-0"><Mail size={16} /></div>
                <p className="font-medium break-all">seduceconseils@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Banner - Luminous Strip */}
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4">
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 opacity-70">
              <div className="font-bold text-xs tracking-tight text-slate-300 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[8px] text-emerald-300 font-black">TG</div>
                MINISTÈRE DE LA SANTÉ
              </div>
              <div className="font-bold text-xs tracking-tight text-slate-300 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[8px] text-blue-300 font-black">OMS</div>
                OMS TOGO
              </div>
              <div className="font-bold text-xs tracking-tight text-slate-300 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[8px] text-cyan-300 font-black">UC</div>
                UNICEF
              </div>
            </div>
            
            <div className="flex flex-col items-center sm:items-end gap-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                © 2026 SEDUCEP-CONSEILS • Tous droits réservés
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                <span>RÉPUBLIQUE TOGOLAISE</span>
                <div className="relative w-5 h-3 flex flex-col overflow-hidden rounded-[2px] border-[0.5px] border-white/20">
                  <div className="flex-1 bg-[#006a4e]" />
                  <div className="flex-1 bg-[#ffce00]" />
                  <div className="flex-1 bg-[#006a4e]" />
                  <div className="flex-1 bg-[#ffce00]" />
                  <div className="flex-1 bg-[#006a4e]" />
                  <div className="absolute top-0 left-0 w-[40%] h-[60%] bg-[#d21034] flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full scale-[0.6]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Dock */}
      <motion.nav 
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-200/80 flex items-center justify-around px-2 py-3 z-30 sm:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
      >
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === item.id ? 'text-emerald-600 scale-105 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center gap-1 transition-all text-slate-500 hover:text-slate-900`}
        >
          <Menu size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Plus</span>
        </button>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

