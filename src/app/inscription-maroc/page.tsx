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
} from "lucide-react";

export default function InscriptionMaroc() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const googleFormUrl = "https://forms.gle/2uy1cRSPCch7GxZ38";

  const benefits = [
    {
      icon: Globe,
      title: "Visibilité Mondiale",
      description: "Soyez trouvé par des voyageurs du monde entier recherchant des agences au Maroc.",
    },
    {
      icon: Search,
      title: "Référencement Google",
      description: "Profitez de notre SEO optimisé pour apparaître dans les résultats de recherche.",
    },
    {
      icon: Users,
      title: "Clients Qualifiés",
      description: "Recevez des demandes de clients vraiment intéressés par vos services.",
    },
    {
      icon: TrendingUp,
      title: "Croissance Assurée",
      description: "Développez votre clientèle grâce à une exposition internationale.",
    },
    {
      icon: Shield,
      title: "Crédibilité",
      description: "Renforcez la confiance avec une présence sur un annuaire professionnel.",
    },
    {
      icon: CheckCircle,
      title: "Inscription à Vie",
      description: "Un seul paiement, une visibilité permanente. Pas d'abonnement.",
    },
  ];

  const faqs = [
    {
      question: "Combien de temps pour être en ligne ?",
      answer: "Votre agence sera visible dans les 24 heures suivant la réception de votre paiement.",
    },
    {
      question: "Est-ce un paiement unique ou un abonnement ?",
      answer: "C'est un paiement unique de 500 DH. Pas de frais mensuels ni d'abonnement.",
    },
    {
      question: "Puis-je modifier mes informations ?",
      answer: "Oui, contactez-nous via WhatsApp pour mettre à jour vos informations gratuitement.",
    },
    {
      question: "Comment les clients me contacteront ?",
      answer: "Vos coordonnées seront affichées sur votre page. Les clients vous contactent directement.",
    },
  ];

  const includedFeatures = [
    "Page dédiée pour votre agence",
    "Coordonnées complètes affichées",
    "Lien vers votre site web",
    "Visibilité sur Google",
    "Clients internationaux",
    "Support WhatsApp",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1920"
            alt="Morocco"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">
                  CAN 2025 — Opportunité unique
                </span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Référencez votre agence sur l'annuaire mondial
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Rejoignez plus de 3800 agences de voyage déjà présentes sur TravelAgencies.World 
                et attirez des clients du monde entier.
              </p>

              <div className="flex flex-wrap gap-6 text-slate-400 text-sm mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Inscription à vie</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Activation 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Sans abonnement</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Remplir le formulaire
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#paiement"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
                >
                  Voir le tarif
                </a>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-sm text-slate-500 mb-1">Prix unique</div>
                <div className="text-5xl font-bold text-slate-900">500 <span className="text-2xl">DH</span></div>
                <div className="text-slate-500 mt-1">Inscription à vie</div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <ul className="space-y-3">
                  {includedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-700">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-lg font-semibold transition-colors"
              >
                Commencer l'inscription
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CAN 2025 Banner */}
      <section className="bg-emerald-600 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white text-center md:text-left">
              <p className="font-semibold">CAN 2025 au Maroc</p>
              <p className="text-emerald-100 text-sm">Des millions de supporters vont visiter le pays. C'est le moment idéal pour être visible.</p>
            </div>
            <div className="flex gap-6 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">24</div>
                <div className="text-xs text-emerald-100">Équipes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">6</div>
                <div className="text-xs text-emerald-100">Villes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1M+</div>
                <div className="text-xs text-emerald-100">Visiteurs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Pourquoi rejoindre TravelAgencies.World ?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Notre annuaire vous connecte avec des voyageurs du monde entier
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Comment ça marche
            </h2>
            <p className="text-slate-600">Trois étapes simples pour être référencé</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Formulaire", desc: "Remplissez vos informations" },
              { step: "2", title: "Paiement", desc: "Transférez 500 DH" },
              { step: "3", title: "En ligne", desc: "Visible sous 24h" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section id="paiement" className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-slate-900 text-white text-center py-8 px-6">
              <h2 className="text-xl font-semibold mb-2">Informations de paiement</h2>
              <div className="text-4xl font-bold">500 DH</div>
              <p className="text-slate-400 text-sm mt-1">Paiement unique</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-500">Titulaire</span>
                  <span className="font-medium text-slate-900">M. OUSSAMA MOUNAJJIM</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-500">Banque</span>
                  <span className="font-medium text-slate-900">BMCE</span>
                </div>

                <div className="py-3 border-b border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500">RIB</span>
                    <button
                      onClick={() => copyToClipboard("011791000002200000291419", "rib")}
                      className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1"
                    >
                      {copiedField === "rib" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedField === "rib" ? "Copié" : "Copier"}
                    </button>
                  </div>
                  <code className="text-slate-900 text-sm bg-slate-100 px-3 py-2 rounded block font-mono">
                    011 791 0000022000002914 19
                  </code>
                </div>

                <div className="py-3 border-b border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500">IBAN</span>
                    <button
                      onClick={() => copyToClipboard("MA64011791000002200000291419", "iban")}
                      className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1"
                    >
                      {copiedField === "iban" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedField === "iban" ? "Copié" : "Copier"}
                    </button>
                  </div>
                  <code className="text-slate-900 text-sm bg-slate-100 px-3 py-2 rounded block font-mono break-all">
                    MA64 0117 9100 0002 2000 0029 1419
                  </code>
                </div>

                <div className="py-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500">BIC</span>
                    <button
                      onClick={() => copyToClipboard("BMCEMAMC", "bic")}
                      className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1"
                    >
                      {copiedField === "bic" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedField === "bic" ? "Copié" : "Copier"}
                    </button>
                  </div>
                  <code className="text-slate-900 text-sm bg-slate-100 px-3 py-2 rounded block font-mono">
                    BMCEMAMC
                  </code>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="mt-8 p-6 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Envoyez votre reçu</p>
                    <p className="text-slate-500 text-sm">+33 7 45 07 56 68</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/33745075668?text=Bonjour%2C%20je%20souhaite%20référencer%20mon%20agence%20de%20voyage%20sur%20TravelAgencies.World.%20Voici%20mon%20reçu%20de%20paiement%20%3A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Ouvrir WhatsApp
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Questions fréquentes
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {faq.question}
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-slate-600">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à développer votre clientèle ?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Rejoignez les agences de voyage déjà présentes sur TravelAgencies.World
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              S'inscrire maintenant
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#paiement"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Voir les tarifs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
