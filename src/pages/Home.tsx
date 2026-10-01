import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Activity, 
  Calendar as CalendarIcon, 
  MapPin, 
  Globe, 
  Sparkles, 
  ChevronRight, 
  HeartPulse, 
  GraduationCap, 
  Droplets, 
  Baby, 
  Stethoscope, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import BentoCard from '../components/ui/BentoCard';
import ShimmerBadge from '../components/ui/ShimmerBadge';

export default function Home({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [latestEvents, setLatestEvents] = useState<any[]>([]);
  const [impactStats, setImpactStats] = useState({
    vies: '1.2k',
    campagnes: '42',
    beneficiaires: '15k',
    benevoles: '380'
  });

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      orderBy('date', 'asc'),
      limit(2)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLatestEvents(events);
    }, (error) => {
      console.error("Error listening to events:", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'general'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setImpactStats({
          vies: data.impact_vies || '1.2k',
          campagnes: data.impact_campagnes || '42',
          beneficiaires: data.impact_beneficiaires || '15k',
          benevoles: data.impact_benevoles || '380'
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } as any }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 sm:space-y-20 pb-20 relative z-10"
    >
      {/* Hero Bento Section - Bento Grid Light Mode */}
      <motion.section 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-b from-white/95 via-white/90 to-slate-50/90 border border-slate-200/80 backdrop-blur-2xl p-6 sm:p-12 lg:p-16 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
      >
        {/* Ambient Top Highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-emerald-400/15 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-cyan-400/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-8">
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 sm:gap-4">
              <ShimmerBadge variant="emerald" icon={<ShieldCheck size={13} />}>
                Mouvement Solidaire Togo
              </ShimmerBadge>

              <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200 px-3 py-1.5 rounded-full backdrop-blur-md">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 rounded-full border border-white bg-slate-200 overflow-hidden shadow-sm"
                    >
                      <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full border border-white bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-[7px] text-white font-black shadow-sm">
                    +1K
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                  Membres & Volontaires
                </span>
              </div>
            </motion.div>
            
            <div className="space-y-3">
              <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.95] tracking-tight font-display">
                Sensibiliser <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                  Éduquer
                </span> <br />
                <span className="text-slate-500">Protéger</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal max-w-xl">
                L'excellence du conseil médical couplée à l'engagement social pour les populations vulnérables du Togo.
              </motion.p>
            </div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
              <button 
                onClick={() => setActiveTab('volunteer')}
                className="btn-primary"
              >
                <span>Nous Rejoindre</span>
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => setActiveTab('donation')}
                className="btn-accent"
              >
                <Heart size={16} className="fill-current" />
                <span>Soutenir l'Action</span>
              </button>
            </motion.div>
          </div>

          {/* Right Image Card Showcase - Bento Preview */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-400/20 via-cyan-400/20 to-transparent rounded-[3.5rem] blur-2xl opacity-80" />
              
              {/* Main Bento Image Container */}
              <div className="relative bg-white/95 p-3.5 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl border border-slate-200/80 backdrop-blur-xl">
                <div className="overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] group">
                  <img 
                    src="/images/publications/hygiene.jpg"
                    onError={(e: any) => {
                      e.target.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800";
                    }}
                    referrerPolicy="no-referrer"
                    alt="Action de santé sur le terrain par SEDUCEP Togo" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 contrast-105"
                  />
                  
                  {/* Subtle Top & Bottom Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  
                  {/* Bottom Floating Info Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-lg flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        Action Terrain Togo
                      </span>
                      <p className="text-xs font-bold text-slate-900">Missions & Dépistages Gratuits</p>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans">
                      SEDUCEP
                    </span>
                  </div>
                </div>
              </div>

              {/* Top-Right Floating Pill */}
              <div className="absolute -top-3 -right-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-2xl shadow-[0_6px_20px_rgba(16,185,129,0.35)] flex items-center gap-2 border border-emerald-400 font-black">
                <ShieldCheck size={16} />
                <span className="text-[9px] uppercase tracking-widest leading-none">
                  Santé & Prévention
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Dashboard - Bento Metric Grid */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight font-display">
              Notre Impact Social
            </h3>
            <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">
              Indicateurs de performance sur le terrain
            </p>
          </div>
          <div className="hidden sm:block h-[1px] flex-1 bg-slate-200 mx-8" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
            <span className="text-xs font-mono text-slate-500">Temps réel</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Vies Impactées', value: impactStats.vies, progress: 75, color: '#059669', symbol: <Activity size={16} />, glow: 'emerald' as const },
            { label: 'Campagnes Terrain', value: impactStats.campagnes, progress: 90, color: '#ea580c', symbol: <Globe size={16} />, glow: 'orange' as const },
            { label: 'Bénéficiaires Directs', value: impactStats.beneficiaires, progress: 60, color: '#0891b2', symbol: <Users size={16} />, glow: 'cyan' as const },
            { label: 'Bénévoles Actifs', value: impactStats.benevoles, progress: 85, color: '#6366f1', symbol: <Heart size={16} />, glow: 'indigo' as const },
          ].map((item, i) => (
            <BentoCard 
              key={i}
              glowColor={item.glow}
              className="p-7"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                  <span style={{ color: item.color }}>{item.symbol}</span>
                  {item.label}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">0{i+1}</span>
              </div>
              <p className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-5 font-display">
                {item.value}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <span>Taux de Réalisation</span>
                  <span className="text-slate-900 font-mono font-bold">{item.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.progress}%` }}
                    transition={{ duration: 1.2, delay: 0.2 + (i * 0.1), ease: [0.23, 1, 0.32, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            </BentoCard>
          ))}
        </div>
      </section>

      {/* Association Discovery - Bento Split */}
      <motion.section 
        variants={itemVariants}
        className="bento-card p-8 sm:p-14 lg:p-16 relative overflow-hidden"
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <ShimmerBadge variant="emerald" icon={<Sparkles size={13} />}>
                Découvrez SEDUCEP
              </ShimmerBadge>
              <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.05] font-display">
                La sensibilisation médicale <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  dans les zones les plus isolées.
                </span>
              </h3>
            </div>
            
            <div className="space-y-5">
              <p className="text-slate-800 text-lg sm:text-xl font-medium leading-relaxed italic border-l-2 border-emerald-500 pl-5 py-1">
                "Le soutien aux orphelins et malades isolés. Le parrainage scolaire. Les programmes de santé, et bien plus encore."
              </p>
              <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                Dans un monde où l’information peut sauver, protéger et éduquer, chaque clic compte. Notre plateforme est plus qu'une vitrine : c’est un pont direct entre ceux qui veulent aider et ceux qui en ont besoin au Togo.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => setActiveTab('about')}
                className="btn-primary"
              >
                Notre Vision
              </button>
              <button 
                onClick={() => setActiveTab('donation')}
                className="btn-secondary"
              >
                Impact 2026
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl relative">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" 
                referrerPolicy="no-referrer"
                alt="Tournoi Seducep" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 bg-white/95 backdrop-blur-2xl text-slate-900 p-6 sm:p-8 rounded-[2rem] shadow-xl border border-slate-200/80 max-w-[260px] sm:max-w-[280px]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
                <ShieldCheck size={24} />
              </div>
              <p className="font-black text-base leading-tight text-slate-900 mb-1.5">Pacte de Solidarité</p>
              <p className="text-[11px] font-normal text-slate-600 leading-relaxed">
                Intervention directe et transparente sur le terrain. 100% de vos dons vont directement aux actions sociales.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Highlights Bento Card - High Energy Warm Amber Light Mode */}
      <motion.section 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-br from-orange-50 via-white to-amber-50/80 border border-orange-200 p-8 sm:p-14 lg:p-16 shadow-[0_10px_30px_rgba(249,115,22,0.08)]"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <ShimmerBadge variant="orange" icon={<Heart size={13} />}>
              Focus Populations Vulnérables
            </ShimmerBadge>
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 leading-[1.0] tracking-tight font-display">
              Aidez-nous à protéger <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                ceux qui n'ont rien.
              </span>
            </h3>
            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
              Nous intervenons spécifiquement auprès des orphelins, des veuves isolées et des malades chroniques sans couverture médicale au Togo.
            </p>
            <div>
              <button 
                onClick={() => setActiveTab('donation')}
                className="btn-accent"
              >
                <Heart size={16} className="fill-current" />
                <span>Soutenir l'Action Directe</span>
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl aspect-[4/3] bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" 
                referrerPolicy="no-referrer"
                alt="Jeunesse et Sport" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Impact Stories - Bento Cards */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <ShimmerBadge variant="cyan" icon={<Users size={13} />}>
            Voix du Terrain
          </ShimmerBadge>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
            Témoignages & Reconnaissance
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Découvrez l'impact de vos actions à travers les récits authentiques de ceux que nous accompagnons au quotidien.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              text: "Grâce à SEDUCEP, ma maladie chronique est mieux suivie et j'ai reçu les kits et bilans nécessaires.",
              author: "Koffi M.",
              role: "Bénéficiaire Lomé",
              photo: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=200",
              glow: "emerald" as const,
              dot: "bg-emerald-500"
            },
            {
              text: "Leur engagement sur le terrain est exemplaire. Les populations isolées ont enfin un accès équitable au conseil.",
              author: "Amenvi P.",
              role: "Volontaire Médical",
              photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200",
              glow: "cyan" as const,
              dot: "bg-cyan-500"
            },
            {
              text: "Un parrainage qui a changé la vie de mes enfants. Merci du fond du cœur pour tout ce que vous faites.",
              author: "Sika G.",
              role: "Veuve Accompagnée",
              photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
              glow: "orange" as const,
              dot: "bg-orange-500"
            }
          ].map((story, i) => (
            <BentoCard 
              key={i}
              glowColor={story.glow}
              className="p-8 flex flex-col justify-between"
            >
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500 text-xs gap-1">
                    {'★'.repeat(5)}
                  </div>
                  <Heart size={16} className="text-slate-400" />
                </div>
                <p className="text-slate-700 italic text-sm sm:text-base leading-relaxed">
                  "{story.text}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={story.photo} alt={story.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm tracking-tight">{story.author}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${story.dot}`} />
                    {story.role}
                  </p>
                </div>
              </div>
            </BentoCard>
          ))}
        </div>
      </section>

      {/* Prevention Focus Bento Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        <BentoCard glowColor="emerald" className="p-8 sm:p-10">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
            <ShieldCheck size={28} />
          </div>
          <h3 className="font-black text-2xl text-slate-900 mb-3 tracking-tight font-display">Prévention Malaria</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            Le paludisme reste l'une des premières causes de mortalité infantile au Togo. Nos guides communautaires vous apportent les clés de la prévention.
          </p>
          <button 
            onClick={() => setActiveTab('actions')}
            className="glass-pill text-xs font-bold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
          >
            <span>Lire le guide complet</span>
            <ArrowRight size={14} />
          </button>
        </BentoCard>
        
        <BentoCard glowColor="orange" className="p-8 sm:p-10">
          <div className="w-14 h-14 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
            <Heart size={28} />
          </div>
          <h3 className="font-black text-2xl text-slate-900 mb-3 tracking-tight font-display">Santé Maternelle</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            Accompagner les futures mères dans l'accès aux soins prénataux, bilans de santé et conseils nutritionnels essentiels.
          </p>
          <button 
            onClick={() => setActiveTab('resources')}
            className="glass-pill text-xs font-bold text-orange-700 hover:bg-orange-50 cursor-pointer"
          >
            <span>Nos ressources dédiées</span>
            <ArrowRight size={14} />
          </button>
        </BentoCard>
      </section>

      {/* Agenda & Aid Grid - Bento Dashboard */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bento-card p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <h3 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight font-display">
                Focus Missions 2026
              </h3>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                Calendrier des interventions sur le terrain
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('events')}
              className="glass-pill text-xs hover:bg-slate-100 cursor-pointer"
            >
              <span>Explorer l'agenda</span>
              <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {latestEvents.length > 0 ? latestEvents.map((ev) => (
              <div 
                key={ev.id} 
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-500/50 hover:bg-white transition-all group cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => setActiveTab('events')}
              >
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center py-2.5 px-4 rounded-xl font-black shadow-sm shrink-0">
                  <span className="block text-xl font-black leading-none mb-0.5">
                    {ev.date?.toDate ? ev.date.toDate().getDate() : '12'}
                  </span>
                  <span className="block text-[8px] uppercase font-black tracking-widest opacity-90">
                    {ev.date?.toDate ? ev.date.toDate().toLocaleString('fr-FR', { month: 'short' }).toUpperCase() : 'SEP'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                    {ev.title}
                  </p>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                    <MapPin size={12} className="text-emerald-600" />
                    <span>{ev.location || 'Togo'}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-slate-400 text-xs font-mono py-10 text-center border border-dashed border-slate-200 rounded-2xl">
                Mises à jour du calendrier en cours...
              </div>
            )}
          </div>
        </div>

        {/* Specific Aid Bento Card */}
        <div className="lg:col-span-4 bento-card p-8 sm:p-10 flex flex-col justify-between border-emerald-500/30">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Programmes Actifs</span>
              <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-tight font-display">
                Aides <br /> Spécifiques
              </h3>
            </div>
            
            <ul className="space-y-3">
              {[
                "Kits Scolaires Orphelins",
                "Consultations Itinérantes",
                "Distribution Moustiquaires",
                "Sensibilisation Drépanocytose"
              ].map((aid, idx) => (
                <li 
                  key={idx}
                  className="flex items-center gap-3 text-xs font-semibold text-slate-800 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 hover:border-emerald-400 transition-colors"
                >
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{aid}</span>
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => setActiveTab('resources')}
            className="w-full mt-8 btn-primary text-xs"
          >
            Consulter nos guides
          </button>
        </div>
      </section>
    </motion.div>
  );
}

