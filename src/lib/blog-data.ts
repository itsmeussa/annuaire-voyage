export type BlogPost = {
    id: string;
    slug: string;
    image: string;
    date: string;
    author: string;
    category: string; // This could also be localized if needed
    readTime: string; // This could be localized e.g. "8 min" vs "8 mn"
    content?: string; // HTML content, could be localized too
    locales: {
        en: {
            title: string;
            excerpt: string;
        };
        fr: {
            title: string;
            excerpt: string;
        };
        ar: {
            title: string;
            excerpt: string;
        };
    };
};

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "can-2025-predictions-maroc-favori",
        image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=500&fit=crop",
        date: "2025-01-15",
        author: "Expert Football",
        category: "CAN 2025",
        readTime: "8 min",
        locales: {
            en: {
                title: "CAN 2025: Morocco Favorite to Win the Cup - Full Analysis",
                excerpt: "Discover why Morocco is considered the big favorite for CAN 2025. Analysis of the national team's strengths, key players, and chances of victory."
            },
            fr: {
                title: "CAN 2025 : Le Maroc Favori pour Remporter la Coupe - Analyse Complète",
                excerpt: "Découvrez pourquoi le Maroc est considéré comme le grand favori de la CAN 2025. Analyse des forces de l'équipe nationale, des joueurs clés et des chances de victoire."
            },
            ar: {
                title: "كأس أمم إفريقيا 2025: المغرب المرشح الأوفر حظاً للفوز بالكأس - تحليل شامل",
                excerpt: "اكتشف لماذا يعتبر المغرب المرشح الأكبر للفوز بكأس أمم إفريقيا 2025. تحليل لنقاط قوة المنتخب الوطني، اللاعبين الأساسيين، وفرص الفوز."
            }
        }
    },
    {
        id: "2",
        slug: "can-2025-qui-va-gagner-pronostics",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop",
        date: "2025-01-14",
        author: "Analyste Sportif",
        category: "CAN 2025",
        readTime: "10 min",
        locales: {
            en: {
                title: "CAN 2025: Who Will Win? Predictions and Tournament Favorites",
                excerpt: "Our predictions for the 2025 Africa Cup of Nations in Morocco. Analysis of favorite teams, outsiders, and predictions for the final winner."
            },
            fr: {
                title: "CAN 2025 : Qui Va Gagner ? Pronostics et Favoris du Tournoi",
                excerpt: "Nos pronostics pour la Coupe d'Afrique des Nations 2025 au Maroc. Analyse des équipes favorites, outsiders et prédictions pour le vainqueur final."
            },
            ar: {
                title: "كأس أمم إفريقيا 2025: من سيفوز؟ توقعات والمرشحون للبطولة",
                excerpt: "توقعاتنا لكأس أمم إفريقيا 2025 في المغرب. تحليل للفرق المرشحة، الحصان الأسود، وتوقعات للفائز النهائي."
            }
        }
    },
    {
        id: "3",
        slug: "can-2025-maroc-parcours-mondial",
        image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=500&fit=crop",
        date: "2025-01-13",
        author: "Chroniqueur Sportif",
        category: "CAN 2025",
        readTime: "7 min",
        locales: {
            en: {
                title: "Morocco on the Road to Glory: From World Cup 2022 to CAN 2025",
                excerpt: "Looking back at the exceptional journey of the Atlas Lions since the 2022 World Cup and their ambitions for CAN 2025 at home."
            },
            fr: {
                title: "Le Maroc en Route vers la Gloire : Du Mondial 2022 à la CAN 2025",
                excerpt: "Retour sur le parcours exceptionnel des Lions de l'Atlas depuis la Coupe du Monde 2022 et leurs ambitions pour la CAN 2025 à domicile."
            },
            ar: {
                title: "المغرب في طريق المجد: من مونديال 2022 إلى كأس إفريقيا 2025",
                excerpt: "عودة إلى المسار الاستثنائي لأسود الأطلس منذ كأس العالم 2022 وطموحاتهم لكأس أمم إفريقيا 2025 على أرضهم."
            }
        }
    },
    {
        id: "4",
        slug: "can-2025-calendrier-matchs-maroc",
        image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=500&fit=crop",
        date: "2025-01-12",
        author: "Expert CAN",
        category: "CAN 2025",
        readTime: "6 min",
        locales: {
            en: {
                title: "CAN 2025 Schedule: All Morocco Matches and Full Program",
                excerpt: "Complete schedule for CAN 2025 with all Morocco team matches, times, stadiums, and where to watch live."
            },
            fr: {
                title: "CAN 2025 Calendrier : Tous les Matchs du Maroc et Programme Complet",
                excerpt: "Calendrier complet de la CAN 2025 avec tous les matchs de l'équipe du Maroc, horaires, stades et où regarder les matchs en direct."
            },
            ar: {
                title: "جدول كأس إفريقيا 2025: جميع مباريات المغرب والبرنامج الكامل",
                excerpt: "الجدول الكامل لكأس أمم إفريقيا 2025 مع جميع مباريات المنتخب المغربي، التوقيت، الملاعب وأين تشاهد المباريات مباشرة."
            }
        }
    },
    {
        id: "5",
        slug: "can-2025-voyage-maroc-supporters",
        image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=500&fit=crop",
        date: "2025-01-11",
        author: "Guide Voyage",
        category: "CAN 2025",
        readTime: "12 min",
        locales: {
            en: {
                title: "CAN 2025: Morocco Travel Guide for Fans",
                excerpt: "Complete guide for fans traveling to Morocco for CAN 2025. Accommodation, transport, tickets, and practical tips."
            },
            fr: {
                title: "CAN 2025 : Guide de Voyage au Maroc pour les Supporters",
                excerpt: "Guide complet pour les supporters voyageant au Maroc pour la CAN 2025. Hébergement, transport, billets et conseils pratiques."
            },
            ar: {
                title: "كأس إفريقيا 2025: دليل السفر إلى المغرب للمشجعين",
                excerpt: "دليل شامل للمشجعين المسافرين إلى المغرب لحضور كأس أمم إفريقيا 2025. السكن، النقل، التذاكر ونصائح عملية."
            }
        }
    },
    {
        id: "6",
        slug: "can-2025-stades-maroc-villes-hotes",
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=500&fit=crop",
        date: "2025-01-10",
        author: "Expert Infrastructure",
        category: "CAN 2025",
        readTime: "9 min",
        locales: {
            en: {
                title: "CAN 2025: Morocco Stadiums and Host Cities",
                excerpt: "Discover the Moroccan stadiums hosting CAN 2025: Casablanca, Rabat, Marrakech, Fez, Agadir, and Tangier."
            },
            fr: {
                title: "CAN 2025 : Les Stades du Maroc et Villes Hôtes du Tournoi",
                excerpt: "Découvrez les stades marocains qui accueilleront la CAN 2025 : Casablanca, Rabat, Marrakech, Fès, Agadir et Tanger."
            },
            ar: {
                title: "كأس إفريقيا 2025: ملاعب المغرب والمدن المضيفة",
                excerpt: "اكتشف الملاعب المغربية التي ستستضيف كأس أمم إفريقيا 2025: الدار البيضاء، الرباط، مراكش، فاس، أكادير وطنجة."
            }
        }
    },
    {
        id: "7",
        slug: "how-to-choose-travel-agency",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop",
        date: "2024-12-15",
        author: "Travel Expert",
        category: "Travel Tips",
        readTime: "5 min",
        locales: {
            en: {
                title: "How to Choose the Right Travel Agency for Your Next Trip",
                excerpt: "Discover the key factors to consider when selecting a travel agency. From reviews to specializations, learn what makes a great travel partner."
            },
            fr: {
                title: "Comment Choisir la Bonne Agence de Voyage pour Votre Prochain Voyage",
                excerpt: "Découvrez les facteurs clés à prendre en compte lors du choix d'une agence de voyage. Des avis aux spécialisations, apprenez ce qui fait un bon partenaire de voyage."
            },
            ar: {
                title: "كيف تختار وكالة السفر المناسبة لرحلتك القادمة",
                excerpt: "اكتشف العوامل الرئيسية التي يجب مراعاتها عند اختيار وكالة سفر. من المراجعات إلى التخصصات، تعلم ما الذي يجعل شريك السفر رائعاً."
            }
        }
    },
    {
        id: "8",
        slug: "top-destinations-2025",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=500&fit=crop",
        date: "2024-12-10",
        author: "Destination Expert",
        category: "Destinations",
        readTime: "8 min",
        locales: {
            en: {
                title: "Top 10 Travel Destinations for 2025",
                excerpt: "From exotic beaches to historic cities, discover the must-visit destinations that should be on your travel bucket list this year."
            },
            fr: {
                title: "Top 10 des Destinations de Voyage pour 2025",
                excerpt: "Des plages exotiques aux villes historiques, découvrez les destinations incontournables à ajouter à votre liste de voyages cette année."
            },
            ar: {
                title: "أفضل 10 وجهات سفر لعام 2025",
                excerpt: "من الشواطئ الغريبة إلى المدن التاريخية، اكتشف الوجهات التي يجب زيارتها والتي ينبغي أن تكون في قائمة سفرك هذا العام."
            }
        }
    },
    {
        id: "9",
        slug: "morocco-travel-guide",
        image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&h=500&fit=crop",
        date: "2024-12-05",
        author: "Morocco Specialist",
        category: "Destinations",
        readTime: "10 min",
        locales: {
            en: {
                title: "Complete Morocco Travel Guide: What You Need to Know",
                excerpt: "Planning a trip to Morocco? Learn about the best time to visit, must-see attractions, cultural tips, and how to find the best local agencies."
            },
            fr: {
                title: "Guide Complet de Voyage au Maroc : Ce Que Vous Devez Savoir",
                excerpt: "Vous prévoyez un voyage au Maroc ? Découvrez le meilleur moment pour visiter, les attractions incontournables, les conseils culturels et comment trouver les meilleures agences locales."
            },
            ar: {
                title: "دليل السفر الكامل إلى المغرب: ما تحتاج إلى معرفته",
                excerpt: "تخطط لرحلة إلى المغرب؟ تعرف على أفضل وقت للزيارة، المعالم التي يجب مشاهدتها، النصائح الثقافية، وكيفية العثور على أفضل الوكالات المحلية."
            }
        }
    },
    {
        id: "10",
        slug: "budget-travel-tips",
        image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=500&fit=crop",
        date: "2024-12-01",
        author: "Budget Traveler",
        category: "Travel Tips",
        readTime: "6 min",
        locales: {
            en: {
                title: "Budget Travel Tips: How to Explore More for Less",
                excerpt: "Traveling doesn't have to break the bank. Learn expert tips for finding deals, saving money, and maximizing your travel budget."
            },
            fr: {
                title: "Conseils de Voyage à Petit Budget : Comment Explorer Plus pour Moins",
                excerpt: "Voyager ne doit pas nécessairement coûter une fortune. Apprenez des conseils d'experts pour trouver des offres, économiser de l'argent et maximiser votre budget de voyage."
            },
            ar: {
                title: "نصائح السفر بميزانية محدودة: كيف تستكشف أكثر بأقل تكلفة",
                excerpt: "السفر لا يجب أن يكون مكلفاً. تعلم نصائح الخبراء للعثور على الصفقات، توفير المال، والاستفادة القصوى من ميزانية سفرك."
            }
        }
    },
    {
        id: "11",
        slug: "group-travel-benefits",
        image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&h=500&fit=crop",
        date: "2024-11-28",
        author: "Group Travel Expert",
        category: "Travel Tips",
        readTime: "5 min",
        locales: {
            en: {
                title: "The Benefits of Group Travel with a Professional Agency",
                excerpt: "Discover why booking group travel through a professional agency can enhance your experience and save you time and money."
            },
            fr: {
                title: "Les Avantages du Voyage en Groupe avec une Agence Professionnelle",
                excerpt: "Découvrez pourquoi réserver un voyage en groupe via une agence professionnelle peut améliorer votre expérience et vous faire économiser du temps et de l'argent."
            },
            ar: {
                title: "فوائد السفر الجماعي مع وكالة محترفة",
                excerpt: "اكتشف لماذا يمكن أن يعزز حجز السفر الجماعي من خلال وكالة محترفة تجربتك ويوفر عليك الوقت والمال."
            }
        }
    },
    {
        id: "12",
        slug: "travel-insurance-guide",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop",
        date: "2024-11-25",
        author: "Insurance Advisor",
        category: "Travel Tips",
        readTime: "7 min",
        locales: {
            en: {
                title: "Travel Insurance: Why You Need It and How to Choose",
                excerpt: "Don't travel without protection. Learn about the types of travel insurance, what they cover, and how to select the right policy."
            },
            fr: {
                title: "Assurance Voyage : Pourquoi Vous en Avez Besoin et Comment Choisir",
                excerpt: "Ne voyagez pas sans protection. Découvrez les types d'assurance voyage, ce qu'elles couvrent et comment choisir la bonne police."
            },
            ar: {
                title: "تأمين السفر: لماذا تحتاجه وكيف تختار",
                excerpt: "لا تسافر بدون حماية. تعرف على أنواع تأمين السفر، ما تغطيه، وكيفية اختيار البوليصة المناسبة."
            }
        }
    }
];
