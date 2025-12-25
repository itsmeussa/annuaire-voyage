import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Privacy' });

  return {
    title: t('title') + " - TravelAgencies.World",
    description: t('intro.content').slice(0, 160) + "...",
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations('Privacy');
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
              <p>
                {t('intro.content')}
              </p>

              <h2>{t('collect.title')}</h2>
              <p>{t('collect.content')}</p>
              <ul>
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t.raw('collect.personal') }} />
                </li>
                <li>
                  <span dangerouslySetInnerHTML={{ __html: t.raw('collect.usage') }} />
                </li>
              </ul>

              <h2>{t('use.title')}</h2>
              <p>{t('use.content')}</p>
              <ul>
                {t.raw('use.list').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h2>{t('sharing.title')}</h2>
              <p>
                {t('sharing.content')}
              </p>

              <h2>{t('cookies.title')}</h2>
              <p>
                {t('cookies.content')}
              </p>

              <h2>{t('thirdParty.title')}</h2>
              <p>
                {t('thirdParty.content')}
              </p>

              <h2>{t('security.title')}</h2>
              <p>
                {t('security.content')}
              </p>

              <h2>{t('rights.title')}</h2>
              <p>{t('rights.content')}</p>
              <ul>
                {t.raw('rights.list').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h2>{t('contact.title')}</h2>
              <p>
                {t('contact.content')}
              </p>
              <ul>
                <li>{t('contact.email')}</li>
                <li>
                  {t('contact.website')} <a href="https://orioustrategy.com">Orious Strategy</a>
                </li>
              </ul>

              <h2>{t('changes.title')}</h2>
              <p>
                {t('changes.content')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
