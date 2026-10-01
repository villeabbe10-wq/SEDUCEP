import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Baby, 
  HeartHandshake, 
  Droplets,
  ArrowRight,
  Stethoscope,
  Globe,
  GraduationCap,
  HeartPulse,
  Sparkles,
  Gift,
  Play,
  Heart,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Blog from './Blog';
import BentoCard from '../components/ui/BentoCard';
import ShimmerBadge from '../components/ui/ShimmerBadge';

export default function Actions({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [missionsFromDb, setMissionsFromDb] = useState<any[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const q = query(
          collection(db, 'events'), 
          where('type', '==', 'mission')
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        docs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setMissionsFromDb(docs);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMissions();
  }, []);

  const missions = [
    {
      title: "Sensibiliser sur les maladies mortelles",
      desc: "Lutter contre la drépanocytose, les cancers et maladies tropicales négligées par l'information et le conseil.",
      icon: Stethoscope,
      glow: 'emerald' as const,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      points: [
        "Mettre en lumière les maladies oubliées ou taboues",
        "Lutter contre la stigmatisation des malades",
        "Connaissances accessibles en langage simple et adapté"
      ]
    },
    {
      title: "Éduquer pour prévenir",
      desc: "La connaissance est un outil de santé publique primordial. Beaucoup de pathologies graves peuvent être évitées.",
      icon: GraduationCap,
      glow: 'indigo' as const,
      color: "text-indigo-700 bg-indigo-50 border-indigo-200",
      points: [
        "Ateliers pédagogiques pour jeunes et femmes",
        "Vidéos, brochures et repères en langues locales",
        "Interventions scolaires et communautaires ciblées"
      ]
    },
    {
      title: "Programmes de santé durables",
      desc: "Collaborer avec les soignants et ONG pour bâtir des dispositifs de prévention fiables et pérennes.",
      icon: Globe,
      glow: 'cyan' as const,
      color: "text-cyan-700 bg-cyan-50 border-cyan-200",
      points: [
        "Séances de dépistage gratuites et régulières",
        "Formation des relais communautaires de santé",
        "Fiches de référence médicale vulgarisées"
      ]
    }
  ];

  const actions = [
    {
      title: "Sensibilisation communautaire",
      desc: "Faire comprendre les enjeux de santé publique à toutes les couches de la population togolaise.",
      icon: Users,
      glow: "cyan" as const,
      color: "text-cyan-700 bg-cyan-50 border-cyan-200",
      items: [
        "Sessions d’information dans les villages, marchés, écoles",
        "Supports visuels en langues locales (affiches, BD, vidéos)",
        "Témoignages de survivants pour briser les tabous"
      ]
    },
    {
      title: "Prévention & dépistage rapide",
      desc: "Renforcer la coordination entre les acteurs de la promotion de la santé et les centres de soins.",
      icon: Activity,
      glow: "emerald" as const,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      items: [
        "Collaboration avec les structures sanitaires locales",
        "Mobilisation de professionnels pour bilans gratuits",
        "Formations certifiantes de leaders communautaires"
      ]
    },
    {
      title: "Campagnes vaccinales & PEV",
      desc: "Soutenir le Programme Élargi de Vaccination (PEV) pour protéger les nouveau-nés et femmes enceintes.",
      icon: ShieldCheck,
      glow: "orange" as const,
      color: "text-orange-700 bg-orange-50 border-orange-200",
      items: [
        "Mobilisation avant les campagnes nationales",
        "Relais d’information sur les calendriers vaccinaux",
        "Lutte active contre les fausses rumeurs de santé"
      ]
    },
    {
      title: "Soutien psychosocial & visites",
      desc: "Offrir une écoute attentive et des soins humanisés aux personnes isolées ou en détresse.",
      icon: HeartHandshake,
      glow: "rose" as const,
      color: "text-rose-700 bg-rose-50 border-rose-200",
      items: [
        "Visites à domicile et en centres hospitaliers",
        "Distribution de kits de première nécessité",
        "Accompagnement à la réinsertion communautaire"
      ]
    },
    {
      title: "Parrainage & enfants vulnérables",
      desc: "Favoriser l’intégration des orphelins et enfants de la rue par l’éducation et le suivi médical.",
      icon: Baby,
      glow: "indigo" as const,
      color: "text-indigo-700 bg-indigo-50 border-indigo-200",
      items: [
        "Ateliers éducatifs et d'éveil psychosocial",
        "Parrainage scolaire et bourses de rentrée",
        "Suivi médical et nutritionnel individualisé"
      ]
    },
    {
      title: "Assainissement & eau potable",
      desc: "Améliorer durablement la qualité de vie sanitaire et l'accès à l'eau potable en zones rurales.",
      icon: Droplets,
      glow: "cyan" as const,
      color: "text-teal-700 bg-teal-50 border-teal-200",
      items: [
        "Construction et aménagement de latrines saines",
        "Distribution de filtres à eau et savons antiseptiques",
        "Sensibilisation au tri et à la gestion des déchets"
      ]
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-24 relative z-10">
      {/* MISSION HERO HEADER */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bento-card p-8 sm:p-16 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-400/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-400/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <ShimmerBadge variant="emerald" icon={<HeartPulse size={14} />}>
            Actions & Missions Terrain
          </ShimmerBadge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[0.95] font-display">
            Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">Mission</span>, <br />
            votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">avenir</span>.
          </h1>

          <p className="text-slate-600 font-normal leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
            "La santé est un droit fondamental qui commence par la connaissance. Nous transformons la peur en compréhension et l'isolement en solidarité."
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <button 
              onClick={() => setActiveTab('donation')}
              className="btn-primary"
            >
              <Heart size={16} className="fill-current" />
              <span>Soutenir la Mission</span>
            </button>
            <button 
              onClick={() => setActiveTab('volunteer')}
              className="btn-secondary"
            >
              <span>Devenir Volontaire</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.section>

      {/* MISSION PILLARS BENTO */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Piliers Stratégiques</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              Nos 3 Engagements Majeurs
            </h2>
          </div>
          <div className="hidden sm:block h-[1px] flex-1 bg-slate-200 mx-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {missions.map((m, i) => (
            <BentoCard
              key={i}
              glowColor={m.glow}
              className="p-8 sm:p-10 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className={`w-14 h-14 ${m.color} border rounded-2xl flex items-center justify-center shadow-sm`}>
                  <m.icon size={26} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-snug tracking-tight font-display">
                  {m.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {m.desc}
                </p>
                
                <ul className="space-y-3 pt-4 border-t border-slate-100">
                  {m.points.map((p, pi) => (
                    <li key={pi} className="flex gap-2.5 text-xs font-semibold text-slate-700 items-start">
                      <Sparkles size={14} className="shrink-0 mt-0.5 text-emerald-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </BentoCard>
          ))}
        </div>
      </section>

      {/* THE APPROACH BENTO SPLIT */}
      <section className="bento-card p-8 sm:p-14 lg:p-16 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <ShimmerBadge variant="cyan" icon={<Sparkles size={13} />}>
              L'Approche SEDUCEP Togo
            </ShimmerBadge>
            
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.0] font-display">
              Éduquer pour <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600">
                prévenir, pas seulement
              </span> <br />
              pour soigner.
            </h3>
            
            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
              Beaucoup de pathologies graves peuvent être évitées dès lors que les populations sont informées des facteurs de risque, des symptômes précoces et des réflexes de prévention.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-emerald-700 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Langues Locales
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">Connaissances adaptées à la culture pour un impact réel et durable.</p>
              </div>
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-cyan-700 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Ancrage Local
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">Collaboration étroite avec les chefs traditionnels et soignants locaux.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl relative">
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" 
                alt="Action terrain association" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-6 bg-white/95 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] shadow-xl border border-slate-200/80 max-w-[280px]">
              <HeartPulse size={36} className="text-rose-500 mb-3" />
              <p className="text-slate-700 font-medium leading-relaxed text-xs italic">
                "Nous transformons l'ignorance en prévention et la peur en compréhension."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC MISSIONS FROM DB */}
      {missionsFromDb.length > 0 && (
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <ShimmerBadge variant="orange" icon={<Activity size={13} />}>
              Immersion sur le Terrain
            </ShimmerBadge>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              Récits de nos Missions
            </h3>
            <p className="text-slate-600 text-sm">
              Découvrez les dernières interventions de dépistage, de sensibilisation et d'aide humanitaire enregistrées en direct.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {missionsFromDb.map((mission) => (
              <div
                key={mission.id}
                className="bento-card overflow-hidden flex flex-col group p-0"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  {mission.videoUrl ? (
                    <video 
                      src={mission.videoUrl} 
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : mission.imageUrl ? (
                    <img 
                      src={mission.imageUrl} 
                      alt={mission.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Activity size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                      <Sparkles size={11} className="text-orange-500" /> MISSION
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900 leading-snug">{mission.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{mission.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">{mission.location || 'Togo'}</span>
                    <span className="text-emerald-600 font-mono font-bold">{mission.date?.toDate ? mission.date.toDate().toLocaleDateString('fr-FR') : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ACTIONS GRID (6 AXES) */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <ShimmerBadge variant="emerald" icon={<ShieldCheck size={13} />}>
            Actions Pratiques
          </ShimmerBadge>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
            Nos Axes d’Intervention
          </h3>
          <p className="text-slate-600 text-sm">
            Une méthodologie structurée pour apporter des solutions concrètes et pérennes aux familles vulnérables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {actions.map((action, idx) => (
            <BentoCard 
              key={idx}
              glowColor={action.glow}
              className="p-8 flex flex-col justify-between"
            >
              <div className="space-y-4 mb-6">
                <div className={`w-12 h-12 shrink-0 ${action.color} border rounded-2xl flex items-center justify-center shadow-sm`}>
                  <action.icon size={24} />
                </div>
                <h4 className="text-xl font-black text-slate-900 leading-snug font-display">
                  {action.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {action.desc}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                {action.items.map((item, i) => (
                  <div key={i} className="flex gap-2 text-xs font-medium text-slate-700 items-start">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </BentoCard>
          ))}
        </div>
      </section>

      {/* Publications Section embedded from Blog */}
      <section id="publications-section" className="relative">
        <Blog />
      </section>

      {/* CTA BENTO SECTION */}
      <section className="bento-card p-10 sm:p-16 text-center relative overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 border-emerald-200">
        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
            <Gift size={32} />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[0.95] font-display">
              Faites une différence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
                dès maintenant
              </span>.
            </h3>
            <p className="text-slate-600 font-normal text-base sm:text-lg leading-relaxed max-w-xl mx-auto italic">
              « SEDUCEP, c’est une voix qui s’élève pour les oubliés de la santé. Une force collective qui agit avec et pour les populations. »
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button 
              onClick={() => setActiveTab('donation')}
              className="btn-accent"
            >
              <Heart size={16} className="fill-current" />
              <span>Faire un Don</span>
            </button>
            <button 
              onClick={() => setActiveTab('volunteer')}
              className="btn-primary"
            >
              <span>Rejoindre l'Équipe</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


