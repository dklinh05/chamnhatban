import { getMessages, isLocale, locales, type Locale } from '@chamnhatban/i18n';
import { Heading } from '@chamnhatban/ui';
import { notFound } from 'next/navigation';

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale as Locale);

  return (
    <main>
      <Heading>{messages['home.title']}</Heading>
      <p>{messages['home.intro']}</p>
    </main>
  );
}
