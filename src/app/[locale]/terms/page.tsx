import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Terms' });

  return {
    title: t('title') + " - TravelAgencies.World",
    description: t('intro.content').slice(0, 160) + "...",
  };
}

export default async function TermsPage() {
  const t = await getTranslations('Terms');
  return (
    <div className="min-h-screen bg-muted/30">
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-white/80">{t('lastUpdated')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2>{t('intro.title')}</h2>
              <p>{t('intro.content')}</p>

              <h2>{t('services.title')}</h2>
              <p>{t('services.content')}</p>

              <h2>{t('usage.title')}</h2>
              <p>{t('usage.content')}</p>
              <ul>
                {t.raw('usage.list').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h2>{t('accuracy.title')}</h2>
              <p>{t('accuracy.content')}</p>
              <p>
                <span dangerouslySetInnerHTML={{ __html: t.raw('accuracy.warning') }} />
              </p>

              <h2>{t('disclaimer.title')}</h2>
              <p>{t('disclaimer.content')}</p>

              <h2>{t('links.title')}</h2>
              <p>{t('links.content')}</p>

              <h2>{t('intellectual.title')}</h2>
              <p>{t('intellectual.content')}</p>

              <h2>{t('limitation.title')}</h2>
              <p>{t('limitation.content')}</p>

              <h2>{t('indemnity.title')}</h2>
              <p>{t('indemnity.content')}</p>

              <h2>{t('changes.title')}</h2>
              <p>{t('changes.content')}</p>

              <h2>{t('law.title')}</h2>
              <p>{t('law.content')}</p>

              <h2>{t('contact.title')}</h2>
              <p>
                {t('contact.content')}
              </p>
              <ul>
                <li>{t('contact.email')}</li>
                <li>
                  {t('contact.developer')} <a href="https://orioustrategy.com">Orious Strategy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
