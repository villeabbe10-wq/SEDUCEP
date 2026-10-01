import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CommunityEvent } from '../types';
import { Calendar, MapPin, ArrowRight, ArrowLeft, ChevronLeft, Sparkles, Bell, CheckCircle2, Clock, CalendarDays, X, MessageCircle, Share2, Eye, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BentoCard from '../components/ui/BentoCard';
import ShimmerBadge from '../components/ui/ShimmerBadge';

const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: '1',
    title: 'Grande Campagne de Vaccination',
    description: 'Campagne nationale de vaccination contre les maladies infantiles dans les zones rurales d\'Atakpamé.',
    date: new Date('2026-10-15'),
    location: 'Atakpamé, Togo',
    type: 'campaign'
  },
  {
    id: '2',
    title: 'Consultations Mobiles Gratuites',
    description: 'Une équipe de médecins bénévoles offrira des consultations générales aux habitants des quartiers périphériques.',
    date: new Date('2026-11-20'),
    location: 'Lomé, Togo',
    type: 'mission'
  },
  {
    id: '3',
    title: 'Dépistage ophtalmologique et sensibilisation',
    description: 'Séance de dépistage ophtalmologique et de sensibilisation à la santé visuelle auprès des élèves et du personnel de l\'école privée laïque MAGNIFICAT.',
    date: new Date('2024-09-15'),
    location: 'Dagué, Togo (École privée laïque MAGNIFICAT)',
    type: 'mission'
  },
  {
    id: '4',
    title: 'Tournoi « Présentation SEDUCEP »',
    description: 'Tournoi sportif et événement communautaire de présentation officielle des activités, de l\'équipe et de la vision de SEDUCEP.',
    date: new Date('2024-11-10'),
    location: 'Lomé, Togo',
    type: 'general'
  },
  {
    id: '5',
    title: 'Sensibilisation de masse & Bilan pré-nuptial',
    description: 'Campagne de sensibilisation de masse axée sur l\'importance du bilan pré-nuptial et la prévention des maladies héréditaires et transmissibles.',
    date: new Date('2020-06-15'),
    location: 'Agoè, Togo',
    type: 'campaign'
  }
];

const parseEventDate = (dateVal: any) => {
  if (!dateVal) return { day: '15', month: 'SEPT', year: '2024', fullDate: null };
  
  if (typeof dateVal === 'object' && dateVal.toDate && typeof dateVal.toDate === 'function') {
    const d = dateVal.toDate();
    return {
      day: d.getDate().toString(),
      month: d.toLocaleString('fr-FR', { month: 'short' }).toUpperCase(),
      year: d.getFullYear().toString(),
      fullDate: d
    };
  }

  if (typeof dateVal === 'object' && dateVal.seconds) {
    const d = new Date(dateVal.seconds * 1000);
    return {
      day: d.getDate().toString(),
      month: d.toLocaleString('fr-FR', { month: 'short' }).toUpperCase(),
      year: d.getFullYear().toString(),
      fullDate: d
    };
  }

  const d = new Date(dateVal);
  if (!isNaN(d.getTime())) {
    return {
      day: d.getDate().toString(),
      month: d.toLocaleString('fr-FR', { month: 'short' }).toUpperCase(),
      year: d.getFullYear().toString(),
      fullDate: d
    };
  }

  return { day: '15', month: 'MAI', year: '2025', fullDate: null };
};

export default function Events({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityEvent));
        
        if (fetched.length > 0) {
          const existingTitles = new Set(fetched.map(f => f.title.toLowerCase()));
          const extraMocks = MOCK_EVENTS.filter(m => !existingTitles.has(m.title.toLowerCase()));
          const combined = [...fetched, ...extraMocks];
          combined.sort((a, b) => {
            const dA = parseEventDate(a.date).fullDate?.getTime() || 0;
            const dB = parseEventDate(b.date).fullDate?.getTime() || 0;
            return dB - dA;
          });
          setEvents(combined);
        } else {
          setEvents(MOCK_EVENTS);
        }
      } catch (error) {
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const now = new Date();

  const filteredEvents = events.filter(event => {
    const parsed = parseEventDate(event.date);
    const isPast = parsed.fullDate ? parsed.fullDate < now : false;
    if (filter === 'upcoming') return !isPast;
    if (filter === 'past') return isPast;
    return true;
  });

  const upcomingCount = events.filter(e => {
    const p = parseEventDate(e.date);
    return p.fullDate ? p.fullDate >= now : true;
  }).length;

  const pastCount = events.length - upcomingCount;

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 relative z-10">
      {/* HEADER BENTO CARD */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bento-card p-8 sm:p-14 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-400/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-400/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <ShimmerBadge variant="cyan" icon={<CalendarDays size={14} />}>
            Agenda & Calendrier Terrain
          </ShimmerBadge>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[0.95] font-display">
              Agenda des <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600">Actions</span>
            </h1>
            <p className="text-slate-600 font-normal text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Découvrez nos campagnes à venir et l'historique complet de nos interventions médicales et de dépistage au Togo.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">
                {upcomingCount} Événement(s) à venir
              </span>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-xs font-bold text-slate-700">
                {pastCount} Action(s) réalisée(s)
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FILTER TABS */}
      <div className="flex justify-center">
        <div className="bg-slate-100/90 backdrop-blur-xl p-1.5 rounded-2xl flex flex-wrap gap-2 border border-slate-200 shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' 
                ? 'bg-emerald-600 text-white shadow-md font-black' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Tous ({events.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              filter === 'upcoming' 
                ? 'bg-emerald-600 text-white shadow-md font-black' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Clock size={14} /> À venir ({upcomingCount})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              filter === 'past' 
                ? 'bg-emerald-600 text-white shadow-md font-black' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <CheckCircle2 size={14} /> Historique ({pastCount})
          </button>
        </div>
      </div>

      {/* EVENTS GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {filteredEvents.map((event) => {
          const parsed = parseEventDate(event.date);
          const isPast = parsed.fullDate ? parsed.fullDate < now : false;

          return (
            <BentoCard
              key={event.id}
              glowColor={isPast ? 'cyan' : 'emerald'}
              className="p-0 overflow-hidden flex flex-col sm:flex-row group cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              {/* Date Column */}
              <div className={`sm:w-44 p-6 sm:p-8 flex flex-col items-center justify-center gap-1.5 text-center border-b sm:border-b-0 sm:border-r border-slate-100 ${
                isPast 
                  ? 'bg-slate-50 text-slate-600' 
                  : 'bg-emerald-50 text-emerald-800'
              }`}>
                <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none font-display">
                  {parsed.day}
                </span>
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  {parsed.month}
                </span>
                <div className="h-px w-8 bg-current/20 my-1" />
                <span className="text-[11px] font-bold opacity-80 flex items-center gap-1.5">
                  <Bell size={12} /> {parsed.year}
                </span>
              </div>
              
              {/* Content Area */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      event.type === 'campaign' 
                        ? 'border-orange-200 text-orange-700 bg-orange-50' 
                        : 'border-cyan-200 text-cyan-700 bg-cyan-50'
                    }`}>
                      {event.type}
                    </span>
                    
                    {isPast ? (
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" /> Réalisé
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                        <Sparkles size={12} /> Inscription ouverte
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight font-display group-hover:text-emerald-700 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-slate-600 text-sm font-normal leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <MapPin size={14} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-800 border border-slate-200 hover:border-emerald-600 cursor-pointer shadow-sm group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600"
                  >
                    <span>{isPast ? 'Consulter le Compte-Rendu' : 'Détails & Participation'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </BentoCard>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500 font-bold uppercase tracking-widest text-xs border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            Aucun événement dans cette catégorie pour le moment.
          </div>
        )}
      </section>

      {/* FOOTER CTA BENTO */}
      <footer className="bento-card p-8 sm:p-14 text-center relative overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 border-emerald-200">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <ShimmerBadge variant="emerald" icon={<Sparkles size={13} />}>
            Initiatives Locales
          </ShimmerBadge>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
            Vous souhaitez organiser une action ?
          </h3>
          <p className="text-slate-600 font-normal leading-relaxed text-sm sm:text-base">
            SEDUCEP accompagne les leaders communautaires, les soignants et les bénévoles dans la mise en place d'actions de dépistage et de prévention médicale.
          </p>
          <div className="pt-2">
            <a 
              href={`https://api.whatsapp.com/send?phone=22897682466&text=${encodeURIComponent("Bonjour SEDUCEP, je souhaite proposer une nouvelle action / un événement communautaire avec votre équipe.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <span>Proposer un Événement</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </footer>

      {/* EVENT DETAILS / COMPTE-RENDU MODAL */}
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

function EventDetailsModal({
  event,
  onClose,
  setActiveTab
}: {
  event: CommunityEvent | null;
  onClose: () => void;
  setActiveTab?: (tab: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  const now = new Date();
  const parsed = event ? parseEventDate(event.date) : { day: '', month: '', year: '', fullDate: null };
  const isPast = event && parsed.fullDate ? parsed.fullDate < now : false;

  return createPortal(
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Overlay Backdrop */}
          <motion.div
            key="event-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            key="event-modal-card"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-3xl sm:rounded-[2rem] border border-slate-200 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[88vh] overflow-hidden"
          >
            {/* Sticky Header Bar with Back button and Close button */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/90 backdrop-blur-md shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-xs"
              >
                <ArrowLeft size={14} className="text-emerald-600" />
                <span>Retour à l'agenda</span>
              </button>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  event.type === 'campaign' 
                    ? 'border-orange-200 text-orange-700 bg-orange-50' 
                    : 'border-cyan-200 text-cyan-700 bg-cyan-50'
                }`}>
                  {event.type}
                </span>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 sm:p-7 space-y-5 overflow-y-auto">
              {/* Status Tag */}
              <div>
                {isPast ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                    <CheckCircle2 size={13} className="text-emerald-600" /> Action Réalisée (Historique)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <Sparkles size={13} /> Événement À Venir (Inscriptions ouvertes)
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug font-display">
                {event.title}
              </h3>

              {/* Date & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date de l'action</p>
                    <p className="text-xs font-bold text-slate-800">{parsed.day} {parsed.month} {parsed.year}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Lieu & Région</p>
                    <p className="text-xs font-bold text-slate-800 truncate" title={event.location}>
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  {isPast ? 'Compte-rendu & Contexte de l\'action' : 'Description & Objectifs'}
                </h4>
                <div className="text-slate-700 leading-relaxed text-sm font-normal bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                  {event.description}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                {isPast ? (
                  <>
                    {setActiveTab && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          setActiveTab('actions');
                          setTimeout(() => {
                            const el = document.getElementById('publications-section');
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 150);
                        }}
                        className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                      >
                        <Eye size={16} />
                        <span>Consulter les publications & rapports</span>
                      </button>
                    )}
                    <a
                      href={`https://api.whatsapp.com/send?phone=22897682466&text=${encodeURIComponent(`Bonjour SEDUCEP, je souhaite des informations sur le compte-rendu de l'événement "${event.title}".`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#25D366]/30"
                    >
                      <MessageCircle size={16} className="text-[#25D366]" fill="currentColor" />
                      <span>Poser une question via WhatsApp</span>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href={`https://api.whatsapp.com/send?phone=22897682466&text=${encodeURIComponent(`Bonjour SEDUCEP, je souhaite participer / m'inscrire à l'action : "${event.title}" (${event.location}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#25D366]/20 cursor-pointer"
                    >
                      <MessageCircle size={18} fill="currentColor" />
                      <span>S'inscrire / Participer via WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: event.title,
                            text: `${event.title} - SEDUCEP Togo`,
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard?.writeText(window.location.href);
                          alert('Lien copié dans le presse-papiers !');
                        }
                      }}
                      className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
                    >
                      <Share2 size={16} />
                      <span>Partager cet événement</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  ← Fermer et revenir à l'agenda
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

