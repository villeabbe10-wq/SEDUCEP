import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BlogPost } from '../types';
import { Calendar, User, ArrowLeft, Share2, BookOpen, Search, ArrowRight, Heart, ZoomIn, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from 'motion/react';
import BentoCard from '../components/ui/BentoCard';
import ShimmerBadge from '../components/ui/ShimmerBadge';

// ... (MOCK_POSTS unchanged but could be translated if needed, for now focusing on UI)
const cleanMarkdownContent = (content: string) => {
  if (!content) return '';
  return content
    .replace(/onError=\{[^}]+\}/gi, '')
    .replace(/onError="[^"]*"/gi, '')
    .replace(/onError='[^']*'/gi, '')
    .replace(/className=/g, 'class=');
};

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Journée de dépistage gratuit',
    content: `### Journée de sensibilisation et dépistage.

SEDUCEP a une fois de plus démontré son engagement profond pour la santé communautaire à travers une journée de sensibilisation exceptionnelle, organisée ce vendredi 6 septembre 2024, à l’EPL MAGNIFICAT à Dagué Assévénou.

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
  <img src="/images/publications/depistage1.jpg" alt="Entrée" class="rounded-3xl shadow-lg w-full h-48 object-cover" />
  <img src="/images/publications/depistage2.jpg" alt="Consultation" class="rounded-3xl shadow-lg w-full h-48 object-cover" />
</div>

Cette rencontre ouverte à tous a permis de démystifier des pathologies qui menacent notre bien-être quotidien :

- **Le diabète** : comprendre les signes précoces et éviter les dérives.
- **L’AVC** : comment l’éviter et reconnaître les symptômes à temps.
- **Le glaucome et ses complications** : la menace silencieuse de la cécité.
- **Les allergies oculaires et la cataracte** : mieux les vivre et les prévenir.
- **L’impact des écrans** : sur les yeux, chez les jeunes comme chez les adultes.

### Une ambiance fraternelle et éducative
Parents, jeunes, enseignants et responsables communautaires se sont réunis dans une atmosphère conviviale et participative. Les échanges ont été enrichissants, les questions nombreuses, et les réponses données par des spécialistes de la santé ont touché le cœur de chacun.

Des conseils pratiques, des explications simples… La journée fut un véritable temps de grâce pour la santé oculaire et générale.`,
    author: 'Equipe SEDUCEP',
    category: 'Dépistage',
    imageUrl: '/images/publications/depistage1.jpg',
    publishedAt: Timestamp.fromDate(new Date('2024-09-06')),
    featured: true
  },
  {
    id: '2',
    title: 'Tournoi don de sang',
    content: `### Tournoi de Football « Le Foot du Don de Sang » au CEG Djidjolé : Une jeunesse engagée pour la vie !
    
Le 11 Juin 2024, le terrain du CEG Djidjolé s’est transformé en une véritable arène de fraternité, de sport et de solidarité. À travers le tournoi « Le Foot du Don de Sang », des dizaines de jeunes se sont rassemblés pour défendre les couleurs de leurs équipes, mais surtout, pour porter haut un message vital : **donner son sang, c’est sauver des vies**.

<div class="flex flex-col sm:flex-row gap-6 my-8 items-center bg-slate-50 p-6 rounded-[2.5rem]">
  <img src="/images/publications/joueurs.jpg" alt="Joueurs mobilisés" class="w-full sm:w-1/3 rounded-3xl shadow-lg border-4 border-white object-cover" />
  <p class="flex-1 text-slate-600 font-medium italic leading-relaxed">
    Le sport comme vecteur de solidarité. Les jeunes du quartier se sont mobilisés en nombre pour cette cause noble, prouvant que la passion du football peut servir à sauver des vies.
  </p>
</div>

### Un tournoi engagé et inspirant
Sur un sol rouge de passion et d’effort, les équipes locales se sont affrontées dans un esprit de fair-play exemplaire. L’événement, soutenu par SEDUCEP (Santé, Éducation, Dépistage Universel et Engagement pour la Prévention), visait à sensibiliser la jeunesse à l’importance du don de sang volontaire. Chaque but, chaque passe, chaque victoire était une célébration de la vie.

> « Le sang ne se fabrique pas. C’est le don qui sauve. Aujourd’hui, ces jeunes nous montrent qu’on peut jouer pour quelque chose de grand. » - **Dr SEHONOU**.

<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
  <img src="/images/publications/equipe3.jpg" alt="Equipe" class="rounded-2xl h-32 w-full object-cover" />
  <img src="/images/publications/equipe4.jpg" alt="Equipe" class="rounded-2xl h-32 w-full object-cover" />
  <img src="/images/publications/equipe5.jpg" alt="Equipe" class="rounded-2xl h-32 w-full object-cover" />
  <img src="/images/publications/equipe6.jpg" alt="Equipe" class="rounded-2xl h-32 w-full object-cover" />
</div>

### Une victoire pour tous
Au-delà des médailles remises aux finalistes, c’est toute une communauté qui est sortie gagnante. L’ambiance festive, la fierté des participants, les sourires après chaque coup de sifflet final : tout témoignait d’un événement réussi, où sport et humanité ont marché main dans la main.

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-8">
  <img src="/images/publications/tournoi.jpg" alt="Tournoi" class="rounded-2xl h-48 w-full object-cover" />
  <img src="/images/publications/tournoi1.jpg" alt="Tournoi" class="rounded-2xl h-48 w-full object-cover" />
  <img src="/images/publications/tournoi2.jpg" alt="Tournoi" class="rounded-2xl h-48 w-full object-cover" />
  <img src="/images/publications/joueurs.jpg" alt="Joueurs" class="rounded-2xl h-48 w-full object-cover" />
</div>

### Quand la jeunesse devient actrice du changement
L’événement ha permis de mobiliser des élèves, enseignants, habitants du quartier et volontaires de la santé. Il a également servi de tremplin pour encourager l’inscription de nouveaux donneurs et futurs bénévoles à travers la plateforme de SEDUCEP.

Ce tournoi n’est que le début d’une série d’actions communautaires autour de la santé préventive, l’éducation et la citoyenneté. D’autres activités sportives, culturelles et de dépistage sont prévues dans les mois à venir.`,
    author: 'Dr SEHONOU',
    category: 'Actions',
    imageUrl: '/images/publications/tournoi.jpg',
    publishedAt: Timestamp.fromDate(new Date('2024-06-11')),
  },
  {
    id: '3',
    title: 'Hygiène des mains',
    content: `### L’hygiène des mains en 5 étapes : un geste simple qui sauve des vies
Laver ses mains peut sembler banal. Pourtant, ce geste simple et rapide peut prévenir jusqu’à **80 % des infections**. En ces temps où les maladies infectieuses circulent rapidement (grippe, gastro, COVID-19, variole etc.), adopter une bonne hygiène des mains est une barrière essentielle.

<div class="grid grid-cols-2 sm:grid-cols-5 gap-3 my-8">
  <img src="/images/publications/hygiene.jpg" alt="Sensibilisation Hygiène" class="rounded-2xl h-36 w-full object-cover" />
  <img src="/images/publications/hygiene1.jpg" alt="Mouiller les mains" class="rounded-2xl h-36 w-full object-cover" />
  <img src="/images/publications/hygiene2.jpg" alt="Savonner" class="rounded-2xl h-36 w-full object-cover" />
  <img src="/images/publications/hygiene3.jpg" alt="Frotter" class="rounded-2xl h-36 w-full object-cover" />
  <img src="/images/publications/hygiene4.jpg" alt="Sécher" class="rounded-2xl h-36 w-full object-cover" />
</div>

Mais encore faut-il bien le faire. Voici les 5 étapes clés pour un lavage de mains efficace :

1. **Mouillez vos mains** : Commencez par mouiller complètement vos mains avec de l’eau propre, de préférence tiède. Cela prépare la peau à recevoir le savon et facilite le délogement des microbes.
![Etape 1](/images/publications/hygiene1.jpg)

2. **Appliquez du savon** : Prenez une quantité suffisante de savon pour recouvrir toute la surface des mains. Le savon est essentiel : il détache les germes de la peau, même ceux invisibles à l’œil nu.
![Etape 2](/images/publications/hygiene2.jpg)

3. **Frottez pendant 30 secondes** : C’est l’étape cruciale. Frottez toutes les surfaces : paumes, dos des mains, entre les doigts, le bout des doigts et sous les ongles, les pouces, les poignets.
![Etape 3](/images/publications/hygiene3.jpg)

4. **Rincez abondamment** : Rincez à l’eau propre jusqu’à ce qu’il ne reste aucune trace de savon. Ce rinçage entraîne les germes décollés par le savon vers l’évacuation.

5. **Séchez avec soin** : Séchez vos mains avec une serviette propre ou un essuie-main jetable. Évitez les tissus humides ou partagés. Des mains mal séchées favorisent la prolifération de nouvelles bactéries.
![Etape 5](/images/publications/hygiene4.jpg)

<div class="bg-sky-50 p-8 rounded-[2.5rem] my-12 border border-sky-100">
  <h4 class="text-sky-900 font-black mb-4">Une hygiène des mains régulière est un réflexe de santé publique !</h4>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
    <div class="space-y-3">
      <p class="font-black text-sky-700">Pourquoi c’est important ?</p>
      <ul class="list-disc pl-4 space-y-1 text-slate-600 font-medium">
        <li>Les mains sont le vecteur principal de transmission.</li>
        <li>Les enfants et seniors sont les plus vulnérables.</li>
        <li>Évite les infections nosocomiales.</li>
      </ul>
    </div>
    <div class="space-y-3">
      <p class="font-black text-sky-700">À quel moment se laver les mains ?</p>
      <ul class="list-disc pl-4 space-y-1 text-slate-600 font-medium">
        <li>Avant de manger ou cuisiner.</li>
        <li>Après les toilettes.</li>
        <li>En rentrant chez soi.</li>
      </ul>
    </div>
  </div>
</div>`,
    author: 'Service Prévention',
    category: 'Hygiène',
    imageUrl: '/images/publications/hygiene.jpg',
    gallery: [
      '/images/publications/hygiene.jpg',
      '/images/publications/hygiene1.jpg',
      '/images/publications/hygiene2.jpg',
      '/images/publications/hygiene3.jpg',
      '/images/publications/hygiene4.jpg'
    ],
    publishedAt: Timestamp.fromDate(new Date('2025-06-10')),
  },
  {
    id: '4',
    title: 'Prévention de paludisme',
    content: `### Prévention du Paludisme : Une Approche Multiforme
Le paludisme est une maladie grave mais évitable. La prévention repose sur plusieurs piliers essentiels visant à réduire le risque de piqûres de moustiques et à empêcher la propagation du parasite.

<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
  <img src="/images/publications/paludisme1.jpg" alt="Prévention Palu 1" class="rounded-3xl shadow-lg w-full h-48 object-cover" />
  <img src="/images/publications/paludisme2.jpg" alt="Prévention Palu 2" class="rounded-3xl shadow-lg w-full h-48 object-cover" />
  <img src="/images/publications/paludisme3.jpg" alt="Prévention Palu 3" class="rounded-3xl shadow-lg w-full h-48 object-cover" />
</div>

### 1. Protection Contre les Piqûres de Moustiques
Les moustiques vecteurs du paludisme (anophèles) piquent principalement entre le coucher et le lever du soleil.
- **Moustiquaires imprégnées :** Dormir sous une moustiquaire traitée avec un insecticide est extrêmement efficace.
- **Répulsifs cutanés :** Appliquer des répulsifs sur la peau exposée.
- **Vêtements protecteurs :** Porter des vêtements longs de couleur claire le soir et la nuit.
- **Protection de l’habitat :** Utiliser des moustiquaires aux fenêtres et des ventilateurs.

### 2. Chimioprophylaxie (Médicaments Préventifs)
Pour les personnes voyageant dans des zones à risque, la prise de médicaments antipaludiques peut prévenir l’infection. Il est impératif de consulter un médecin.

### 3. Gestion de l’Environnement
- **Élimination des gîtes larvaires :** Vider ou couvrir les récipients d’eau stagnante.
- **Pulvérisation d’insecticides :** Sur les surfaces intérieures des habitations.
- **Larvicides :** Dans les points d’eau où ils se développent.

### 4. Diagnostic et Traitement Précoces
Un diagnostic rapide empêche l’évolution vers des formes graves et réduit la transmission.

> **Tu veux participer à la prochaine édition ?**
> Contacte-nous pour devenir volontaire !`,
    author: 'Equipe SEDUCEP',
    category: 'Prévention',
    imageUrl: '/images/publications/paludisme1.jpg',
    gallery: [
      '/images/publications/paludisme1.jpg',
      '/images/publications/paludisme2.jpg',
      '/images/publications/paludisme3.jpg'
    ],
    publishedAt: Timestamp.fromDate(new Date('2025-06-09')),
  }
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } as any }
  };

  const categories = [
    'Tout', 
    'Prévention', 
    'Hygiène', 
    'Nutrition', 
    'Maternité'
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        
        const data = fetchedPosts.length === 0 ? MOCK_POSTS : fetchedPosts;
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        setPosts(MOCK_POSTS);
        setFilteredPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    if (activeCategory !== 'Tout') {
      result = result.filter(p => p.category === activeCategory || (activeCategory === 'Prévention' && p.category === 'Prévention'));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q)
      );
    }
    setFilteredPosts(result);
  }, [searchQuery, activeCategory, posts]);

  if (selectedPost) {
    return (
      <div className="space-y-8 relative z-10">
        <div className="bento-card p-0 overflow-hidden">
          <div 
            onClick={() => !selectedPost.videoUrl && setActiveLightboxImage(selectedPost.imageUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800')}
            className={`relative h-[45vh] sm:h-[60vh] overflow-hidden bg-slate-950 group ${!selectedPost.videoUrl ? 'cursor-pointer' : ''}`}
          >
            {selectedPost.videoUrl ? (
              <video 
                src={selectedPost.videoUrl} 
                className="w-full h-full object-contain" 
                controls
                autoPlay
              />
            ) : (
              <img 
                src={selectedPost.imageUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=60&w=800'} 
                className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700" 
                alt={selectedPost.title} 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute top-6 left-6 z-10">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPost(null);
                }}
                className="p-3 bg-slate-900/80 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-xl cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            
            {!selectedPost.videoUrl && (
              <div className="absolute top-6 right-6 z-10 hidden sm:block">
                <span className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20">
                  <ZoomIn size={14} className="text-emerald-400" /> Agrandir
                </span>
              </div>
            )}

            <div className="absolute bottom-8 left-0 w-full px-6 sm:px-12 text-white">
              <div className="space-y-3 max-w-4xl">
                <ShimmerBadge variant="emerald">
                  {selectedPost.category}
                </ShimmerBadge>
                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight font-display tracking-tight drop-shadow-md">
                  {selectedPost.title}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-12 space-y-8 bg-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm">
                  <User size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{selectedPost.author}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={12} className="text-emerald-600" /> 
                    {selectedPost.publishedAt instanceof Timestamp ? selectedPost.publishedAt.toDate().toLocaleDateString('fr-FR') : 'Date'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-slate-50 rounded-xl text-slate-600 hover:text-emerald-600 border border-slate-200 cursor-pointer transition-colors shadow-sm">
                  <Share2 size={18} />
                </button>
                <button className="p-3 bg-slate-50 rounded-xl text-slate-600 hover:text-rose-500 border border-slate-200 cursor-pointer transition-colors shadow-sm">
                  <Heart size={18} />
                </button>
              </div>
            </div>

            <div className="markdown-body prose prose-slate prose-emerald max-w-none text-slate-700 font-normal leading-relaxed
              prose-p:text-base prose-p:leading-[1.8]
              prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
              prose-img:rounded-2xl prose-img:my-8 prose-img:border prose-img:border-slate-200 prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
              prose-strong:text-slate-900
            ">
              <ReactMarkdown 
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ node, ...props }) => {
                    return (
                      <span 
                        className="block my-6 group relative rounded-2xl overflow-hidden border border-slate-200 shadow-md cursor-pointer"
                        onClick={() => props.src && setActiveLightboxImage(props.src as string)}
                      >
                        <img 
                          {...props} 
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-[2px]">
                          <ZoomIn size={18} className="text-emerald-400" /> Cliquer pour agrandir
                        </span>
                      </span>
                    );
                  }
                }}
              >
                {cleanMarkdownContent(selectedPost.content)}
              </ReactMarkdown>
            </div>

            <div className="pt-8 border-t border-slate-100 text-center">
              <button 
                onClick={() => {
                  setSelectedPost(null);
                  document.getElementById('publications-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary"
              >
                <ArrowLeft size={16} />
                <span>Retour aux Articles</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeLightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightboxImage(null)}
              className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxImage(null);
                }}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all cursor-pointer z-20"
              >
                <X size={24} />
              </button>

              <div 
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 cursor-default"
              >
                <img
                  src={activeLightboxImage}
                  alt="Agrandissement"
                  className="w-full h-full max-h-[85vh] object-contain rounded-xl"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 relative z-10">
      {/* HEADER & SEARCH BENTO */}
      <div className="bento-card p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <ShimmerBadge variant="emerald" icon={<BookOpen size={13} />}>
                Journal & Conseils de Santé
              </ShimmerBadge>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display">
                Journal SEDUCEP
              </h2>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
            <div className="lg:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un article ou un conseil..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none lg:col-span-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-md font-black' 
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POSTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredPosts.map((post) => (
          <BentoCard
            key={post.id}
            glowColor="emerald"
            onClick={() => {
              setSelectedPost(post);
              document.getElementById('publications-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-0 overflow-hidden flex flex-col group cursor-pointer"
          >
            <div className="h-56 overflow-hidden relative bg-slate-100">
              <img 
                src={post.imageUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=60&w=800'} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt={post.title} 
              />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                  <Calendar size={12} className="text-emerald-600" />
                  {post.publishedAt instanceof Timestamp ? post.publishedAt.toDate().toLocaleDateString('fr-FR') : 'Date'}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 leading-snug tracking-tight font-display group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-slate-600 text-xs font-normal leading-relaxed line-clamp-3">
                  {post.content.replace(/[#*`]/g, '').substring(0, 140)}...
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{post.author}</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Lire l'article <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </BentoCard>
        ))}

        {filteredPosts.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500 font-bold uppercase tracking-widest text-xs border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            Aucun article trouvé pour cette recherche.
          </div>
        )}
      </div>
    </div>
  );
}
