"use client";

import { useState } from "react";
import {
  Globe,
  CheckCircle,
  Users,
  Search,
  Shield,
  Infinity,
  ChartLine,
  Copy,
  Phone,
  Building,
  CreditCard,
  MessageCircle,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function InscriptionMaroc() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const benefits = [
    {
      icon: Globe,
      title: "Visibilité Mondiale",
      description:
        "Soyez visible par des millions de voyageurs à travers le monde cherchant des agences au Maroc.",
    },
    {
      icon: Search,
      title: "SEO Optimisé",
      description:
        "Notre site est optimisé pour les moteurs de recherche, augmentant vos chances d'être trouvé.",
    },
    {
      icon: Users,
      title: "Clients Qualifiés",
      description:
        "Recevez des demandes de clients réellement intéressés par vos services de voyage.",
    },
    {
      icon: ChartLine,
      title: "Croissance Garantie",
      description:
        "Développez votre activité grâce à une exposition internationale continue.",
    },
    {
      icon: Shield,
      title: "Crédibilité Renforcée",
      description:
        "Être listé sur un annuaire professionnel renforce la confiance de vos futurs clients.",
    },
    {
      icon: Infinity,
      title: "Inscription à Vie",
      description:
        "Un seul paiement de 500 DH pour une visibilité permanente. Pas d'abonnement!",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Effectuez le paiement",
      description: "Transférez 500 DH vers notre compte bancaire ci-dessous",
    },
    {
      number: 2,
      title: "Envoyez le reçu",
      description:
        "Envoyez-nous le reçu de paiement + les infos de votre agence via WhatsApp",
    },
    {
      number: 3,
      title: "Profitez!",
      description:
        "Votre agence sera en ligne sous 24h et visible dans le monde entier",
    },
  ];

  const faqs = [
    {
      question: "Combien de temps pour être en ligne ?",
      answer:
        "Votre agence sera visible sur TravelAgencies.World dans les 24 heures suivant la réception de votre paiement et des informations de votre agence.",
    },
    {
      question: "Est-ce un paiement unique ou un abonnement ?",
      answer:
        "C'est un paiement unique de 500 DH. Votre agence restera visible à vie sur notre plateforme, sans frais supplémentaires ni abonnement mensuel.",
    },
    {
      question: "Puis-je modifier mes informations après inscription ?",
      answer:
        "Oui, vous pouvez nous contacter à tout moment via WhatsApp pour mettre à jour les informations de votre agence gratuitement.",
    },
    {
      question: "Quels moyens de paiement acceptez-vous ?",
      answer:
        "Nous acceptons les virements bancaires vers notre compte BMCE. Les coordonnées complètes sont disponibles dans la section paiement ci-dessous.",
    },
    {
      question: "Comment les clients me contacteront-ils ?",
      answer:
        "Vos coordonnées (téléphone, email, site web) seront affichées sur votre page dédiée. Les clients pourront vous contacter directement via ces canaux.",
    },
  ];

  const includedFeatures = [
    "Page dédiée pour votre agence",
    "Affichage de vos coordonnées complètes",
    "Lien vers votre site web",
    "Visibilité sur Google",
    "Exposition aux clients internationaux",
    "Support dédié",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-green-700 overflow-hidden">
        {/* Moroccan Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* CAN 2025 Morocco Background Image */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('https://www.financialafrik.com/wp-content/uploads/2024/09/CAN-2025-Maroc.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-2xl">🇲🇦</span>
                <span className="text-sm font-medium">
                  Offre spéciale CAN 2025 Maroc ⚽
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Référencez Votre{" "}
                <span className="text-yellow-400">Agence de Voyage</span> sur
                l'Annuaire Mondial
              </h1>

              <p className="text-lg text-white/90 mb-8">
                Augmentez votre visibilité internationale et attirez des clients
                du monde entier grâce à notre plateforme dédiée aux agences de
                voyage.
              </p>

              {/* Price Badge */}
              <div className="inline-block mb-8">
                <div className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full text-3xl font-bold shadow-xl animate-pulse">
                  💰 Seulement 500 DH
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span>Inscription à vie</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span>Visibilité mondiale</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span>Activation sous 24h</span>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                <h3 className="text-xl font-bold text-gray-900">
                  Ce qui est inclus
                </h3>
              </div>

              <ul className="space-y-4">
                {includedFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <a
                  href="#paiement"
                  className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  S'inscrire maintenant
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Flag Bar */}
        <div className="h-2 bg-gradient-to-r from-red-600 via-red-600 to-green-600" />
      </section>

      {/* CAN 2025 Section */}
      <section className="py-12 bg-gradient-to-r from-green-800 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://i0.wp.com/media.lequipe.fr/img-photo-jpg/-eric-music-for-press-press-sports-press-sports-via-afp/1500000001941952/0:0,1996:1331-828-552-75/92cc5.jpg"
            alt="CAN 2025"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <span className="text-4xl">⚽</span>
                <h3 className="text-2xl lg:text-3xl font-bold">
                  CAN 2025 au Maroc !
                </h3>
                <span className="text-4xl">🏆</span>
              </div>
              <p className="text-lg text-white/90 max-w-xl">
                Des millions de supporters vont visiter le Maroc pendant la Coupe d'Afrique des Nations. 
                <strong> C'est le moment idéal pour référencer votre agence !</strong>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">24</div>
                <div className="text-white text-sm">Équipes</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">6</div>
                <div className="text-white text-sm">Villes hôtes</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">1M+</div>
                <div className="text-white text-sm">Visiteurs attendus</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi rejoindre TravelAgencies.World ?
            </h2>
            <p className="text-gray-600 text-lg">
              Découvrez les avantages d'être référencé sur notre annuaire
              mondial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-red-500"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-green-600 rounded-full flex items-center justify-center mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600 text-lg">
              3 étapes simples pour être référencé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {step.number}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-600">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%]">
                    <ArrowRight className="w-8 h-8 text-red-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section id="paiement" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-red-600 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-green-600 text-white text-center py-8 px-6">
              <CreditCard className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Informations de Paiement
              </h2>
              <div className="text-5xl font-bold">500 DH</div>
              <p className="text-white/80 mt-2">
                Paiement unique - Inscription à vie
              </p>
            </div>

            {/* Bank Details */}
            <div className="p-8">
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Coordonnées Bancaires
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-dashed border-gray-300">
                    <span className="text-gray-500 font-medium">
                      Type de compte
                    </span>
                    <span className="text-gray-900 font-semibold">
                      Compte Chèque Particulier
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-dashed border-gray-300">
                    <span className="text-gray-500 font-medium">Titulaire</span>
                    <span className="text-gray-900 font-semibold">
                      M. OUSSAMA MOUNAJJIM
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-dashed border-gray-300 gap-2">
                    <span className="text-gray-500 font-medium">RIB</span>
                    <div className="flex items-center gap-2">
                      <code className="text-gray-900 font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                        011 791 0000022000002914 19
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard("011791000002200000291419", "rib")
                        }
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        {copiedField === "rib" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-dashed border-gray-300 gap-2">
                    <span className="text-gray-500 font-medium">IBAN</span>
                    <div className="flex items-center gap-2">
                      <code className="text-gray-900 font-mono text-sm bg-gray-200 px-2 py-1 rounded break-all">
                        MA64 0117 9100 0002 2000 0029 1419
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            "MA64011791000002200000291419",
                            "iban"
                          )
                        }
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors flex-shrink-0"
                      >
                        {copiedField === "iban" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-2">
                    <span className="text-gray-500 font-medium">BIC</span>
                    <div className="flex items-center gap-2">
                      <code className="text-gray-900 font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                        BMCEMAMC
                      </code>
                      <button
                        onClick={() => copyToClipboard("BMCEMAMC", "bic")}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        {copiedField === "bic" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Section */}
              <div className="bg-green-500 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <MessageCircle className="w-8 h-8" />
                  <h3 className="text-xl font-bold">
                    Envoyez votre reçu sur WhatsApp
                  </h3>
                </div>

                <p className="text-center text-white/90 mb-4">
                  Après avoir effectué le paiement, envoyez-nous le reçu
                  accompagné des informations de votre agence :
                </p>

                <ul className="text-left mb-6 space-y-1 max-w-sm mx-auto">
                  <li>• Nom de l'agence</li>
                  <li>• Adresse complète</li>
                  <li>• Numéro de téléphone</li>
                  <li>• Email</li>
                  <li>• Site web (si disponible)</li>
                  <li>• Description de vos services</li>
                </ul>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 text-3xl font-bold">
                    <Phone className="w-8 h-8" />
                    +33 7 45 07 56 68
                  </div>
                </div>

                <a
                  href="https://wa.me/33745075668?text=Bonjour%2C%20je%20souhaite%20référencer%20mon%20agence%20de%20voyage%20sur%20TravelAgencies.World.%20Voici%20mon%20reçu%20de%20paiement%20%3A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white text-green-600 py-4 px-6 rounded-xl font-bold text-lg text-center hover:shadow-xl transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    Envoyer sur WhatsApp
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-gray-900 hover:text-red-600 transition-colors"
                >
                  {faq.question}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://www.financialafrik.com/wp-content/uploads/2024/09/CAN-2025-Maroc.jpg"
            alt="CAN 2025 Morocco"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center text-white relative z-10">
          <div className="text-5xl mb-4">🇲🇦 ⚽ 🏆</div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Prêt à profiter de la CAN 2025 ?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Des millions de supporters africains vont visiter le Maroc. Soyez visible et attirez ces nouveaux clients !
          </p>
          <a
            href="#paiement"
            className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all shadow-xl"
          >
            S'inscrire pour 500 DH
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Flag Bar */}
      <div className="h-2 bg-gradient-to-r from-red-600 via-red-600 to-green-600" />
    </div>
  );
}
