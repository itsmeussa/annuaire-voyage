import { Link } from "@/navigation";
import Image from "next/image";
import {
  Users,
  Target,
  Award,
  Globe,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'About' });

  return {
    title: t('title') + " | " + t('stats.agencies'),
    description: t('mission'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('About');

  const stats = [
    { value: "3800+", label: t('stats.agencies') },
    { value: "50+", label: t('stats.countries') },
    { value: "10K+", label: t('stats.visitors') },
    { value: "4.5", label: t('stats.rating') },
  ];

  const values = [
    {
      icon: Target,
      title: t('values.transparency'),
      description: t('values.transparencyDesc'),
    },
    {
      icon: Users,
      title: t('values.userFirst'),
      description: t('values.userFirstDesc'),
    },
    {
      icon: Award,
      title: t('values.quality'),
      description: t('values.qualityDesc'),
    },
    {
      icon: Globe,
      title: t('values.globalReach'),
      description: t('values.globalReachDesc'),
    },
  ];

  // Structured data for About page
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: t('title'),
    description: t('mission'),
    url: "https://www.travelagencies.world/about",
    mainEntity: {
      "@type": "Organization",
      name: "TravelAgencies.World",
      description: t('mission'),
      numberOfEmployees: "2-10",
      foundingDate: "2024"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.travelagencies.world"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://www.travelagencies.world/about"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="hero-gradient text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {t('mission')}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                {t('story.title')}
              </h2>
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="prose prose-lg mx-auto text-slate-600">
                  <blockquote className="text-2xl md:text-3xl font-medium text-slate-900 border-l-4 border-primary pl-6 mb-10 not-italic leading-relaxed">
                    "{t('story.quote')}"
                  </blockquote>

                  <p className="mb-6 leading-relaxed">
                    {t('story.p1')}
                  </p>

                  <p className="mb-6 leading-relaxed">
                    {t('story.p2')}
                  </p>

                  <p className="leading-relaxed">
                    {t('story.p3')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              {t('values.title')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {t('team.title')}
              </h2>
              <p className="text-lg text-slate-600">
                {t('team.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Oussama */}
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                      <Image
                        src="/travellogos/ous.jpg"
                        alt="Oussama Mounajjim"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 text-center mb-1">
                    Oussama Mounajjim
                  </h3>
                  <p className="text-primary font-medium text-center mb-4">{t('team.oussamaRole')}</p>
                  <p className="text-slate-600 text-center mb-6">
                    {t('team.oussamaDesc')}
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="https://www.linkedin.com/in/oussama-mounajjim/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white rounded-full font-medium hover:bg-[#006396] transition-colors shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      {t('team.connect')}
                    </a>
                  </div>
                </div>
              </div>

              {/* Zakaria */}
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                      <Image
                        src="/travellogos/zak.jpg"
                        alt="Zakaria Kharoufi"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 text-center mb-1">
                    Zakaria Kharoufi
                  </h3>
                  <p className="text-indigo-600 font-medium text-center mb-4">{t('team.zakariaRole')}</p>
                  <p className="text-slate-600 text-center mb-6">
                    {t('team.zakariaDesc')}
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="https://www.linkedin.com/in/zakaria-kharoufi-9595671ba/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white rounded-full font-medium hover:bg-[#006396] transition-colors shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      {t('team.connect')}
                    </a>
                  </div>
                </div>
              </div>

              {/* Ahmed */}
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                      <Image
                        src="/travellogos/ahmed.jpg"
                        alt="Ahmed Moukhafi"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 text-center mb-1">
                    Ahmed Moukhafi
                  </h3>
                  <p className="text-emerald-600 font-medium text-center mb-4">{t('team.ahmedRole')}</p>
                  <p className="text-slate-600 text-center mb-6">
                    {t('team.ahmedDesc')}
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="https://www.linkedin.com/in/ahmed-moukhafi-a1b14913b/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white rounded-full font-medium hover:bg-[#006396] transition-colors shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      {t('team.connect')}
                    </a>
                  </div>
                </div>
              </div>

              {/* Amine */}
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                      <Image
                        src="/travellogos/amine.jpg"
                        alt="Amine Arbaoui"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 text-center mb-1">
                    Amine Arbaoui
                  </h3>
                  <p className="text-orange-600 font-medium text-center mb-4">{t('team.amineRole')}</p>
                  <p className="text-slate-600 text-center mb-6">
                    {t('team.amineDesc')}
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="https://www.linkedin.com/in/amine-arbaoui-3b6839218/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white rounded-full font-medium hover:bg-[#006396] transition-colors shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      {t('team.connect')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {t('trust.title')}
                </h2>
                <ul className="space-y-4">
                  {[
                    t('trust.verified'),
                    t('trust.search'),
                    t('trust.contact'),
                    t('trust.coverage'),
                    t('trust.updates'),
                    t('trust.free'),
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/agencies"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {t('trust.browse')}
                    <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {t('trust.builtBy')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t('trust.builtDesc1')}
                </p>
                <p className="text-muted-foreground mb-6">
                  {t('trust.builtDesc2')}
                </p>
                <a
                  href="https://orioustrategy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  {t('trust.visitOrious')}
                  <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 hero-gradient text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors"
            >
              {t('cta.button')}
              <ArrowRight className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
