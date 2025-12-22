import { Metadata } from "next";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import CTASection from "@/components/ui/CTASection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Blog posts data
const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}> = {
  // CAN 2025 Blog Posts
  "can-2025-predictions-maroc-favori": {
    title: "CAN 2025 : Le Maroc Favori pour Remporter la Coupe - Analyse Complète",
    excerpt: "Découvrez pourquoi le Maroc est considéré comme le grand favori de la CAN 2025.",
    content: `
      <p>La Coupe d'Afrique des Nations 2025 au Maroc s'annonce comme l'une des plus passionnantes de l'histoire. En tant que pays hôte et avec une équipe nationale au sommet de sa forme, les Lions de l'Atlas sont considérés comme les grands favoris du tournoi.</p>

      <h2>Pourquoi le Maroc est Favori ?</h2>
      <p>Après leur parcours historique à la Coupe du Monde 2022 au Qatar, où ils sont devenus la première équipe africaine à atteindre les demi-finales, les Lions de l'Atlas ont prouvé qu'ils peuvent rivaliser avec les meilleures équipes du monde.</p>

      <h2>Les Atouts de l'Équipe Marocaine</h2>
      <ul>
        <li><strong>Défense Solide :</strong> Yassine Bounou (Bono), Achraf Hakimi, et Nayef Aguerd forment l'une des meilleures défenses du continent</li>
        <li><strong>Milieu Créatif :</strong> Sofyan Amrabat et Azzedine Ounahi contrôlent le rythme du jeu</li>
        <li><strong>Attaque Efficace :</strong> Brahim Diaz et En-Nesyri apportent la créativité et le danger</li>
        <li><strong>Avantage à Domicile :</strong> Le soutien des supporters marocains sera un facteur clé</li>
      </ul>

      <h2>L'Avantage du Pays Hôte</h2>
      <p>Jouer à domicile représente un avantage considérable. Les équipes hôtes ont remporté la CAN à plusieurs reprises. L'atmosphère dans les stades marocains sera électrique, avec des supporters passionnés qui pousseront leur équipe vers la victoire.</p>

      <h2>La Préparation Exemplaire</h2>
      <p>Sous la direction de Walid Regragui, l'équipe marocaine a maintenu un niveau de performance exceptionnel. Le sélectionneur a su créer un esprit d'équipe fort et une cohésion qui font du Maroc une équipe redoutable.</p>

      <h2>Pronostic Final</h2>
      <p>Avec tous ces atouts, le Maroc a toutes les chances de remporter la CAN 2025. Cela serait la deuxième victoire du Maroc dans cette compétition après 1976.</p>

      <h2>Réservez Votre Voyage pour la CAN 2025</h2>
      <p>Ne manquez pas cette occasion historique ! Trouvez une agence de voyage au Maroc pour organiser votre séjour pendant la CAN 2025. Vivez l'expérience unique du football africain au cœur du Royaume.</p>
    `,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&h=600&fit=crop",
    date: "2025-01-15",
    author: "Expert Football",
    category: "CAN 2025",
    readTime: "8 min read",
  },
  "can-2025-qui-va-gagner-pronostics": {
    title: "CAN 2025 : Qui Va Gagner ? Pronostics et Favoris du Tournoi",
    excerpt: "Nos pronostics pour la Coupe d'Afrique des Nations 2025 au Maroc.",
    content: `
      <p>La CAN 2025 réunit les meilleures équipes africaines. Voici notre analyse complète des favoris et nos pronostics pour le vainqueur final de cette Coupe d'Afrique des Nations.</p>

      <h2>Les Grands Favoris</h2>

      <h3>🇲🇦 Maroc - Le Grand Favori</h3>
      <p>Pays hôte et demi-finaliste de la Coupe du Monde 2022, le Maroc est le favori numéro 1. Avec Hakimi, Brahim Diaz, et Bono, les Lions de l'Atlas ont l'équipe pour aller jusqu'au bout.</p>

      <h3>🇳🇬 Nigeria - Les Super Eagles</h3>
      <p>Finalistes de la CAN 2023, le Nigeria possède un effectif talentueux avec Victor Osimhen en attaque. Ils seront les principaux rivaux du Maroc.</p>

      <h3>🇸🇳 Sénégal - Champions en Titre</h3>
      <p>Vainqueurs en 2022, les Lions de la Téranga veulent défendre leur titre. Même sans Sadio Mané, ils restent une force à surveiller.</p>

      <h3>🇨🇮 Côte d'Ivoire - Champions 2023</h3>
      <p>Les Éléphants ont remporté la CAN 2023 à domicile. Ils voudront prouver que ce n'était pas un hasard.</p>

      <h2>Les Outsiders</h2>
      <ul>
        <li><strong>Égypte :</strong> Mohamed Salah peut faire la différence à lui seul</li>
        <li><strong>Algérie :</strong> Champions 2019, les Fennecs veulent retrouver leur gloire</li>
        <li><strong>Cameroun :</strong> Toujours dangereux avec leur expérience</li>
      </ul>

      <h2>Notre Pronostic Final</h2>
      <p><strong>Vainqueur :</strong> Maroc 🏆</p>
      <p><strong>Finaliste :</strong> Nigeria</p>
      <p><strong>Demi-finalistes :</strong> Sénégal, Côte d'Ivoire</p>
      <p><strong>Meilleur buteur :</strong> Victor Osimhen (Nigeria)</p>
      <p><strong>Meilleur joueur :</strong> Achraf Hakimi (Maroc)</p>

      <h2>Venez Vivre la CAN au Maroc !</h2>
      <p>Réservez dès maintenant votre voyage pour la CAN 2025. Nos agences de voyage partenaires au Maroc vous aideront à organiser un séjour inoubliable.</p>
    `,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop",
    date: "2025-01-14",
    author: "Analyste Sportif",
    category: "CAN 2025",
    readTime: "10 min read",
  },
  "can-2025-maroc-parcours-mondial": {
    title: "Le Maroc en Route vers la Gloire : Du Mondial 2022 à la CAN 2025",
    excerpt: "Retour sur le parcours exceptionnel des Lions de l'Atlas depuis la Coupe du Monde 2022.",
    content: `
      <p>Le football marocain vit une période dorée. Depuis l'exploit historique de la Coupe du Monde 2022, les Lions de l'Atlas n'ont cessé d'impressionner. Retour sur ce parcours extraordinaire vers la CAN 2025.</p>

      <h2>La Coupe du Monde 2022 : L'Histoire se Fait</h2>
      <p>Au Qatar, le Maroc a réalisé l'impossible. Première équipe africaine à atteindre les demi-finales d'une Coupe du Monde, les Lions de l'Atlas ont fait vibrer tout un continent.</p>
      <ul>
        <li>Victoire contre la Belgique (2-0)</li>
        <li>Victoire contre l'Espagne aux tirs au but</li>
        <li>Victoire contre le Portugal (1-0)</li>
        <li>Demi-finale contre la France</li>
      </ul>

      <h2>L'Après Mondial : Maintenir le Niveau</h2>
      <p>Sous la direction de Walid Regragui, le Maroc a maintenu un niveau de jeu exceptionnel. L'équipe a continué à progresser, intégrant de nouveaux talents tout en conservant ses cadres expérimentés.</p>

      <h2>Les Héros du Maroc</h2>
      <ul>
        <li><strong>Yassine Bounou (Bono) :</strong> Le mur infranchissable</li>
        <li><strong>Achraf Hakimi :</strong> Le meilleur latéral droit du monde</li>
        <li><strong>Sofyan Amrabat :</strong> Le moteur du milieu de terrain</li>
        <li><strong>Brahim Diaz :</strong> Le génie créatif du Real Madrid</li>
        <li><strong>Youssef En-Nesyri :</strong> Le buteur de classe mondiale</li>
      </ul>

      <h2>La CAN 2025 : L'Objectif Ultime</h2>
      <p>Après avoir conquis le monde, les Lions de l'Atlas visent maintenant la conquête de l'Afrique. La CAN 2025 à domicile représente l'opportunité parfaite pour couronner cette génération dorée.</p>

      <h2>Le Soutien du Douzième Homme</h2>
      <p>Les supporters marocains sont reconnus comme parmi les plus passionnés au monde. Lors de la CAN 2025, les stades marocains seront une véritable forteresse pour les Lions de l'Atlas.</p>

      <h2>Rejoignez l'Aventure !</h2>
      <p>Ne manquez pas cette page d'histoire du football africain. Réservez votre voyage au Maroc pour la CAN 2025 et vivez l'expérience avec les supporters marocains.</p>
    `,
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200&h=600&fit=crop",
    date: "2025-01-13",
    author: "Chroniqueur Sportif",
    category: "CAN 2025",
    readTime: "7 min read",
  },
  "can-2025-calendrier-matchs-maroc": {
    title: "CAN 2025 Calendrier : Tous les Matchs du Maroc et Programme Complet",
    excerpt: "Calendrier complet de la CAN 2025 avec tous les matchs de l'équipe du Maroc.",
    content: `
      <p>La CAN 2025 se déroulera au Maroc du 21 décembre 2025 au 18 janvier 2026. Voici le calendrier complet avec tous les matchs importants à ne pas manquer.</p>

      <h2>Matchs de Phase de Groupes du Maroc</h2>
      <p>Le Maroc, en tant que pays hôte, est tête de série dans le Groupe A.</p>
      <ul>
        <li><strong>Match 1 :</strong> Maroc vs TBD - Match d'ouverture à Rabat</li>
        <li><strong>Match 2 :</strong> Maroc vs TBD - Casablanca</li>
        <li><strong>Match 3 :</strong> Maroc vs TBD - Rabat</li>
      </ul>

      <h2>Stades et Villes Hôtes</h2>
      <ul>
        <li><strong>Rabat :</strong> Stade Moulay Abdellah - Match d'ouverture et Finale</li>
        <li><strong>Casablanca :</strong> Complexe Mohammed V</li>
        <li><strong>Marrakech :</strong> Stade de Marrakech</li>
        <li><strong>Fès :</strong> Complexe sportif de Fès</li>
        <li><strong>Agadir :</strong> Stade Adrar</li>
        <li><strong>Tanger :</strong> Stade Ibn Batouta</li>
      </ul>

      <h2>Phase Éliminatoire</h2>
      <ul>
        <li><strong>Huitièmes de finale :</strong> Début janvier 2026</li>
        <li><strong>Quarts de finale :</strong> Mi-janvier 2026</li>
        <li><strong>Demi-finales :</strong> 15-16 janvier 2026</li>
        <li><strong>Finale :</strong> 18 janvier 2026 à Rabat</li>
      </ul>

      <h2>Où Regarder les Matchs ?</h2>
      <p>Les matchs seront diffusés sur :</p>
      <ul>
        <li>BeIN Sports (MENA)</li>
        <li>SNRT (Maroc)</li>
        <li>SuperSport (Afrique)</li>
        <li>Chaînes locales selon les pays</li>
      </ul>

      <h2>Planifiez Votre Voyage</h2>
      <p>Pour vivre les matchs en direct, réservez dès maintenant votre voyage au Maroc. Nos agences de voyage partenaires peuvent organiser des forfaits incluant billets, hébergement et transport.</p>
    `,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&h=600&fit=crop",
    date: "2025-01-12",
    author: "Expert CAN",
    category: "CAN 2025",
    readTime: "6 min read",
  },
  "can-2025-voyage-maroc-supporters": {
    title: "CAN 2025 : Guide de Voyage au Maroc pour les Supporters",
    excerpt: "Guide complet pour les supporters voyageant au Maroc pour la CAN 2025.",
    content: `
      <p>Vous prévoyez de voyager au Maroc pour la CAN 2025 ? Ce guide complet vous aidera à préparer votre séjour et vivre une expérience inoubliable.</p>

      <h2>Visa et Documents de Voyage</h2>
      <p>De nombreux pays africains et européens bénéficient d'une exemption de visa pour le Maroc. Vérifiez les exigences spécifiques à votre pays. Un passeport valide pendant au moins 6 mois est nécessaire.</p>

      <h2>Où Loger ?</h2>
      <h3>Rabat</h3>
      <p>Capitale du Maroc, idéale pour les matchs d'ouverture et la finale. Options d'hébergement variées du riad traditionnel aux hôtels modernes.</p>

      <h3>Casablanca</h3>
      <p>Plus grande ville du Maroc avec de nombreuses options d'hébergement. Proche du stade Mohammed V.</p>

      <h3>Marrakech</h3>
      <p>Destination touristique par excellence, parfaite pour combiner football et tourisme.</p>

      <h2>Transport</h2>
      <ul>
        <li><strong>Vols :</strong> Aéroports internationaux à Casablanca (CMN), Marrakech (RAK), Rabat (RBA)</li>
        <li><strong>Train :</strong> Réseau ONCF connectant toutes les grandes villes, incluant le TGV Al Boraq</li>
        <li><strong>Bus :</strong> CTM et Supratours pour les liaisons interurbaines</li>
        <li><strong>Taxi :</strong> Disponibles partout, négociez le prix avant le trajet</li>
      </ul>

      <h2>Billets de Match</h2>
      <p>Les billets seront disponibles sur le site officiel de la CAF. Réservez tôt car la demande sera forte, surtout pour les matchs du Maroc.</p>

      <h2>Budget Estimé</h2>
      <ul>
        <li><strong>Hébergement :</strong> 30-150€/nuit selon le standing</li>
        <li><strong>Repas :</strong> 5-20€/repas</li>
        <li><strong>Transport local :</strong> 1-10€/trajet</li>
        <li><strong>Billets de match :</strong> 10-100€ selon la catégorie</li>
      </ul>

      <h2>Conseils Pratiques</h2>
      <ul>
        <li>Apprenez quelques mots en arabe ou français</li>
        <li>Respectez les coutumes locales</li>
        <li>Négociez dans les souks</li>
        <li>Goûtez à la cuisine marocaine : tagine, couscous, pastilla</li>
        <li>Portez des vêtements appropriés</li>
      </ul>

      <h2>Trouvez Votre Agence de Voyage</h2>
      <p>Pour un voyage sans stress, faites appel à nos agences de voyage partenaires au Maroc. Elles peuvent organiser des forfaits tout compris pour la CAN 2025.</p>
    `,
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&h=600&fit=crop",
    date: "2025-01-11",
    author: "Guide Voyage",
    category: "CAN 2025",
    readTime: "12 min read",
  },
  "can-2025-stades-maroc-villes-hotes": {
    title: "CAN 2025 : Les Stades du Maroc et Villes Hôtes du Tournoi",
    excerpt: "Découvrez les stades marocains qui accueilleront la CAN 2025.",
    content: `
      <p>Le Maroc a préparé des infrastructures de classe mondiale pour accueillir la CAN 2025. Découvrez les stades et les villes qui feront vibrer le continent africain.</p>

      <h2>Rabat - La Capitale</h2>
      <h3>Stade Moulay Abdellah (Capacité : 65 000)</h3>
      <p>Rénové et agrandi pour l'occasion, ce stade accueillera le match d'ouverture et la finale. Situé au cœur de la capitale, il offrira une atmosphère unique.</p>
      <p><strong>Matchs prévus :</strong> Match d'ouverture, demi-finale, finale</p>

      <h2>Casablanca - La Métropole</h2>
      <h3>Complexe Sportif Mohammed V (Capacité : 45 000)</h3>
      <p>Le stade le plus emblématique du football marocain. Il a accueilli des finales de coupes africaines et sera au cœur de la CAN 2025.</p>
      <p><strong>Matchs prévus :</strong> Phase de groupes, huitièmes de finale, quarts de finale</p>

      <h2>Marrakech - La Ville Rouge</h2>
      <h3>Stade de Marrakech (Capacité : 45 000)</h3>
      <p>Stade moderne au pied de l'Atlas, dans un cadre spectaculaire. Marrakech combine football et tourisme pour une expérience unique.</p>
      <p><strong>À voir :</strong> Place Jemaa el-Fna, Jardins Majorelle, Médina</p>

      <h2>Fès - La Ville Impériale</h2>
      <h3>Complexe Sportif de Fès (Capacité : 45 000)</h3>
      <p>La plus ancienne ville impériale du Maroc offre un cadre historique unique. Son stade moderne accueillera plusieurs matchs de groupes.</p>
      <p><strong>À voir :</strong> Médina de Fès (UNESCO), Tanneries, Université Al Quaraouiyine</p>

      <h2>Agadir - La Station Balnéaire</h2>
      <h3>Stade Adrar (Capacité : 45 000)</h3>
      <p>Située sur la côte atlantique, Agadir offre plages et football. Idéal pour combiner supporter et vacances.</p>
      <p><strong>À voir :</strong> Plages, Kasbah, Souk El Had</p>

      <h2>Tanger - La Porte de l'Afrique</h2>
      <h3>Stade Ibn Batouta (Capacité : 45 000)</h3>
      <p>Stade ultramoderne qui a accueilli la finale de la Coupe du Monde des Clubs 2022. Tanger offre un mélange unique de cultures européenne et africaine.</p>
      <p><strong>À voir :</strong> Médina, Grottes d'Hercule, Cap Spartel</p>

      <h2>Réservez Votre Séjour</h2>
      <p>Chaque ville hôte offre une expérience unique. Contactez nos agences de voyage partenaires pour organiser un circuit qui combine les matchs de la CAN et la découverte du Maroc.</p>
    `,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&h=600&fit=crop",
    date: "2025-01-10",
    author: "Expert Infrastructure",
    category: "CAN 2025",
    readTime: "9 min read",
  },
  // Original blog posts
  "how-to-choose-travel-agency": {
    title: "How to Choose the Right Travel Agency for Your Next Trip",
    excerpt: "Discover the key factors to consider when selecting a travel agency.",
    content: `
      <p>Choosing the right travel agency can make the difference between a good trip and an unforgettable experience. With so many options available, it's important to know what to look for when selecting a travel partner.</p>

      <h2>1. Check Reviews and Ratings</h2>
      <p>One of the first things you should do is check the agency's reviews and ratings. Look for agencies with consistently high ratings (4 stars and above) and read through customer testimonials to understand their strengths and weaknesses.</p>

      <h2>2. Verify Their Specialization</h2>
      <p>Some agencies specialize in specific types of travel – adventure tours, luxury vacations, business travel, or specific destinations. Choose an agency that aligns with your travel needs and preferences.</p>

      <h2>3. Look for Certifications and Memberships</h2>
      <p>Reputable travel agencies often hold certifications from recognized bodies like IATA (International Air Transport Association) or are members of professional associations. These credentials indicate a commitment to quality and professionalism.</p>

      <h2>4. Compare Pricing and Value</h2>
      <p>While price is important, don't just go for the cheapest option. Consider what's included in the package – some agencies offer better value with included services like airport transfers, travel insurance, or guided tours.</p>

      <h2>5. Assess Their Communication</h2>
      <p>Good communication is essential. A reliable agency should be responsive, answer your questions thoroughly, and provide clear information about your booking.</p>

      <h2>6. Ask About Flexibility</h2>
      <p>Travel plans can change. Ask about the agency's cancellation and modification policies before booking. A good agency will offer reasonable flexibility.</p>

      <h2>Conclusion</h2>
      <p>Taking the time to research and choose the right travel agency will pay off in the quality of your travel experience. Use resources like TravelAgencies.World to compare agencies, read reviews, and find the perfect partner for your next adventure.</p>
    `,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop",
    date: "2024-12-15",
    author: "Travel Expert",
    category: "Travel Tips",
    readTime: "5 min read",
  },
  "top-destinations-2025": {
    title: "Top 10 Travel Destinations for 2025",
    excerpt: "From exotic beaches to historic cities, discover the must-visit destinations.",
    content: `
      <p>As we look ahead to 2025, the world offers more exciting travel opportunities than ever. Here are the top destinations that should be on your radar.</p>

      <h2>1. Morocco</h2>
      <p>From the bustling souks of Marrakech to the serene Sahara Desert, Morocco offers a perfect blend of culture, adventure, and relaxation. The country's diverse landscapes and rich history make it an ideal destination for all types of travelers.</p>

      <h2>2. Japan</h2>
      <p>With its perfect mix of ancient traditions and cutting-edge technology, Japan continues to captivate travelers. Cherry blossom season remains a highlight, but the country offers year-round attractions.</p>

      <h2>3. Portugal</h2>
      <p>Affordable, beautiful, and packed with history, Portugal has become Europe's hottest destination. From Lisbon's vibrant nightlife to Porto's wine cellars, there's something for everyone.</p>

      <h2>4. Costa Rica</h2>
      <p>For eco-travelers and adventure seekers, Costa Rica offers incredible biodiversity, stunning beaches, and world-class adventure activities.</p>

      <h2>5. Greece</h2>
      <p>Beyond the iconic Santorini, Greece offers countless islands to explore, ancient ruins, and some of the Mediterranean's best cuisine.</p>

      <h2>Planning Your Trip</h2>
      <p>No matter which destination calls to you, working with a knowledgeable travel agency can help you make the most of your trip. Browse our directory to find agencies specializing in your dream destination.</p>
    `,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=600&fit=crop",
    date: "2024-12-10",
    author: "Destination Expert",
    category: "Destinations",
    readTime: "8 min read",
  },
  "morocco-travel-guide": {
    title: "Complete Morocco Travel Guide: What You Need to Know",
    excerpt: "Planning a trip to Morocco? Learn everything you need to know.",
    content: `
      <p>Morocco is a land of contrasts – from the Atlas Mountains to the Sahara Desert, from ancient medinas to modern cities. Here's your complete guide to planning an unforgettable Moroccan adventure.</p>

      <h2>Best Time to Visit</h2>
      <p>The best time to visit Morocco is during spring (March-May) and fall (September-November) when temperatures are pleasant. Summer can be extremely hot, especially in the desert, while winter is ideal for skiing in the Atlas Mountains.</p>

      <h2>Must-Visit Cities</h2>
      <ul>
        <li><strong>Marrakech:</strong> The iconic red city with its famous Jemaa el-Fnaa square</li>
        <li><strong>Fes:</strong> Home to the world's oldest university and a maze-like medina</li>
        <li><strong>Chefchaouen:</strong> The stunning blue city in the Rif Mountains</li>
        <li><strong>Casablanca:</strong> Morocco's modern economic capital</li>
      </ul>

      <h2>Cultural Tips</h2>
      <p>Morocco is a Muslim country with its own customs. Dress modestly, especially when visiting religious sites. Learn a few words in Arabic or French – locals appreciate the effort. Bargaining is expected in souks.</p>

      <h2>Getting Around</h2>
      <p>Morocco has good train connections between major cities. For more flexibility, consider hiring a driver or joining organized tours. Many travel agencies offer comprehensive packages that include transportation.</p>

      <h2>Finding the Right Agency</h2>
      <p>Morocco has hundreds of excellent travel agencies. Look for agencies with local knowledge, good reviews, and expertise in the experiences you're seeking. Our directory features many top-rated Moroccan agencies.</p>
    `,
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=600&fit=crop",
    date: "2024-12-05",
    author: "Morocco Specialist",
    category: "Destinations",
    readTime: "10 min read",
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-white">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container mx-auto px-4 text-white">
            <div className="max-w-4xl">
              <span className="inline-block bg-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-lg">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            {/* Article Card */}
            <div className="bg-gradient-to-b from-muted/30 to-transparent rounded-2xl p-8 md:p-12 -mx-4 md:mx-0">
              <article
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Author Card */}
            <div className="mt-12 p-6 bg-muted/50 rounded-2xl flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-sm text-muted-foreground">Travel & Tourism Expert</p>
              </div>
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-semibold mb-4 text-foreground">Share this article</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Continue Reading</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/blog/how-to-choose-travel-agency" className="group">
                  <div className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">How to Choose the Right Travel Agency</h4>
                    <p className="text-sm text-muted-foreground mt-2">5 min read</p>
                  </div>
                </Link>
                <Link href="/blog/top-destinations-2025" className="group">
                  <div className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">Top 10 Travel Destinations for 2025</h4>
                    <p className="text-sm text-muted-foreground mt-2">8 min read</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection variant="secondary" />
    </div>
  );
}
