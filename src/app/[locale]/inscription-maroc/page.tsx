"use client";

import { useState } from "react";
import {
  Globe,
  CheckCircle,
  Users,
  Search,
  Shield,
  TrendingUp,
  Copy,
  Phone,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Check,
  MapPin,
  Building2,
  Star,
  Zap,
} from "lucide-react";

type Language = "fr" | "en" | "ar";

const content = {
  fr: {
    // Hero Section
    heroTag: "CAN 2025 — Une opportunité historique pour les agences marocaines",
    heroTitle: "Rejoignez l'annuaire international des agences de voyage",
    heroSubtitle: "TravelAgencies.World connecte les voyageurs du monde entier avec les meilleures agences. Lancée en France, développée aux États-Unis, notre plateforme s'étend maintenant au Maroc. Soyez parmi les premiers à saisir cette opportunité.",
    heroCta: "Inscrivez votre agence",
    heroSecondary: "Découvrir l'offre",
    heroFeatures: ["Inscription à vie", "Activation sous 24h", "Sans abonnement"],
    priceLabel: "Prix unique",
    priceValue: "500",
    priceCurrency: "DH",
    priceNote: "Paiement unique — visibilité permanente",

    // Trust Stats
    stats: [
      { value: "2670+", label: "Agences référencées" },
      { value: "45+", label: "Pays couverts" },
      { value: "50K+", label: "Visiteurs mensuels" },
    ],

    // Who We Are
    whoWeAreTitle: "Qui sommes-nous ?",
    whoWeAreSubtitle: "Une plateforme internationale de confiance",
    whoWeAreText: "TravelAgencies.World est un annuaire international d'agences de voyage, fondé en France et développé aux États-Unis. Notre mission : connecter les voyageurs avec des agences fiables partout dans le monde. Aujourd'hui, nous ouvrons nos portes au Maroc pour offrir aux agences locales une visibilité internationale sans précédent.",
    whoWeArePoints: [
      "Présence dans plus de 45 pays",
      "Plus de 2670 agences de voyage référencées",
      "Milliers de voyageurs internationaux chaque mois",
      "Référencement optimisé sur Google",
    ],

    // Why Morocco
    whyMoroccoTitle: "Pourquoi le Maroc ? Pourquoi maintenant ?",
    whyMoroccoSubtitle: "La CAN 2025 représente une opportunité unique",
    whyMoroccoText: "Le Maroc accueillera la Coupe d'Afrique des Nations 2025, attirant plus d'un million de visiteurs internationaux. C'est le moment idéal pour positionner votre agence face à cette demande massive.",
    whyMoroccoReasons: [
      {
        title: "Demande explosive",
        desc: "Des millions de supporters et touristes chercheront des services de voyage au Maroc.",
      },
      {
        title: "Offre limitée",
        desc: "Très peu d'agences marocaines sont actuellement visibles sur les plateformes internationales.",
      },
      {
        title: "Avantage du pionnier",
        desc: "Les premiers inscrits bénéficieront d'une meilleure visibilité et d'un positionnement privilégié.",
      },
    ],
    canStats: [
      { value: "24", label: "Équipes" },
      { value: "6", label: "Villes hôtes" },
      { value: "1M+", label: "Visiteurs attendus" },
    ],

    // What You Get
    whatYouGetTitle: "Ce que vous obtenez",
    whatYouGetSubtitle: "Un investissement unique pour une visibilité permanente",
    benefits: [
      {
        title: "Page dédiée",
        desc: "Une page professionnelle pour présenter votre agence et vos services.",
      },
      {
        title: "Visibilité internationale",
        desc: "Attirez des clients du monde entier grâce à notre audience globale.",
      },
      {
        title: "Référencement Google",
        desc: "Bénéficiez de notre SEO optimisé pour apparaître dans les recherches.",
      },
      {
        title: "Contact direct",
        desc: "Les clients vous contactent directement, sans intermédiaire.",
      },
      {
        title: "Inscription à vie",
        desc: "Un seul paiement, une présence permanente. Pas d'abonnement mensuel.",
      },
      {
        title: "Mise à jour facile",
        desc: "Modifiez vos informations à tout moment.",
      },
    ],

    // How It Works
    howItWorksTitle: "Comment ça marche",
    howItWorksSubtitle: "Trois étapes simples pour être visible",
    steps: [
      { step: "1", title: "Remplissez le formulaire", desc: "Entrez les informations de votre agence en quelques minutes." },
      { step: "2", title: "Effectuez le paiement", desc: "Transférez 500 DH via virement bancaire." },
      { step: "3", title: "Vous êtes en ligne", desc: "Votre agence est visible dans les 24 heures." },
    ],
    startNow: "Commencer maintenant",

    // Payment
    paymentTitle: "Informations de paiement",
    paymentSubtitle: "Paiement unique",
    paymentHolder: "Titulaire",
    paymentBank: "Banque",
    copyBtn: "Copier",
    copiedBtn: "Copié",
    sendReceipt: "Envoyez votre reçu par WhatsApp",
    sendReceiptDesc: "Après le paiement, envoyez une photo du reçu pour activer votre inscription.",
    openWhatsApp: "Ouvrir WhatsApp",

    // FAQ
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        q: "Combien de temps pour être en ligne ?",
        a: "Votre agence sera visible dans les 24 heures suivant la confirmation de votre paiement.",
      },
      {
        q: "Est-ce un paiement unique ou un abonnement ?",
        a: "C'est un paiement unique de 500 DH. Il n'y a pas de frais mensuels ni d'abonnement à renouveler.",
      },
      {
        q: "Comment les clients me contacteront ?",
        a: "Vos coordonnées (téléphone, email, adresse) seront affichées sur votre page. Les clients vous contactent directement.",
      },
      {
        q: "Puis-je modifier mes informations après l'inscription ?",
        a: "Oui, contactez-nous via WhatsApp pour mettre à jour vos informations à tout moment.",
      },
    ],

    // Final CTA
    finalCtaTitle: "Prêt à développer votre clientèle internationale ?",
    finalCtaText: "Rejoignez les agences de voyage déjà présentes sur TravelAgencies.World et accédez à des milliers de voyageurs du monde entier.",
    finalCtaBtn: "Inscrivez votre agence maintenant",
    finalCtaSecondary: "Voir les informations de paiement",

    // Form Section
    formTitle: "Formulaire d'inscription",
    formSubtitle: "Remplissez ce formulaire pour démarrer votre inscription",
    fillForm: "Remplir le formulaire Google",
  },
  en: {
    // Hero Section
    heroTag: "CAN 2025 — A Historic Opportunity for Moroccan Agencies",
    heroTitle: "Join the International Travel Agency Directory",
    heroSubtitle: "TravelAgencies.World connects travelers worldwide with the best agencies. Launched in France, expanded to the United States, our platform is now scaling to Morocco. Be among the first to seize this opportunity.",
    heroCta: "Register Your Agency",
    heroSecondary: "Discover the Offer",
    heroFeatures: ["Lifetime Registration", "Live within 24h", "No Subscription"],
    priceLabel: "One-time Price",
    priceValue: "500",
    priceCurrency: "DH",
    priceNote: "One-time payment — permanent visibility",

    // Trust Stats
    stats: [
      { value: "2670+", label: "Listed Agencies" },
      { value: "45+", label: "Countries Covered" },
      { value: "50K+", label: "Monthly Visitors" },
    ],

    // Who We Are
    whoWeAreTitle: "Who We Are",
    whoWeAreSubtitle: "A Trusted International Platform",
    whoWeAreText: "TravelAgencies.World is an international travel agency directory, founded in France and developed in the United States. Our mission: connect travelers with reliable agencies worldwide. Today, we're opening our doors to Morocco to offer local agencies unprecedented international visibility.",
    whoWeArePoints: [
      "Presence in over 45 countries",
      "More than 2670 travel agencies listed",
      "Thousands of international travelers every month",
      "Google-optimized SEO",
    ],

    // Why Morocco
    whyMoroccoTitle: "Why Morocco? Why Now?",
    whyMoroccoSubtitle: "CAN 2025 represents a unique opportunity",
    whyMoroccoText: "Morocco will host the Africa Cup of Nations 2025, attracting over one million international visitors. This is the perfect time to position your agency to meet this massive demand.",
    whyMoroccoReasons: [
      {
        title: "Explosive Demand",
        desc: "Millions of supporters and tourists will be looking for travel services in Morocco.",
      },
      {
        title: "Limited Supply",
        desc: "Very few Moroccan agencies are currently visible on international platforms.",
      },
      {
        title: "First-Mover Advantage",
        desc: "Early registrants will benefit from better visibility and privileged positioning.",
      },
    ],
    canStats: [
      { value: "24", label: "Teams" },
      { value: "6", label: "Host Cities" },
      { value: "1M+", label: "Expected Visitors" },
    ],

    // What You Get
    whatYouGetTitle: "What You Get",
    whatYouGetSubtitle: "A one-time investment for permanent visibility",
    benefits: [
      {
        title: "Dedicated Page",
        desc: "A professional page to showcase your agency and services.",
      },
      {
        title: "International Visibility",
        desc: "Attract clients from around the world through our global audience.",
      },
      {
        title: "Google SEO",
        desc: "Benefit from our optimized SEO to appear in search results.",
      },
      {
        title: "Direct Contact",
        desc: "Clients contact you directly, with no intermediary.",
      },
      {
        title: "Lifetime Registration",
        desc: "One payment, permanent presence. No monthly subscription.",
      },
      {
        title: "Easy Updates",
        desc: "Update your information anytime.",
      },
    ],

    // How It Works
    howItWorksTitle: "How It Works",
    howItWorksSubtitle: "Three simple steps to get visible",
    steps: [
      { step: "1", title: "Fill the Form", desc: "Enter your agency information in just a few minutes." },
      { step: "2", title: "Make the Payment", desc: "Transfer 500 DH via bank transfer." },
      { step: "3", title: "You're Live", desc: "Your agency is visible within 24 hours." },
    ],
    startNow: "Start Now",

    // Payment
    paymentTitle: "Payment Information",
    paymentSubtitle: "One-time Payment",
    paymentHolder: "Account Holder",
    paymentBank: "Bank",
    copyBtn: "Copy",
    copiedBtn: "Copied",
    sendReceipt: "Send Your Receipt via WhatsApp",
    sendReceiptDesc: "After payment, send a photo of your receipt to activate your registration.",
    openWhatsApp: "Open WhatsApp",

    // FAQ
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "How long to go live?",
        a: "Your agency will be visible within 24 hours after your payment is confirmed.",
      },
      {
        q: "Is this a one-time payment or a subscription?",
        a: "It's a one-time payment of 500 DH. There are no monthly fees or recurring subscriptions.",
      },
      {
        q: "How will clients contact me?",
        a: "Your contact details (phone, email, address) will be displayed on your page. Clients contact you directly.",
      },
      {
        q: "Can I update my information after registration?",
        a: "Yes, contact us via WhatsApp to update your information at any time.",
      },
    ],

    // Final CTA
    finalCtaTitle: "Ready to Grow Your International Clientele?",
    finalCtaText: "Join travel agencies already listed on TravelAgencies.World and reach thousands of travelers from around the world.",
    finalCtaBtn: "Register Your Agency Now",
    finalCtaSecondary: "View Payment Information",

    // Form Section
    formTitle: "Registration Form",
    formSubtitle: "Fill out this form to start your registration",
    fillForm: "Fill Google Form",
  },
  ar: {
    // Hero Section
    heroTag: "كأس أمم أفريقيا 2025 — فرصة تاريخية للوكالات المغربية",
    heroTitle: "انضموا إلى دليل وكالات السفر الدولي",
    heroSubtitle: "TravelAgencies.World يربط المسافرين من جميع أنحاء العالم بأفضل الوكالات. انطلقنا من فرنسا، وتوسعنا إلى الولايات المتحدة، ونحن الآن نفتح أبوابنا للمغرب. كونوا من الأوائل في اغتنام هذه الفرصة.",
    heroCta: "سجّل وكالتك",
    heroSecondary: "اكتشف العرض",
    heroFeatures: ["تسجيل مدى الحياة", "تفعيل خلال 24 ساعة", "بدون اشتراك"],
    priceLabel: "سعر موحد",
    priceValue: "500",
    priceCurrency: "درهم",
    priceNote: "دفعة واحدة — ظهور دائم",

    // Trust Stats
    stats: [
      { value: "+2670", label: "وكالة مسجلة" },
      { value: "+45", label: "دولة" },
      { value: "+50 ألف", label: "زائر شهرياً" },
    ],

    // Who We Are
    whoWeAreTitle: "من نحن؟",
    whoWeAreSubtitle: "منصة دولية موثوقة",
    whoWeAreText: "TravelAgencies.World هو دليل دولي لوكالات السفر، تأسس في فرنسا وتطور في الولايات المتحدة. مهمتنا: ربط المسافرين بوكالات موثوقة في جميع أنحاء العالم. اليوم، نفتح أبوابنا للمغرب لنقدم للوكالات المحلية ظهوراً دولياً غير مسبوق.",
    whoWeArePoints: [
      "تواجد في أكثر من 45 دولة",
      "أكثر من 2670 وكالة سفر مسجلة",
      "آلاف المسافرين الدوليين كل شهر",
      "تحسين محركات البحث على Google",
    ],

    // Why Morocco
    whyMoroccoTitle: "لماذا المغرب؟ لماذا الآن؟",
    whyMoroccoSubtitle: "كأس أمم أفريقيا 2025 فرصة فريدة",
    whyMoroccoText: "سيستضيف المغرب كأس الأمم الأفريقية 2025، مستقطباً أكثر من مليون زائر دولي. هذا هو الوقت المثالي لوضع وكالتك في مواجهة هذا الطلب الهائل.",
    whyMoroccoReasons: [
      {
        title: "طلب متزايد",
        desc: "ملايين المشجعين والسياح سيبحثون عن خدمات السفر في المغرب.",
      },
      {
        title: "عرض محدود",
        desc: "عدد قليل جداً من الوكالات المغربية ظاهرة حالياً على المنصات الدولية.",
      },
      {
        title: "ميزة الريادة",
        desc: "المسجلون الأوائل سيستفيدون من ظهور أفضل ومكانة متميزة.",
      },
    ],
    canStats: [
      { value: "24", label: "منتخب" },
      { value: "6", label: "مدن مستضيفة" },
      { value: "+1 مليون", label: "زائر متوقع" },
    ],

    // What You Get
    whatYouGetTitle: "ماذا ستحصل عليه",
    whatYouGetSubtitle: "استثمار واحد لظهور دائم",
    benefits: [
      {
        title: "صفحة مخصصة",
        desc: "صفحة احترافية لعرض وكالتك وخدماتك.",
      },
      {
        title: "ظهور دولي",
        desc: "اجذب عملاء من جميع أنحاء العالم من خلال جمهورنا العالمي.",
      },
      {
        title: "تحسين Google",
        desc: "استفد من SEO المحسّن للظهور في نتائج البحث.",
      },
      {
        title: "تواصل مباشر",
        desc: "العملاء يتواصلون معك مباشرة، بدون وسيط.",
      },
      {
        title: "تسجيل مدى الحياة",
        desc: "دفعة واحدة، تواجد دائم. لا اشتراك شهري.",
      },
      {
        title: "تحديث سهل",
        desc: "حدّث معلوماتك في أي وقت.",
      },
    ],

    // How It Works
    howItWorksTitle: "كيف يعمل",
    howItWorksSubtitle: "ثلاث خطوات بسيطة للظهور",
    steps: [
      { step: "1", title: "املأ الاستمارة", desc: "أدخل معلومات وكالتك في دقائق معدودة." },
      { step: "2", title: "أجرِ الدفع", desc: "حوّل 500 درهم عبر التحويل البنكي." },
      { step: "3", title: "أنت مرئي", desc: "وكالتك ظاهرة خلال 24 ساعة." },
    ],
    startNow: "ابدأ الآن",

    // Payment
    paymentTitle: "معلومات الدفع",
    paymentSubtitle: "دفعة واحدة",
    paymentHolder: "صاحب الحساب",
    paymentBank: "البنك",
    copyBtn: "نسخ",
    copiedBtn: "تم النسخ",
    sendReceipt: "أرسل إيصالك عبر WhatsApp",
    sendReceiptDesc: "بعد الدفع، أرسل صورة من الإيصال لتفعيل تسجيلك.",
    openWhatsApp: "فتح WhatsApp",

    // FAQ
    faqTitle: "الأسئلة الشائعة",
    faqs: [
      {
        q: "كم من الوقت للظهور؟",
        a: "ستكون وكالتك مرئية خلال 24 ساعة بعد تأكيد الدفع.",
      },
      {
        q: "هل هذا دفع لمرة واحدة أم اشتراك؟",
        a: "إنها دفعة واحدة بقيمة 500 درهم. لا توجد رسوم شهرية أو اشتراكات متجددة.",
      },
      {
        q: "كيف سيتواصل معي العملاء؟",
        a: "ستُعرض بيانات الاتصال الخاصة بك (هاتف، بريد إلكتروني، عنوان) على صفحتك. العملاء يتواصلون معك مباشرة.",
      },
      {
        q: "هل يمكنني تحديث معلوماتي بعد التسجيل؟",
        a: "نعم، تواصل معنا عبر WhatsApp لتحديث معلوماتك في أي وقت.",
      },
    ],

    // Final CTA
    finalCtaTitle: "مستعد لتنمية عملائك الدوليين؟",
    finalCtaText: "انضم إلى وكالات السفر المسجلة بالفعل على TravelAgencies.World واصل إلى آلاف المسافرين من جميع أنحاء العالم.",
    finalCtaBtn: "سجّل وكالتك الآن",
    finalCtaSecondary: "عرض معلومات الدفع",

    // Form Section
    formTitle: "استمارة التسجيل",
    formSubtitle: "املأ هذه الاستمارة لبدء تسجيلك",
    fillForm: "ملء استمارة Google",
  },
};

export default function InscriptionMaroc() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>("fr");

  const t = content[lang];
  const isRtl = lang === "ar";

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const googleFormUrl = "https://forms.gle/2uy1cRSPCch7GxZ38";

  const benefitIcons = [Building2, Globe, Search, Phone, CheckCircle, Zap];

  return (
    <div className={`min-h-screen bg-white ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* Language Selector */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-end gap-2">
          <button
            onClick={() => setLang("fr")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${lang === "fr" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
          >
            Français
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${lang === "en" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("ar")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${lang === "ar" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
          >
            العربية
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1920"
            alt="Morocco"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 lg:py-24">
          {/* Trust Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {t.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={isRtl ? "text-right" : ""}>
              <div className={`inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6 ${isRtl ? "flex-row-reverse" : ""}`}>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">
                  {t.heroTag}
                </span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-6">
                {t.heroTitle}
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                {t.heroSubtitle}
              </p>

              <div className={`flex flex-wrap gap-6 text-slate-400 text-sm mb-8 ${isRtl ? "flex-row-reverse" : ""}`}>
                {t.heroFeatures.map((feature, index) => (
                  <div key={index} className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className={`flex flex-col sm:flex-row gap-4 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
                <a
                  href="#form"
                  className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors ${isRtl ? "flex-row-reverse" : ""}`}
                >
                  {t.heroCta}
                  <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                </a>
                <a
                  href="#benefits"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
                >
                  {t.heroSecondary}
                </a>
              </div>
            </div>

            {/* Benefits Card (No Price) */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {lang === "ar" ? "انضم إلى شبكتنا الدولية" : lang === "en" ? "Join Our Global Network" : "Rejoignez notre réseau international"}
                </h3>
                <p className="text-slate-500 text-sm">
                  {lang === "ar" ? "أكثر من 2670 وكالة في 45+ دولة" : lang === "en" ? "2670+ agencies in 45+ countries" : "Plus de 2670 agences dans 45+ pays"}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <ul className="space-y-3">
                  {t.benefits.slice(0, 6).map((benefit, index) => (
                    <li key={index} className={`flex items-center gap-3 text-slate-700 ${isRtl ? "flex-row-reverse text-right" : ""}`}>
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>{benefit.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#form"
                className={`mt-8 w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-lg font-semibold transition-colors ${isRtl ? "flex-row-reverse" : ""}`}
              >
                {t.heroCta}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={isRtl ? "text-right order-2 lg:order-1" : ""}>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">{t.whoWeAreTitle}</h2>
              <p className="text-emerald-600 font-medium mb-6">{t.whoWeAreSubtitle}</p>
              <p className="text-slate-600 mb-8 leading-relaxed">{t.whoWeAreText}</p>

              <ul className="space-y-4">
                {t.whoWeArePoints.map((point, index) => (
                  <li key={index} className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`relative ${isRtl ? "order-1 lg:order-2" : ""}`}>
              <img
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800"
                alt="Global Travel"
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">45+</div>
                <div className="text-emerald-100 text-sm">{lang === "ar" ? "دولة" : lang === "en" ? "Countries" : "Pays"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Morocco Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`text-center mb-12 ${isRtl ? "text-right" : ""}`}>
            <h2 className="text-3xl font-bold mb-3">{t.whyMoroccoTitle}</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">{t.whyMoroccoSubtitle}</p>
          </div>

          <p className={`text-center text-emerald-50 max-w-3xl mx-auto mb-12 ${isRtl ? "text-right" : ""}`}>
            {t.whyMoroccoText}
          </p>

          {/* CAN 2025 Stats */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
            <div className="grid grid-cols-3 gap-8">
              {t.canStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold">{stat.value}</div>
                  <div className="text-emerald-200 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.whyMoroccoReasons.map((reason, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  {index === 0 && <TrendingUp className="w-6 h-6" />}
                  {index === 1 && <Users className="w-6 h-6" />}
                  {index === 2 && <Star className="w-6 h-6" />}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isRtl ? "text-right" : ""}`}>{reason.title}</h3>
                <p className={`text-emerald-100 text-sm ${isRtl ? "text-right" : ""}`}>{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section id="benefits" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`text-center mb-12 ${isRtl ? "text-right" : ""}`}>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t.whatYouGetTitle}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{t.whatYouGetSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className={`text-lg font-semibold text-slate-900 mb-2 ${isRtl ? "text-right" : ""}`}>
                    {benefit.title}
                  </h3>
                  <p className={`text-slate-600 text-sm ${isRtl ? "text-right" : ""}`}>{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`text-center mb-12 ${isRtl ? "text-right" : ""}`}>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t.howItWorksTitle}</h2>
            <p className="text-slate-600">{t.howItWorksSubtitle}</p>
          </div>

          <div className={`grid md:grid-cols-3 gap-8 ${isRtl ? "direction-rtl" : ""}`}>
            {t.steps.map((item, index) => (
              <div key={index} className="text-center relative">
                {index < 2 && (
                  <div className={`hidden md:block absolute top-7 ${isRtl ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"} w-full h-0.5 bg-slate-200`} />
                )}
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold relative z-10">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="#form"
              className={`inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors ${isRtl ? "flex-row-reverse" : ""}`}
            >
              {t.startNow}
              <ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className={`text-3xl font-bold text-slate-900 mb-12 ${isRtl ? "text-right" : "text-center"}`}>
            {t.faqTitle}
          </h2>

          <div className="space-y-3">
            {t.faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={`w-full flex items-center justify-between p-5 text-left font-medium text-slate-900 hover:bg-slate-50 transition-colors ${isRtl ? "flex-row-reverse text-right" : ""}`}
                >
                  {faq.q}
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {openFaq === index && (
                  <div className={`px-5 pb-5 text-slate-600 ${isRtl ? "text-right" : ""}`}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="form" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className={`text-center mb-8 ${isRtl ? "text-right" : ""}`}>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t.formTitle}</h2>
            <p className="text-slate-600">{t.formSubtitle}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 text-center">
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg ${isRtl ? "flex-row-reverse" : ""}`}
            >
              {t.fillForm}
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t.finalCtaTitle}
          </h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            {t.finalCtaText}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRtl ? "sm:flex-row-reverse" : ""}`}>
            <a
              href="#form"
              className={`inline-flex items-center justify-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-lg font-semibold transition-colors ${isRtl ? "flex-row-reverse" : ""}`}
            >
              {t.finalCtaBtn}
              <ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </a>
            <a
              href="#paiement"
              className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              {t.finalCtaSecondary}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
